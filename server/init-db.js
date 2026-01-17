const mysql = require('mysql2/promise');
const { methods, trades } = require('./data/mockData');
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

  // 导入初始数据 (如果表为空)
  const [methodRows] = await connection.query('SELECT COUNT(*) as count FROM methods');
  if (methodRows[0].count === 0) {
    console.log('正在导入初始方法数据...');
    for (const method of methods) {
      await connection.query(
        'INSERT INTO methods (id, code, name, description, is_default, usage_count, win_rate, total_pnl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [method.id, method.code, method.name, method.description, method.is_default, method.usage_count, method.win_rate, method.total_pnl]
      );
    }
  }

  const [tradeRows] = await connection.query('SELECT COUNT(*) as count FROM trades');
  if (tradeRows[0].count === 0) {
    console.log('正在导入初始交易数据...');
    for (const trade of trades) {
      // 模拟数据中的 methodId 是数字，但 methods 表中的 id 是 UUID 字符串
      // 这里需要处理一下，或者在实际应用中统一
      // 为了演示，我们先简单处理
      const mId = typeof trade.methodId === 'number' ? methods[trade.methodId - 1]?.id : trade.methodId;
      
      await connection.query(
        'INSERT INTO trades (symbol, direction, entryPrice, exitPrice, entryTime, exitTime, lots, profit, expectedProfit, methodId, methodName, notes, tags, result) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          trade.symbol, trade.direction, trade.entryPrice, trade.exitPrice, 
          trade.entryTime, trade.exitTime, trade.lots, trade.profit, 
          trade.expectedProfit || null, 
          mId, trade.methodName, trade.notes, 
          JSON.stringify(trade.tags), trade.result
        ]
      );
    }
  }

  console.log('数据库初始化完成！');
  await connection.end();
}

initDB().catch(err => {
  console.error('初始化数据库失败:', err);
  process.exit(1);
});