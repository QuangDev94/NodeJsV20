"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
// const crypto = require("crypto");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../utils/auth/auth");
const { getInforData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findShopByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRIRER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  /*
    1 - check email in dbs
    2 - match password
    3 - create publicKey vs privateKey and save
    4 - generate tokens
    5 - get data return login
   */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1. check email in dbs
    const foundShop = await findShopByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered");
    // 2. match password
    const matchPassword = bcrypt.compare(password, foundShop.password);
    if (!matchPassword) throw new AuthFailureError("Authentication error");
    // 3. create AT vs RT and save
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    // 4. generate tokens
    const tokens = await createTokenPair(
      { useId: foundShop._id, email },
      privateKey,
      publicKey,
    );
    console.log(tokens);
    await KeyTokenService.createKeyToken({
      shopId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      metadata: {
        shop: getInforData({
          fields: ["_id", "name", "email"],
          object: foundShop,
        }),
        tokens,
      },
    };
  };
  static signUp = async ({ name, email, password }) => {
    // Step 1: Check email exits ??
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered!");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      // Step 2: Create key pair
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      // Step 3: Create public key ,refresh token and save in database
      const keyStore = await KeyTokenService.createKeyToken({
        shopId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: keyStore error!");
      }

      // const publicKeyObject = crypto.createPublicKey(publicKeyString);
      // publicKeyObject.export({ format: "pem", type: "pkcs1" });

      // Step 4: create token pair and send to Shop

      const tokens = await createTokenPair(
        { shopId: newShop._id, email },
        privateKey,
        publicKey,
      );
      console.log(`Created Tokens success::`, tokens);
      return {
        code: 201,
        metadata: {
          shop: getInforData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };

  static logout = async (keyStore) => {
    return await KeyTokenService.removeKeyTokenById(keyStore._id);
  };

  static handlerRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.checkRefreshTokenExitsInRFUsed(
      refreshToken,
    );
    if (foundToken) {
      const { useId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey,
      );
      console.log({ useId, email });
      await KeyTokenService.removeKeyTokenByShopId(useId);
      throw new ForbiddenError("Something went wrong happend !! pls relogin");
    }

    const holderToken = await KeyTokenService.checkRefreshTokenExitsInDbs(
      refreshToken,
    );
    if (!holderToken) {
      throw new AuthFailureError("Shop not registered 1");
    }

    const { useId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey,
    );
    console.log("[2]--", { useId, email });

    const foundShop = await findShopByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError("Shop not registered 2");
    }

    const tokens = await createTokenPair(
      { useId, email },
      holderToken.privateKey,
      holderToken.publicKey,
    );

    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { useId, email },
      tokens,
    };
  };
}

module.exports = AccessService;
