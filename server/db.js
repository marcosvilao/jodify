const {Pool} = require('pg')
const {db} = require('./config.js')

const pool = new Pool({
  user: 'postgres',
  password: 'Flatron2009',
  host: 'localhost',
  port: 5432,
  database: 'jodifydb'
})
console.log('conection success')

module.exports = pool