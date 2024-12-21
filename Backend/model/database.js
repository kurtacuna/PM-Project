// Overview:
// Connects to the database

const db = require('mysql2');

const pool = db.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'pm_project_database',
    connectionLimit: 10
}).promise();

module.exports = pool;