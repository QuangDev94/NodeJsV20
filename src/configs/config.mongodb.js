"use strict";

// Level 0

// const config = {
//   app: {
//     port: 3000,
//   },
//   db: {
//     host: "localhost",
//     port: 27017,
//     name: "shopDev",
//   },
// };

// Level 1

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    host: process.env.DEV_DATABASE_HOST || "localhost",
    port: process.env.DEV_DATABASE_PORT || 27017,
    name: process.env.DEV_DATABASE_NAME || "shopDev",
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT,
  },
  db: {
    host: process.env.PRO_DATABASE_HOST,
    port: process.env.PRO_DATABASE_PORT || 27017,
    name: process.env.PRO_DATABASE_NAME || "shopPro",
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
