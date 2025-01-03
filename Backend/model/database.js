// Overview:
// Connects to the database

const db = require('mysql2');
require('dotenv').config();

const pool = db.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10
}).promise();

module.exports = pool;