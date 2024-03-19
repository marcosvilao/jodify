const { Pool } = require('pg');
const {db} = require('./config.js')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.QA_POSTGRES_URL + "?sslmode=require",
})
console.log('conection success')

module.exports = pool