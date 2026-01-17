/*
 * @Author: NanluQingshi
 * @Date: 2026-01-14 17:04:24
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-01-18 00:59:44
 * @Description: 
 */
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;