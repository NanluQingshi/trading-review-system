/*
 * @Author: NanluQingshi
 * @Date: 2026-01-17 18:29:03
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-01-18 00:55:31
 * @Description: 初始化数据库，创建数据库和表结构
 */
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function initDB() {
  // 检查环境变量是否加载
  if (!process.env.DB_USER) {
    console.error('错误: 无法加载环境变量，请检查 server/.env 文件是否存在');
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  console.log('连接到 MySQL...');

  // 创建数据库 (使用反引号包裹数据库名，防止中划线导致报错)
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
  await connection.query(`USE \`${process.env.DB_NAME}\``);

  console.log(`数据库 ${process.env.DB_NAME} 已就绪`);

  // 创建 methods 表
  await connection.query(`
    CREATE TABLE IF NOT EXISTS methods (
      id VARCHAR(50) PRIMARY KEY,
      code VARCHAR(50) NOT NULL,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      is_default BOOLEAN DEFAULT FALSE,
      usage_count INT DEFAULT 0,
      win_rate FLOAT DEFAULT 0,
      total_pnl FLOAT DEFAULT 0
    )
  `);

  // 创建 trades 表
  await connection.query(`
    CREATE TABLE IF NOT EXISTS trades (
      id INT AUTO_INCREMENT PRIMARY KEY,
      symbol VARCHAR(20) NOT NULL,
      direction ENUM('long', 'short') NOT NULL,
      entryPrice FLOAT NOT NULL,
      exitPrice FLOAT NOT NULL,
      entryTime DATETIME NOT NULL,
      exitTime DATETIME NOT NULL,
      lots FLOAT NOT NULL,
      profit FLOAT NOT NULL,
      expectedProfit FLOAT DEFAULT NULL,
      methodId VARCHAR(50),
      methodName VARCHAR(100),
      notes TEXT,
      tags JSON,
      result ENUM('win', 'loss', 'breakeven') NOT NULL,
      FOREIGN KEY (methodId) REFERENCES methods(id) ON DELETE SET NULL
    )
  `);

  console.log('表结构已创建');

  console.log('数据库初始化完成！');
  await connection.end();
}

initDB().catch(err => {
  console.error('初始化数据库失败:', err);
  process.exit(1);
});