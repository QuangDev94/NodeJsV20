"use strict";

const apiKeyModel = require("../models/apiKey.model");
const crypto = require("node:crypto");
const findById = async (key) => {
  try {
    await apiKeyModel.create({
      key: crypto.randomBytes(64).toString("hex"),
      permissions: ["0000"],
    });
    const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
    return objKey;
  } catch (error) {
    console.log(`error::`, error);
  }
};

module.exports = {
  findById,
};
