# 📊 交易复盘统计系统

> 本地化的交易复盘和数据统计平台，帮助您系统地记录和分析交易数据

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ 特性

- 🎯 **三大核心功能** - Method 库、交易复盘、数据统计
- 📊 **数据可视化** - 多种图表展示交易数据
- 💾 **本地部署** - 数据隐私安全可控
- 🎨 **美观界面** - 基于 Ant Design 的专业 UI
- 🚀 **开箱即用** - 包含示例数据，快速上手
- 📱 **响应式设计** - 适配不同屏幕尺寸

---

## 🚀 快速开始

### 一键启动

```bash
cd trading-review-system
./start.sh
```

然后访问：http://localhost:3000

### 或使用 npm 命令

```bash
# 安装依赖（首次使用）
npm run install-all

# 启动开发服务器
npm run dev
```

---

## 📚 核心功能

### 1. Method 库管理 📚
管理您的交易方法库
- ✅ 创建、编辑、删除交易方法
- ✅ 按分类组织（趋势、震荡、形态等）
- ✅ 记录详细的交易规则
- ✅ 追踪每个方法的胜率

### 2. 交易复盘 📊
详细记录每笔交易
- ✅ 记录交易的所有细节
- ✅ 关联使用的交易方法
- ✅ 添加交易笔记和标签
- ✅ 分类管理（盈利/亏损/保本）

### 3. 我的统计 📈
多维度数据分析
- ✅ 核心指标展示（胜率、盈亏、盈亏因子等）
- ✅ 可视化图表（曲线、饼图、柱状图）
- ✅ 按货币对统计
- ✅ 按方法统计

---

## 🛠️ 技术栈

### 前端
- **React 18** - 现代化 UI 框架
- **TypeScript** - 类型安全
- **Ant Design** - 企业级 UI 组件库
- **Recharts** - 数据可视化
- **React Router** - 路由管理

### 后端
- **Node.js** - JavaScript 运行时
- **Express** - Web 框架
- **SQLite3** - 轻量级数据库（准备就绪）

---

## 📖 文档

- 📘 **[开始使用.md](开始使用.md)** - 快速入门指南 ⭐ 推荐首先阅读
- 📗 **[功能演示指南.md](功能演示指南.md)** - 详细功能演示
- 📙 **[使用指南.md](使用指南.md)** - 完整使用说明
- 📕 **[快速参考.md](快速参考.md)** - 命令速查手册
- 📔 **[项目说明.md](项目说明.md)** - 技术文档
- 📓 **[API测试.md](API测试.md)** - API 文档
- 📖 **[文档索引.md](文档索引.md)** - 文档导航

---

## 📁 项目结构

```
trading-review-system/
├── client/                 # React 前端
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   ├── services/      # API 服务
│   │   └── types/         # TypeScript 类型
│   └── package.json
├── server/                # Node.js 后端
│   ├── data/             # 模拟数据
│   ├── routes/           # API 路由
│   └── package.json
├── start.sh              # 快速启动脚本
├── test-api.sh          # API 测试脚本
└── README.md            # 项目说明
```

---

## 🎯 使用场景

- 📝 系统记录每笔交易
- 📊 分析交易数据和表现
- 🎯 优化交易策略
- 💰 提升交易业绩
- 📈 追踪长期进步

---

## 💡 示例数据

系统预置了示例数据供您学习：
- **4个交易方法** - 不同类型的交易策略
- **8条交易记录** - 涵盖多个货币对
- **完整统计数据** - 胜率 62.5%，盈亏因子 7.6

---

## 🔧 常用命令

```bash
# 安装所有依赖
npm run install-all

# 启动开发服务器（前后端）
npm run dev

# 单独启动后端
npm run server

# 单独启动前端
npm run client

# 测试 API
./test-api.sh
```

---

## 🌐 访问地址

- **前端界面**: http://localhost:3000
- **后端 API**: http://localhost:5000/api
- **健康检查**: http://localhost:5000/api/health

---

## 📊 数据说明

### 当前版本
- 使用模拟数据（内存存储）
- 重启后重置为初始数据
- 适合学习和测试

### 未来版本
- SQLite 数据库持久化
- 数据导入/导出功能
- 云同步（可选）

---

## 🎓 学习路径

1. **第一天** - 阅读 [开始使用.md](开始使用.md)，启动系统
2. **第一周** - 阅读 [功能演示指南.md](功能演示指南.md)，熟悉功能
3. **第一月** - 持续使用，积累数据
4. **长期** - 根据数据优化策略

---

## 🤝 贡献

欢迎提出建议和反馈！

---

## 📄 许可证

MIT License - 自由使用和修改

---

## 🙏 致谢

- 灵感来源：[PriceActionHub](https://pahubcn.com)
- UI 组件：[Ant Design](https://ant.design/)
- 图表库：[Recharts](https://recharts.org/)

---

## 🎉 开始使用

```bash
./start.sh
```

**祝您交易顺利！** 🚀📈💰

---

**需要帮助？** 查看 [开始使用.md](开始使用.md) 或 [文档索引.md](文档索引.md)
