# Docker 部署说明

## 环境要求

- Docker 20.10+ 
- Docker Compose (或 Docker v2 内置的 `docker compose` 命令)

## 部署步骤

### 1. 安装 Docker 和 Docker Compose

**Windows/Mac**
- 下载并安装 [Docker Desktop](https://www.docker.com/products/docker-desktop)

**Linux**
```bash
# 安装 Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# 安装 Docker Compose
sudo apt-get install docker-compose-plugin
```

### 2. 构建镜像

在项目根目录执行以下命令：

```bash
# 使用 docker compose (Docker v2)
docker compose build

# 或使用 docker-compose (旧版本)
docker-compose build
```

### 3. 启动服务

```bash
# 启动所有服务（后台运行）
docker compose up -d

# 或使用 docker-compose
docker-compose up -d
```

### 4. 访问应用

- **前端应用**：http://localhost
- **后端 API**：http://localhost:5050/api
- **API 健康检查**：http://localhost:5050/api/health

### 5. 查看日志

```bash
# 查看所有服务日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f server
```

### 6. 停止服务

```bash
# 停止所有服务
docker compose down

# 停止并删除所有容器、网络和卷
docker compose down -v
```

## 配置说明

### 环境变量

在 `docker-compose.yml` 文件中可以配置以下环境变量：

| 服务 | 环境变量 | 说明 | 默认值 |
|------|----------|------|--------|
| db | MYSQL_DATABASE | 数据库名称 | trading-review-system |
| db | MYSQL_ROOT_PASSWORD | 数据库根密码 | your_secure_password |
| server | DB_HOST | 数据库主机 | db |
| server | DB_USER | 数据库用户名 | root |
| server | DB_PASSWORD | 数据库密码 | your_secure_password |
| server | DB_NAME | 数据库名称 | trading-review-system |

### 端口映射

| 服务 | 容器端口 | 主机端口 |
|------|----------|----------|
| db | 3306 | 3306 |
| server | 5050 | 5050 |
| client | 80 | 80 |

## 项目结构

```
trading-review-system/
├── client/              # 前端 React 应用
│   ├── Dockerfile       # 前端 Dockerfile
│   └── ...
├── server/              # 后端 Node.js 应用
│   ├── Dockerfile       # 后端 Dockerfile
│   └── ...
├── docker-compose.yml   # Docker Compose 配置文件
└── README_DOCKER.md     # Docker 部署说明
```

## Dockerfile 说明

### 后端 Dockerfile (`server/Dockerfile`)
- 基于 `node:18-alpine` 镜像
- 安装生产依赖
- 暴露 5050 端口
- 启动命令：`node index.js`

### 前端 Dockerfile (`client/Dockerfile`)
- 多阶段构建：
  - 第一阶段：基于 `node:18-alpine` 构建 React 应用
  - 第二阶段：基于 `nginx:alpine` 托管静态文件
- 暴露 80 端口
- 启动命令：`nginx -g daemon off;`

## 数据管理

### 数据库备份

```bash
# 备份数据库
docker compose exec db mysqldump -u root -p trading-review-system > backup.sql
```

### 数据库恢复

```bash
# 恢复数据库
docker compose exec -i db mysql -u root -p trading-review-system < backup.sql
```

## 常见问题

### 1. 端口冲突

如果主机端口已被占用，可以修改 `docker-compose.yml` 中的端口映射，例如：

```yaml
services:
  client:
    ports:
      - "8080:80"  # 将主机端口从 80 改为 8080
```

### 2. 数据库连接失败

- 确保数据库容器已成功启动
- 检查 `docker-compose.yml` 中的环境变量配置
- 查看服务器日志：`docker compose logs server`

### 3. 前端无法连接后端

- 确保后端服务已成功启动
- 检查前端 API 配置（通常在 `client/src/services/api.ts` 中）
- 查看前端日志：`docker compose logs client`

## 更新应用

1. 更新代码后重新构建镜像：
   ```bash
   docker compose build
   ```

2. 重启服务：
   ```bash
   docker compose up -d
   ```

## 生产环境建议

1. 修改默认密码，使用强密码
2. 配置 HTTPS（可以使用 Nginx 或 Traefik 等反向代理）
3. 启用日志收集和监控
4. 配置自动备份策略
5. 考虑使用 Kubernetes 进行容器编排（大规模部署）

## 开发环境使用

### 修改配置文件

如果需要在开发环境中使用不同的配置，可以创建 `.env` 文件：

```bash
# 服务器配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=trading-review-system

# 前端配置
REACT_APP_API_URL=http://localhost:5050/api
```

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 或分别启动前后端
cd server && npm run dev
cd client && npm start
```

---

通过以上步骤，您可以在本地或服务器上使用 Docker 快速部署和运行交易复盘系统。