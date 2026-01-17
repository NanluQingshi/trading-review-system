#!/bin/bash
echo "🚀 启动交易复盘统计系统..."
echo ""

# 初始化数据库
echo "🔄 初始化数据库..."
node server/scripts/init-db.js
echo ""

# 检查是否已安装依赖
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo "📦 检测到缺少依赖，正在安装..."
    npm run install-all
    echo ""
fi

echo "✅ 依赖检查完成"
echo ""
echo "🔧 启动服务..."
echo "   - 后端服务: http://localhost:5050"
echo "   - 前端界面: http://localhost:3000"
echo ""
echo "💡 提示: 按 Ctrl+C 停止服务"
echo ""

# 启动服务
npm run dev
