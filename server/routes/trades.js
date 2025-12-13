const express = require('express');
const router = express.Router();
const { trades } = require('../data/mockData');
let tradesData = [...trades];

// 获取所有交易记录
router.get('/', (req, res) => {
  const { symbol, methodId, result, startDate, endDate } = req.query;
  
  let filteredTrades = [...tradesData];
  
  // 按货币对筛选
  if (symbol) {
    filteredTrades = filteredTrades.filter(t => t.symbol === symbol);
  }
  
  // 按方法筛选
  if (methodId) {
    filteredTrades = filteredTrades.filter(t => t.methodId === parseInt(methodId));
  }
  
  // 按结果筛选
  if (result) {
    filteredTrades = filteredTrades.filter(t => t.result === result);
  }
  
  // 按日期范围筛选
  if (startDate) {
    filteredTrades = filteredTrades.filter(t => t.entryTime >= startDate);
  }
  if (endDate) {
    filteredTrades = filteredTrades.filter(t => t.entryTime <= endDate);
  }
  
  res.json({
    success: true,
    data: filteredTrades.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime))
  });
});

// 获取单个交易记录
router.get('/:id', (req, res) => {
  const trade = tradesData.find(t => t.id === parseInt(req.params.id));
  if (trade) {
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
});

// 创建新交易记录
router.post('/', (req, res) => {
  const newTrade = {
    id: tradesData.length > 0 ? Math.max(...tradesData.map(t => t.id)) + 1 : 1,
    ...req.body,
    profit: calculateProfit(req.body),
    profitPercent: calculateProfitPercent(req.body)
  };
  tradesData.push(newTrade);
  res.status(201).json({
    success: true,
    data: newTrade
  });
});

// 更新交易记录
router.put('/:id', (req, res) => {
  const index = tradesData.findIndex(t => t.id === parseInt(req.params.id));
  if (index !== -1) {
    tradesData[index] = {
      ...tradesData[index],
      ...req.body,
      profit: calculateProfit({ ...tradesData[index], ...req.body }),
      profitPercent: calculateProfitPercent({ ...tradesData[index], ...req.body })
    };
    res.json({
      success: true,
      data: tradesData[index]
    });
  } else {
    res.status(404).json({
      success: false,
      message: '交易记录不存在'
    });
  }
});

// 删除交易记录
router.delete('/:id', (req, res) => {
  const index = tradesData.findIndex(t => t.id === parseInt(req.params.id));
  if (index !== -1) {
    tradesData.splice(index, 1);
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
});

// 辅助函数：计算盈亏
function calculateProfit(trade) {
  const { direction, entryPrice, exitPrice, lots } = trade;
  const pipValue = 10; // 简化计算，实际应根据货币对和手数计算
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
