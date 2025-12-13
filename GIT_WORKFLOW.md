# Trading Review System - Git 工作流指南
## 📌 项目结构说明

本项目采用**单一仓库 + 子模块**的结构：

```
trading-review-system/          # 主仓库
├── server/                     # 后端代码（直接在主仓库中）
├── client/                     # 前端代码（Git 子模块）
└── 其他配置文件
```

### 为什么使用子模块？

- **独立管理**: 前端和后端可以独立版本控制
- **灵活部署**: 可以单独更新前端或后端
- **清晰分离**: 前后端代码完全隔离

---

## 🚀 快速开始

### 首次克隆项目

```bash
# 克隆项目（包括子模块）
git clone --recursive https://github.com/username/trading-review-system.git

# 或者分步操作
git clone https://github.com/username/trading-review-system.git
cd trading-review-system
git submodule update --init --recursive
```

### 更新子模块

```bash
# 更新所有子模块到最新版本
git submodule update --remote

# 或者进入子模块目录更新
cd client
git pull origin master
cd ..
```

---

## 📝 日常工作流

### 场景 1：修改后端代码

```bash
# 1. 创建特性分支
git checkout -b feature/add-api-endpoint

# 2. 修改后端代码
# 编辑 server/ 目录下的文件

# 3. 查看改动
git status
git diff server/

# 4. 提交改动
git add server/
git commit -m "feat(api): 添加新的 API 端点"

# 5. 推送到远程
git push origin feature/add-api-endpoint
```

### 场景 2：修改前端代码

```bash
# 1. 进入前端子模块
cd client

# 2. 创建特性分支
git checkout -b feature/improve-ui

# 3. 修改前端代码
# 编辑 src/ 目录下的文件

# 4. 提交改动
git add .
git commit -m "feat(ui): 改进用户界面"

# 5. 推送到远程
git push origin feature/improve-ui

# 6. 返回主仓库
cd ..

# 7. 更新主仓库中的子模块引用
git add client
git commit -m "chore: 更新前端子模块版本"
git push origin feature/improve-ui
```

### 场景 3：同时修改前后端

```bash
# 1. 创建特性分支（在主仓库）
git checkout -b feature/new-feature

# 2. 修改后端代码
# 编辑 server/ 目录

# 3. 进入前端子模块
cd client
git checkout -b feature/new-feature

# 4. 修改前端代码
# 编辑 src/ 目录

# 5. 提交前端改动
git add .
git commit -m "feat(frontend): 新功能前端部分"
git push origin feature/new-feature

# 6. 返回主仓库
cd ..

# 7. 提交后端改动和子模块更新
git add server/ client
git commit -m "feat: 实现新功能（前后端）"
git push origin feature/new-feature
```

---

## 🔄 同步代码

### 拉取最新代码

```bash
# 拉取主仓库的最新代码
git pull origin master

# 更新子模块到最新版本
git submodule update --remote

# 或者一步完成
git pull --recurse-submodules origin master
```

### 推送代码

```bash
# 推送主仓库
git push origin master

# 推送子模块（如果有改动）
cd client
git push origin master
cd ..
```

---

## 🌿 分支管理

### 主要分支

- **master**: 生产分支，稳定版本
- **develop**: 开发分支，集成分支

### 特性分支命名

```
feature/add-statistics      # 新功能
bugfix/fix-api-error        # 修复 bug
hotfix/critical-issue       # 紧急修复
refactor/optimize-code      # 代码重构
docs/update-readme          # 文档更新
```

### 创建和管理分支

```bash
# 从 master 创建特性分支
git checkout -b feature/new-feature master

# 查看所有分支
git branch -a

# 删除本地分支
git branch -d feature/new-feature

# 删除远程分支
git push origin --delete feature/new-feature
```

---

## 📋 提交规范

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| 类型 | 说明 | 示例 |
|------|------|------|
| feat | 新功能 | `feat(api): 添加用户认证` |
| fix | 修复 bug | `fix(ui): 修复按钮样式` |
| docs | 文档更新 | `docs: 更新 README` |
| style | 代码风格 | `style: 格式化代码` |
| refactor | 代码重构 | `refactor(api): 优化响应处理` |
| perf | 性能优化 | `perf(ui): 优化渲染性能` |
| test | 测试相关 | `test: 添加单元测试` |
| chore | 构建/依赖 | `chore: 更新依赖包` |

### Scope 范围

- **backend**: 后端相关
- **frontend**: 前端相关
- **api**: API 相关
- **ui**: UI 相关
- **types**: 类型定义
- **config**: 配置相关

### 提交示例

