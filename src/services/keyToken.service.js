"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({
    shopId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // Level 0
      // publicKey dạng dữ liệu Buffer (data được băm nhỏ - được lưu ở vùng nhớ tạm)
      // const token = await keyTokenModel.create({
      //   shop: shopId,
      //   publicKey,
      //   privateKey,
      // });
      // return token ? token.publicKey : null;

      // level xxx
      const filter = { shop: shopId };
      const update = {
        publicKey,
        privateKey,
        refreshToken,
        refreshTokensUsed: [],
      };
      const options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options,
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
