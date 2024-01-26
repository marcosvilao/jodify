require('dotenv').config()

const configDB = () => {
    const config = {
      user:  process.env.USER ,
      host:  process.env.HOST,
      password:  process.env.PASSWORD,
      port:  process.env.PORT,
      ssl: true
    }
    return config;
  } 

  module.exports = {
    configDB
  }