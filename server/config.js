require("dotenv").config();

const configDB = () => {
  const config = {
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    ssl: true,
  };
  console.log(config);
  return config;
};
configDB();

const PASSNODEMAILER = process.env.PASSNODEMAILER;
const JWT_SECRET_RESET_PASSWORD = process.env.JWT_SECRET_RESET_PASSWORD;

module.exports = {
  configDB,
  PASSNODEMAILER,
  JWT_SECRET_RESET_PASSWORD,
};
