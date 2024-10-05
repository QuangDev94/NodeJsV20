"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const _SECOND = 5000;
const countConnects = () => {
  const numConnections = mongoose.connections.length;
  console.log(`Number of connections::${numConnections}`);
};

const checkOverLoadConnections = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    console.log(`Active connections: ${numConnections}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024}`);
    // Max of connection for each core is 5
    const maxConnections = numCores * 5;
    if (numConnections >= maxConnections) {
      console.log(`Connection overload detected! ${maxConnections}`);
    }
  }, _SECOND);
};

module.exports = {
  countConnects,
  checkOverLoadConnections,
};
