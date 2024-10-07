"use strict ";

const mongoose = require("mongoose");
const {
  db: { host, port, name },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;
console.log(connectString);
class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    // Dev
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, {
        // not over 50 connection simultaneously
        maxPoolSize: 50,
      })
      .then((_) => console.log(`connect to mongodb success PRO!`))
      .catch((err) => console.log(`connect to mongodb failed!--${err}`));
  }
  // Static định nghĩa 1 phương thức tĩnh, thuộc về phương thức prototype(nguyên mẫu) của 1 class và được lưu trong constructor
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;

// Singleton Pattern (get only one instance)
