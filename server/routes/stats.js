const express = require('express');
const router = express.Router();
const { trades, methods } = require('../data/mockData');
// 获取统计数据
router.get('/', (req, res) => {
  const { startDate, endDate } = req.query;
  
  let filteredTrades = [...trades];
  
  // 按日期范围筛选
  if (startDate) {
    filteredTrades = filteredTrades.filter(t => t.entryTime >= startDate);
  }
  if (endDate) {
    filteredTrades = filteredTrades.filter(t => t.entryTime <= endDate);
  }
  
  // 基础统计
  const totalTrades = filteredTrades.length;
  const winTrades = filteredTrades.filter(t => t.result === 'win').length;
  const lossTrades = filteredTrades.filter(t => t.result === 'loss').length;
  const breakevenTrades = filteredTrades.filter(t => t.result === 'breakeven').length;
  
  const winRate = totalTrades > 0 ? (winTrades / totalTrades * 100).toFixed(2) : 0;
  
  const totalProfit = filteredTrades.reduce((sum, t) => sum + t.profit, 0);
  const avgProfit = totalTrades > 0 ? (totalProfit / totalTrades).toFixed(2) : 0;
  
  const winningProfit = filteredTrades
    .filter(t => t.result === 'win')
    .reduce((sum, t) => sum + t.profit, 0);
  const losingProfit = Math.abs(filteredTrades
    .filter(t => t.result === 'loss')
    .reduce((sum, t) => sum + t.profit, 0));
  
  const avgWin = winTrades > 0 ? (winningProfit / winTrades).toFixed(2) : 0;
  const avgLoss = lossTrades > 0 ? (losingProfit / lossTrades).toFixed(2) : 0;
  const profitFactor = losingProfit > 0 ? (winningProfit / losingProfit).toFixed(2) : 0;
  
  // 按货币对统计
  const symbolStats = {};
  filteredTrades.forEach(trade => {
    if (!symbolStats[trade.symbol]) {
      symbolStats[trade.symbol] = {
        symbol: trade.symbol,
        count: 0,
        wins: 0,
        profit: 0
      };
    }
    symbolStats[trade.symbol].count++;
    if (trade.result === 'win') symbolStats[trade.symbol].wins++;
    symbolStats[trade.symbol].profit += trade.profit;
  });
  
  const symbolStatsArray = Object.values(symbolStats).map(s => ({
    ...s,
    winRate: ((s.wins / s.count) * 100).toFixed(2)
  }));
  
  // 按方法统计
  const methodStats = {};
  filteredTrades.forEach(trade => {
    if (!methodStats[trade.methodId]) {
      methodStats[trade.methodId] = {
        methodId: trade.methodId,
        methodName: trade.methodName,
        count: 0,
        wins: 0,
        profit: 0
      };
    }
    methodStats[trade.methodId].count++;
    if (trade.result === 'win') methodStats[trade.methodId].wins++;
    methodStats[trade.methodId].profit += trade.profit;
  });
  
  const methodStatsArray = Object.values(methodStats).map(m => ({
    ...m,
    winRate: ((m.wins / m.count) * 100).toFixed(2)
  }));
  
  // 每日盈亏曲线
  const dailyProfits = {};
  filteredTrades.forEach(trade => {
    const date = trade.entryTime.split(' ')[0];
    if (!dailyProfits[date]) {
      dailyProfits[date] = 0;
    }
    dailyProfits[date] += trade.profit;
  });
  
  let cumulativeProfit = 0;
  const profitCurve = Object.keys(dailyProfits)
    .sort()
    .map(date => {
      cumulativeProfit += dailyProfits[date];
      return {
        date,
        profit: dailyProfits[date],
        cumulative: cumulativeProfit
      };
    });
  
  res.json({
    success: true,
    data: {
      overview: {
        totalTrades,
        winTrades,
        lossTrades,
        breakevenTrades,
        winRate: parseFloat(winRate),
        totalProfit,
        avgProfit: parseFloat(avgProfit),
        avgWin: parseFloat(avgWin),
        avgLoss: parseFloat(avgLoss),
        profitFactor: parseFloat(profitFactor)
      },
      symbolStats: symbolStatsArray,
      methodStats: methodStatsArray,
      profitCurve
    }
  });
});

// 获取最近交易
router.get('/recent', (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const recentTrades = [...trades]
    .sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime))
    .slice(0, limit);
  
  res.json({
    success: true,
    data: recentTrades
  });
});

module.exports = router;
