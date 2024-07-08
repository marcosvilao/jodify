const { Sequelize } = require('sequelize')
const pg = require('pg')
require('dotenv').config()

const DB_CONNECTION = process.env.DB_CONNECTION

let sequelize

if (DB_CONNECTION === 'DEPLOY') {
  sequelize = new Sequelize(process.env.POSTGRES_URL, {
    logging: false,
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  })
} else if (DB_CONNECTION === 'TESTING') {
  sequelize = new Sequelize(process.env.QA_POSTGRES_URL, {
    logging: false,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  })
}

module.exports = sequelize

// const { Pool } = require("pg");
// const { db } = require("./config.js");
// require("dotenv").config();

// const DB_CONNECTION = process.env.DB_CONNECTION;

// if (DB_CONNECTION === "DEPLOY") {
//   var pool = new Pool({
//     connectionString: process.env.POSTGRES_URL + "?sslmode=require",
//   });
// } else if (DB_CONNECTION === "TESTING") {
//   var pool = new Pool({
//     connectionString: process.env.QA_POSTGRES_URL + "?sslmode=require",
//   });
// }
// console.log("conection success");

// module.exports = pool;
