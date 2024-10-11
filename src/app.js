require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
// const bodyParser = require("body-parser");

const app = express();

// init middlewares
// Morgan Options [dev,combined,common,short,tiny]
app.use(morgan("dev"));
// Helmet (hide Header information)
app.use(helmet());
// Compression (save bandwidth)
app.use(compression());
// Body-Parser (Handles post requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// init database
require("./dbs/init.mongodb");

// init routes
app.use("", require("./routes"));

// handling errors

module.exports = app;
