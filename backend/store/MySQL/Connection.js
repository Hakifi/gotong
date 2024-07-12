const mysql = require('mysql2');
require('dotenv').config({ path: './secret/.env' });
const operationalStatus = process.env.OPERATIONAL;

let pool;

if (operationalStatus == 1) {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

module.exports = pool;