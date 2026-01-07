const express = require('express');
const router = express.Router();
const pool = require('../db');

// 获取所有交易记录
router.get('/', async (req, res) => {
  try {
    const { symbol, methodId, result, startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM trades WHERE 1=1';
    const params = [];

    if (symbol) {
      query += ' AND symbol = ?';
      params.push(symbol);
    }
    if (methodId) {
      query += ' AND methodId = ?';
      params.push(methodId);
    }
    if (result) {
      query += ' AND result = ?';
      params.push(result);
    }
    if (startDate) {
      query += ' AND entryTime >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND entryTime <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY entryTime DESC';

    const [rows] = await pool.query(query, params);
    
    // 处理 tags (MySQL 中存储为 JSON 字符串或 JSON 类型)
    const formattedRows = rows.map(row => ({
      ...row,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags
    }));

    res.json({
      success: true,
      data: formattedRows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取单个交易记录
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM trades WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      const trade = rows[0];
      trade.tags = typeof trade.tags === 'string' ? JSON.parse(trade.tags) : trade.tags;
      res.json({
        success: true,
        data: trade
      });
    } else {
      res.status(404).json({
        success: false,
        message: '交易记录不存在'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建新交易记录
router.post('/', async (req, res) => {
  try {
    const trade = req.body;
    const profit = calculateProfit(trade);
    const profitPercent = calculateProfitPercent(trade);

    const [result] = await pool.query(
      'INSERT INTO trades (symbol, direction, entryPrice, exitPrice, entryTime, exitTime, lots, profit, profitPercent, methodId, methodName, notes, tags, result, riskRewardRatio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        trade.symbol, trade.direction, trade.entryPrice, trade.exitPrice,
        trade.entryTime, trade.exitTime, trade.lots, profit,
        profitPercent, trade.methodId, trade.methodName, trade.notes,
        JSON.stringify(trade.tags || []), trade.result, trade.riskRewardRatio
      ]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, ...trade, profit, profitPercent }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新交易记录
router.put('/:id', async (req, res) => {
  try {
    const trade = req.body;
    const profit = calculateProfit(trade);
    const profitPercent = calculateProfitPercent(trade);

    const [result] = await pool.query(
      'UPDATE trades SET symbol = ?, direction = ?, entryPrice = ?, exitPrice = ?, entryTime = ?, exitTime = ?, lots = ?, profit = ?, profitPercent = ?, methodId = ?, methodName = ?, notes = ?, tags = ?, result = ?, riskRewardRatio = ? WHERE id = ?',
      [
        trade.symbol, trade.direction, trade.entryPrice, trade.exitPrice,
        trade.entryTime, trade.exitTime, trade.lots, profit,
        profitPercent, trade.methodId, trade.methodName, trade.notes,
        JSON.stringify(trade.tags || []), trade.result, trade.riskRewardRatio,
        req.params.id
      ]
    );

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        data: { id: req.params.id, ...trade, profit, profitPercent }
      });
    } else {
      res.status(404).json({
        success: false,
        message: '交易记录不存在'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除交易记录
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM trades WHERE id = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: '删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '交易记录不存在'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 辅助函数：计算盈亏
function calculateProfit(trade) {
  const { direction, entryPrice, exitPrice, lots } = trade;
  const pipValue = 10; 
  const pips = direction === 'long' 
    ? (exitPrice - entryPrice) * 10000 
    : (entryPrice - exitPrice) * 10000;
  return Math.round(pips * lots * pipValue);
}

// 辅助函数：计算盈亏百分比
function calculateProfitPercent(trade) {
  const { direction, entryPrice, exitPrice } = trade;
  const percent = direction === 'long'
    ? ((exitPrice - entryPrice) / entryPrice) * 100
    : ((entryPrice - exitPrice) / entryPrice) * 100;
  return Math.round(percent * 100) / 100;
}

module.exports = router;