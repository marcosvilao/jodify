require("dotenv").config();

const configDB = () => {
  const config = {
    user: process.env.QA_USER,
    host: process.env.QA_HOST,
    password: process.env.QA_PASSWORD,
    port: process.env.QA_PORT,
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
