const { Pool } = require('pg');
const {db} = require('./config.js')

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})
console.log('conection success')

module.exports = pool