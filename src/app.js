const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// init middlewares
// Morgan Options [dev,combined,common,short,tiny]
app.use(morgan("dev"));
// Helmet (hide Header information)
app.use(helmet());
// Compression (save bandwidth)
app.use(compression());

// init database
require("./dbs/init.mongodb");
// init routes
app.get("/", (req, res, next) => {
  const str = "Hello Bro";
  return res.status(200).json({
    message: "Welcome FanTipJs!",
    metadata: str.repeat(10000000),
  });
});

// handling errors
module.exports = app;
