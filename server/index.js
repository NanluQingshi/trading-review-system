require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodRoutes = require('./routes/methods');
const tradeRoutes = require('./routes/trades');
const statsRoutes = require('./routes/stats');
const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 路由
app.use('/api/methods', methodRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/stats', statsRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '交易复盘系统运行正常' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📊 API 地址: http://localhost:${PORT}/api`);
});