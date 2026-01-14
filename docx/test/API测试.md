# API 接口测试文档

## 基础信息

- **Base URL**: http://localhost:5050/api
- **Content-Type**: application/json

## 健康检查

### GET /api/health

检查服务器是否正常运行

```bash
curl http://localhost:5050/api/health
```

**响应示例：**

```json
{
  "status": "ok",
  "message": "交易复盘系统运行正常"
}
```

---

## Method 库 API

### 1. 获取所有方法

**GET** `/api/methods`

```bash
curl http://localhost:5050/api/methods
```

### 2. 获取单个方法

**GET** `/api/methods/:id`

```bash
curl http://localhost:5050/api/methods/1
```

### 3. 创建新方法

**POST** `/api/methods`

```bash
curl -X POST http://localhost:5050/api/methods \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试方法",
    "category": "趋势跟踪",
    "description": "这是一个测试方法",
    "rules": "1. 规则一\n2. 规则二\n3. 规则三"
  }'
```

### 4. 更新方法

**PUT** `/api/methods/:id`

```bash
curl -X PUT http://localhost:5050/api/methods/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "更新后的方法名",
    "description": "更新后的描述"
  }'
```

### 5. 删除方法

**DELETE** `/api/methods/:id`

```bash
curl -X DELETE http://localhost:5050/api/methods/1
```

---

## 交易记录 API

### 1. 获取所有交易记录

**GET** `/api/trades`

支持查询参数：

- `symbol`: 货币对筛选
- `methodId`: 方法 ID 筛选
- `result`: 结果筛选 (win/loss/breakeven)
- `startDate`: 开始日期
- `endDate`: 结束日期

```bash
# 获取所有记录
curl http://localhost:5050/api/trades

# 筛选EUR/USD的交易
curl "http://localhost:5050/api/trades?symbol=EUR/USD"

# 筛选盈利的交易
curl "http://localhost:5050/api/trades?result=win"
```

### 2. 获取单个交易记录

**GET** `/api/trades/:id`

```bash
curl http://localhost:5050/api/trades/1
```

### 3. 创建新交易记录

**POST** `/api/trades`

```bash
curl -X POST http://localhost:5050/api/trades \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "EUR/USD",
    "direction": "long",
    "entryPrice": 1.0850,
    "exitPrice": 1.0920,
    "entryTime": "2024-12-10 09:30:00",
    "exitTime": "2024-12-10 15:45:00",
    "lots": 0.1,
    "methodId": 1,
    "methodName": "突破交易法",
    "result": "win",
    "riskRewardRatio": 2.5,
    "notes": "测试交易",
    "tags": ["测试", "突破"]
  }'
```

### 4. 更新交易记录

**PUT** `/api/trades/:id`

```bash
curl -X PUT http://localhost:5050/api/trades/1 \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "更新后的笔记",
    "tags": ["更新", "测试"]
  }'
```

### 5. 删除交易记录

**DELETE** `/api/trades/:id`

```bash
curl -X DELETE http://localhost:5050/api/trades/1
```

---

## 统计数据 API

### 1. 获取统计数据

**GET** `/api/stats`

支持查询参数：

- `startDate`: 开始日期
- `endDate`: 结束日期

```bash
# 获取所有统计
curl http://localhost:5050/api/stats

# 获取指定日期范围的统计
curl "http://localhost:5050/api/stats?startDate=2024-12-01&endDate=2024-12-31"
```

**响应示例：**

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalTrades": 8,
      "winTrades": 5,
      "lossTrades": 2,
      "breakevenTrades": 1,
      "winRate": 62.5,
      "totalProfit": 350,
      "avgProfit": 43.75,
      "avgWin": 76,
      "avgLoss": 25,
      "profitFactor": 3.04
    },
    "symbolStats": [...],
    "methodStats": [...],
    "profitCurve": [...]
  }
}
```

### 2. 获取最近交易

**GET** `/api/stats/recent`

支持查询参数：

- `limit`: 返回记录数量（默认 5）

```bash
# 获取最近5条交易
curl http://localhost:5050/api/stats/recent

# 获取最近10条交易
curl "http://localhost:5050/api/stats/recent?limit=10"
```

---

## 响应格式

### 成功响应

```json
{
  "success": true,
  "data": { ... }
}
```

### 错误响应

```json
{
  "success": false,
  "message": "错误信息"
}
```

---

## 测试脚本

### 完整测试流程

```bash
#!/bin/bash

echo "=== 测试健康检查 ==="
curl http://localhost:5050/api/health
echo -e "\n"

echo "=== 测试获取所有方法 ==="
curl http://localhost:5050/api/methods
echo -e "\n"

echo "=== 测试获取所有交易 ==="
curl http://localhost:5050/api/trades
echo -e "\n"

echo "=== 测试获取统计数据 ==="
curl http://localhost:5050/api/stats
echo -e "\n"

echo "=== 测试完成 ==="
```

保存为 `test-api.sh` 并执行：

```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 注意事项

1. **数据持久化**：当前版本使用内存存储，重启服务器后数据会重置
2. **CORS**：已配置允许跨域请求
3. **端口**：确保 5050 端口未被占用
4. **时间格式**：使用 `YYYY-MM-DD HH:mm:ss` 格式
