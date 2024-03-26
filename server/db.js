const { Pool } = require("pg");
const { db } = require("./config.js");
require("dotenv").config();

const DB_CONNECTION = process.env.DB_CONNECTION;

if (DB_CONNECTION === "DEPLOY") {
  var pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  });
} else if (DB_CONNECTION === "TESTING") {
  var pool = new Pool({
    connectionString: process.env.QA_POSTGRES_URL + "?sslmode=require",
  });
}
console.log("conection success");

module.exports = pool;
