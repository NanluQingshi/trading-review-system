const express = require('express');
const router = express.Router();
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
  const method = methodsData.find(m => m.id === parseInt(req.params.id));
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
    id: methodsData.length > 0 ? Math.max(...methodsData.map(m => m.id)) + 1 : 1,
    ...req.body,
    winRate: 0,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  methodsData.push(newMethod);
  res.status(201).json({
    success: true,
    data: newMethod
  });
});

// 更新方法
router.put('/:id', (req, res) => {
  const index = methodsData.findIndex(m => m.id === parseInt(req.params.id));
  if (index !== -1) {
    methodsData[index] = {
      ...methodsData[index],
      ...req.body,
      updatedAt: new Date().toISOString().split('T')[0]
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
  const index = methodsData.findIndex(m => m.id === parseInt(req.params.id));
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
