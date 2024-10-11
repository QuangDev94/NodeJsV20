"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
// const crypto = require("crypto");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../utils/auth/auth");
const { getInforData } = require("../utils");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRIRER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // Step 1: Check email exits ??
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxxx",
          message: "Shop already registered!",
        };
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
          return {
            code: "xxxx",
            message: "keyStore error",
          };
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
    } catch (error) {
      console.log(error);
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
