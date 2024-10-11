"use strict";

const { Schema, model } = require("mongoose");

const REFERENCE_DOCUMENT_NAME = "Shop";
const DOCUMENT_NAME = "KeyToken";
const COLLECTION_NAME = "KeyTokens";

// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema(
  {
    shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: REFERENCE_DOCUMENT_NAME,
    },
    privateKey: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