```bash
# 简单提交
git commit -m "feat(api): 添加交易方法 API"

# 详细提交
git commit -m "fix(frontend): 修复 toFixed 错误

- 添加空值检查
- 使用 Statistic 组件的 precision 属性
- 修复了 win_rate 和 total_pnl 的显示问题

Closes #42"
```

---

## 🔍 常用命令速查

### 查看状态和历史

```bash
# 查看当前状态
git status

# 查看改动
git diff

# 查看提交历史
git log --oneline -10

# 查看图形化历史
git log --graph --oneline --all

# 查看某个文件的历史
git log -- server/routes/methods.js
```

### 撤销操作

```bash
# 撤销工作区改动
git checkout -- server/data/mockData.js

# 撤销暂存区改动
git reset HEAD server/data/mockData.js

# 撤销最后一次提交（保留改动）
git reset --soft HEAD~1

# 撤销最后一次提交（丢弃改动）
git reset --hard HEAD~1

# 修改最后一次提交
git commit --amend -m "新的提交信息"
```

### 子模块操作

```bash
# 初始化子模块
git submodule init

# 更新子模块
git submodule update

# 一步完成初始化和更新
git submodule update --init --recursive

# 更新子模块到最新版本
git submodule update --remote

# 查看子模块状态
git submodule status

# 进入子模块目录
cd client
git status
cd ..
```

---

## 🔗 与远程仓库同步

### 添加远程仓库

```bash
# 添加主仓库
git remote add origin https://github.com/username/trading-review-system.git

# 添加前端子模块远程
cd client
git remote add origin https://github.com/username/trading-review-client.git
cd ..
```

### 推送和拉取

```bash
# 首次推送（设置上游分支）
git push -u origin master

# 推送到远程
git push origin master

# 拉取远程代码
git pull origin master

# 强制推送（谨慎使用！）
git push origin master --force
```

---

## 🐛 处理冲突

### 合并冲突

```bash
# 拉取时发生冲突
git pull origin master

# 查看冲突文件
git status

# 手动编辑冲突文件
# 文件中会显示：
# <<<<<<< HEAD
# 你的改动
# =======
# 远程改动
# >>>>>>> origin/master

# 解决冲突后
git add .
git commit -m "fix: 解决合并冲突"
git push origin master
```

### 子模块冲突

```bash
# 如果子模块版本冲突
git status

# 查看子模块状态
git submodule status

# 更新子模块到最新版本
git submodule update --remote

# 提交子模块更新
git add client
git commit -m "chore: 更新子模块版本"
```

---

## 📊 项目提交历史示例

```
e5c548a (HEAD -> master) feat(backend): 更新交易方法数据格式为 UUID 和新字段
f665032 docs: 添加 .gitignore 和 Git 管理指南
821276f feat: 项目初始化
```

---

## ✅ 最佳实践

### 提交前检查清单

- [ ] 代码已测试
- [ ] 没有调试代码或 console.log
- [ ] 提交信息清晰明确
- [ ] 相关文件都已添加
- [ ] 没有提交不必要的文件（node_modules 等）

### 推送前检查清单

- [ ] 本地代码已提交
- [ ] 已拉取最新远程代码
- [ ] 没有冲突
- [ ] 分支名称正确

### 代码审查检查清单

- [ ] 代码符合项目规范
- [ ] 提交信息清晰
- [ ] 没有不必要的改动
- [ ] 测试通过

---

## 🆘 常见问题

### Q: 如何撤销已推送的提交？

```bash
# 方法 1：创建新提交来撤销（推荐）
git revert <commit-hash>
git push origin master

# 方法 2：重置（仅在私有分支）
git reset --hard <commit-hash>
git push origin master --force
```

### Q: 如何查看子模块的改动？

```bash
# 查看子模块状态
git submodule status

# 进入子模块查看详细改动
cd client
git log --oneline -5
git diff
cd ..
```

### Q: 如何更新子模块到特定版本？

```bash
# 进入子模块
cd client

# 切换到特定分支或标签
git checkout v1.0.0

# 返回主仓库
cd ..

# 提交子模块更新
git add client
git commit -m "chore: 更新前端到 v1.0.0"
```

### Q: 如何克隆项目时跳过子模块？

```bash
# 克隆不包括子模块
git clone https://github.com/username/trading-review-system.git

# 之后需要时再初始化
git submodule update --init --recursive
```

---

## 📚 相关资源

- [Git 官方文档](https://git-scm.com/doc)
- [Git 子模块文档](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub 帮助](https://docs.github.com)

---

**最后更新**: 2024-12-13
