require("dotenv").config();

const SALT = parseInt(process.env.SALT);
const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT || 8000;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = parseInt(process.env.DB_PORT);

module.exports = {
    SALT,
    SECRET_KEY,
    PORT,
    DB_USER,
    DB_PASS,
    DB_NAME,
    DB_HOST,
    DB_PORT
}