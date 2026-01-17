# 构建阶段
FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物到 nginx 静态目录
COPY --from=build /app/build /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]