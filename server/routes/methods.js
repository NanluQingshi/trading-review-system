const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { methods } = require('../data/mockData');
let methodsData = [...methods];

// 获取所有方法
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: methodsData
  });
});

// 获取单个方法
router.get('/:id', (req, res) => {
  const method = methodsData.find(m => m.id === req.params.id);
  if (method) {
    res.json({
      success: true,
      data: method
    });
  } else {
    res.status(404).json({
      success: false,
      message: '方法不存在'
    });
  }
});

// 创建新方法
router.post('/', (req, res) => {
  const newMethod = {
    id: uuidv4(),
    ...req.body,
    win_rate: req.body.win_rate ?? 0,
    usage_count: req.body.usage_count ?? 0,
    total_pnl: req.body.total_pnl ?? 0
  };
  methodsData.push(newMethod);
  res.status(201).json({
    success: true,
    data: newMethod
  });
});

// 更新方法
router.put('/:id', (req, res) => {
  const index = methodsData.findIndex(m => m.id === req.params.id);
  if (index !== -1) {
    methodsData[index] = {
      ...methodsData[index],
      ...req.body
    };
    res.json({
      success: true,
      data: methodsData[index]
    });
  } else {
    res.status(404).json({
      success: false,
      message: '方法不存在'
    });
  }
});

// 删除方法
router.delete('/:id', (req, res) => {
  const index = methodsData.findIndex(m => m.id === req.params.id);
  if (index !== -1) {
    methodsData.splice(index, 1);
    res.json({
      success: true,
      message: '删除成功'
    });
  } else {
    res.status(404).json({
      success: false,
      message: '方法不存在'
    });
  }
});

module.exports = router;
