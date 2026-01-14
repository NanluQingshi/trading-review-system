#!/bin/bash
echo "🧪 开始测试 API 接口..."
echo ""

echo "1️⃣ 测试健康检查..."
curl -s http://localhost:5050/api/health | python3 -m json.tool
echo ""
echo ""

echo "2️⃣ 测试获取所有方法..."
curl -s http://localhost:5050/api/methods | python3 -m json.tool | head -30
echo "..."
echo ""

echo "3️⃣ 测试获取所有交易记录..."
curl -s http://localhost:5050/api/trades | python3 -m json.tool | head -30
echo "..."
echo ""

echo "4️⃣ 测试获取统计数据..."
curl -s http://localhost:5050/api/stats | python3 -m json.tool | head -40
echo "..."
echo ""

echo "✅ API 测试完成！"
echo ""
echo "💡 提示："
echo "   - 前端界面: http://localhost:3000"
echo "   - 后端 API: http://localhost:5050/api"
