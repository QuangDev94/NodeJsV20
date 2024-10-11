"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({ shopId, publicKey, privateKey }) => {
    try {
      // publicKey dạng dữ liệu Buffer (data được băm nhỏ - được lưu ở vùng nhớ tạm)
      // const publicKeyString = publicKey.toString();
      const token = await keyTokenModel.create({
        shop: shopId,
        publicKey,
        privateKey,
      });

      return token ? token.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
