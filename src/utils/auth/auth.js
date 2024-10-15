"use strict";
const JWT = require("jsonwebtoken");
const asyncHandler = require("../../helpers/asyncHandler");
const {
  AuthFailureError,
  NotFoundError,
} = require("../../core/error.response");
const { findShopByShopId } = require("../../services/keyToken.service");

const HEADER = {
  CLIENT_ID: "x-client-id",
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, privateKey, publicKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const shopId = req.headers[HEADER.CLIENT_ID];
  if (!shopId) throw new AuthFailureError("Invalid ShopId Request");
  const keyStore = await findShopByShopId(shopId);
  if (!keyStore) throw new NotFoundError("Not Found ShopId in DBS");

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid AccessToken Request");

  try {
    const decodeShop = JWT.verify(accessToken, keyStore.publicKey);
    if (shopId !== decodeShop.useId)
      throw new AuthFailureError("Invalid AccessToken Verify");
    req.keyStore = keyStore;
    console.log("keyStore::", keyStore);
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
