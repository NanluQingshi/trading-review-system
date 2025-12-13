# Trading Review System - Git 管理指南
## 📋 目录
1. [基本配置](#基本配置)
2. [日常工作流](#日常工作流)
3. [分支管理](#分支管理)
4. [提交规范](#提交规范)
5. [常用命令](#常用命令)
6. [远程仓库](#远程仓库)

---

## 基本配置

### 初始化配置（首次使用）

```bash
# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 查看配置
git config --list
```

### 项目特定配置

```bash
# 在项目目录下配置（可选）
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

---

## 日常工作流

### 1. 查看状态

```bash
# 查看当前状态
git status

# 查看详细的改动
git diff

# 查看暂存区的改动
git diff --staged
```

### 2. 提交代码

```bash
# 查看所有改动
git status

# 添加所有改动到暂存区
git add .

# 或者添加特定文件
git add server/data/mockData.js
git add client/src/pages/MethodsPage.tsx

# 提交代码
git commit -m "feat: 更新交易方法数据格式"

# 查看提交历史
git log --oneline -10
```

### 3. 同步远程仓库

```bash
# 拉取最新代码
git pull origin master

# 推送本地代码
git push origin master
```

---

## 分支管理

### 创建和切换分支

```bash
# 查看所有分支
git branch -a

# 创建新分支
git branch feature/add-statistics

# 切换分支
git checkout feature/add-statistics

# 创建并切换分支（推荐）
git checkout -b feature/add-statistics

# 删除本地分支
git branch -d feature/add-statistics

# 强制删除分支
git branch -D feature/add-statistics
```

### 分支命名规范

```
feature/*      - 新功能分支
  feature/add-statistics
  feature/improve-ui

bugfix/*       - 修复分支
  bugfix/fix-toFixed-error
  bugfix/fix-api-response

hotfix/*       - 紧急修复
  hotfix/critical-bug

refactor/*     - 重构分支
  refactor/optimize-performance

docs/*         - 文档分支
  docs/update-readme
```

### 合并分支

```bash
# 切换到主分支
git checkout master

# 拉取最新代码
git pull origin master

# 合并特性分支
git merge feature/add-statistics

# 推送合并后的代码
git push origin master

# 删除已合并的分支
git branch -d feature/add-statistics
```

---

## 提交规范

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- **feat**: 新功能
- **fix**: 修复 bug
- **docs**: 文档更新
- **style**: 代码风格（不影响功能）
- **refactor**: 代码重构
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建、依赖等变更

### 提交示例

```bash
# 新功能
git commit -m "feat(methods): 添加交易方法统计功能"

# 修复 bug
git commit -m "fix(methods): 修复 toFixed 错误"

# 文档更新
git commit -m "docs: 更新 Git 管理指南"

# 代码重构
git commit -m "refactor(api): 优化 API 响应处理"

# 性能优化
git commit -m "perf(ui): 优化方法卡片渲染性能"
```

### 详细提交信息

```bash
git commit -m "feat(methods): 更新交易方法数据格式

- 将 id 从数字改为 UUID 字符串
- 添加 code、win_rate、total_pnl 字段
- 更新后端 API 以支持新格式

Closes #123"
```

---

## 常用命令

### 查看历史

```bash
# 查看提交日志
git log

# 单行显示
git log --oneline

# 显示最近 10 条
git log --oneline -10

# 显示图形化分支
git log --graph --oneline --all

# 查看某个文件的历史
git log -- server/data/mockData.js

# 查看某个提交的详细信息
git show 821276f
```

### 撤销操作

```bash
# 撤销工作区的改动
git checkout -- server/data/mockData.js

# 撤销暂存区的改动
git reset HEAD server/data/mockData.js

# 撤销最后一次提交（保留改动）
git reset --soft HEAD~1

# 撤销最后一次提交（丢弃改动）
git reset --hard HEAD~1

# 修改最后一次提交
git commit --amend -m "新的提交信息"
```

### 查看差异

```bash
# 查看工作区和暂存区的差异
git diff

# 查看暂存区和最后一次提交的差异
git diff --staged

# 查看两个分支的差异
git diff master feature/add-statistics

# 查看两个提交的差异
git diff 821276f HEAD
```

### 标签管理

```bash
# 创建标签
git tag v1.0.0

# 创建带注释的标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 查看所有标签
git tag

# 推送标签
git push origin v1.0.0

# 推送所有标签
git push origin --tags

# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
```

---

## 远程仓库

### 添加远程仓库

```bash
# 添加远程仓库
git remote add origin https://github.com/username/trading-review-system.git

# 查看远程仓库
git remote -v

# 查看远程仓库详细信息
git remote show origin
```

### 推送和拉取

```bash
# 首次推送（设置上游分支）
git push -u origin master

# 推送到远程
git push origin master

# 拉取远程代码
git pull origin master

# 获取远程更新（不合并）
git fetch origin

# 强制推送（谨慎使用！）
git push origin master --force
```

### 处理冲突

```bash
# 拉取时发生冲突
git pull origin master

# 查看冲突文件
git status

# 手动编辑冲突文件，然后
git add .
git commit -m "fix: 解决合并冲突"
git push origin master
```

---

## 项目结构和 Git 管理

```
trading-review-system/
├── .git/                    # Git 仓库数据
├── .gitignore              # Git 忽略文件配置
├── client/                 # 前端项目
│   ├── node_modules/       # 忽略（在 .gitignore 中）
│   ├── src/
│   ├── package.json        # 提交
│   └── package-lock.json   # 忽略（在 .gitignore 中）
├── server/                 # 后端项目
│   ├── node_modules/       # 忽略（在 .gitignore 中）
│   ├── data/
│   ├── routes/
│   ├── package.json        # 提交
│   └── package-lock.json   # 忽略（在 .gitignore 中）
└── README.md               # 提交
```

---

## 工作流示例

### 场景 1：开发新功能

```bash
# 1. 创建特性分支
git checkout -b feature/add-statistics

# 2. 进行开发
# ... 编辑文件 ...

# 3. 查看改动
git status
git diff

# 4. 提交改动
git add .
git commit -m "feat(stats): 添加统计功能"

# 5. 推送到远程
git push origin feature/add-statistics

# 6. 创建 Pull Request（在 GitHub/GitLab 上）
# 7. 代码审查后合并到 master
```

### 场景 2：修复 Bug

```bash
# 1. 创建修复分支
git checkout -b bugfix/fix-toFixed-error

# 2. 修复 bug
# ... 编辑文件 ...

# 3. 提交修复
git add .
git commit -m "fix(methods): 修复 toFixed 错误"

# 4. 推送和合并
git push origin bugfix/fix-toFixed-error
# 创建 PR 并合并
```

### 场景 3：紧急修复（Hotfix）

```bash
# 1. 从 master 创建 hotfix 分支
git checkout -b hotfix/critical-bug master

# 2. 修复问题
# ... 编辑文件 ...

# 3. 提交修复
git add .
git commit -m "hotfix: 修复关键问题"

# 4. 合并到 master 和 develop
git checkout master
git merge hotfix/critical-bug
git push origin master

# 5. 删除 hotfix 分支
git branch -d hotfix/critical-bug
```

---

## 最佳实践

### ✅ 推荐做法

1. **频繁提交** - 每个逻辑单元提交一次
2. **清晰的提交信息** - 描述做了什么和为什么
3. **使用分支** - 不要直接在 master 上开发
4. **定期拉取** - 保持本地代码最新
5. **代码审查** - 通过 PR 进行代码审查
6. **使用标签** - 标记重要版本

### ❌ 避免做法

1. **大量改动一次提交** - 难以追踪和回滚
2. **模糊的提交信息** - "update" 或 "fix"
3. **直接在 master 上开发** - 容易出错
4. **提交 node_modules** - 浪费空间
5. **强制推送到 master** - 可能覆盖他人代码
6. **忘记拉取最新代码** - 容易产生冲突

---

## 常见问题

### Q: 如何撤销已推送的提交？

```bash
# 方法 1：创建新提交来撤销
git revert <commit-hash>
git push origin master

# 方法 2：重置（仅在本地或私有分支）
git reset --hard <commit-hash>
git push origin master --force
```

### Q: 如何合并多个提交？

```bash
# 交互式 rebase
git rebase -i HEAD~3  # 合并最后 3 个提交
```

### Q: 如何查看谁修改了某一行代码？

```bash
git blame server/data/mockData.js
```

### Q: 如何恢复已删除的分支？

```bash
# 查看所有操作历史
git reflog

# 恢复分支
git checkout -b <branch-name> <commit-hash>
```

---

## 相关资源

- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 帮助](https://docs.github.com)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow 工作流](https://nvie.com/posts/a-successful-git-branching-model/)

---

**最后更新**: 2024-12-13
