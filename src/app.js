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

// init database
require("./dbs/init.mongodb");

// init routes
app.use("", require("./routes"));

// handling errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  // 500 : server error
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});
module.exports = app;
