# Git 快速参考卡片
## 🔧 基本配置

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 📝 日常操作

### 查看状态
```bash
git status              # 查看当前状态
git diff                # 查看改动
git log --oneline -10   # 查看最近 10 条提交
```

### 提交代码
```bash
git add .               # 添加所有改动
git add server/         # 添加特定目录
git commit -m "message" # 提交
git push origin master  # 推送到远程
```

### 拉取代码
```bash
git pull origin master  # 拉取并合并
git fetch origin        # 仅获取不合并
```

## 🌿 分支操作

```bash
git branch                          # 查看本地分支
git branch -a                       # 查看所有分支
git checkout -b feature/new-feature # 创建并切换分支
git checkout master                 # 切换分支
git merge feature/new-feature       # 合并分支
git branch -d feature/new-feature   # 删除分支
```

## ↩️ 撤销操作

```bash
git checkout -- file.js             # 撤销工作区改动
git reset HEAD file.js              # 撤销暂存区改动
git reset --soft HEAD~1             # 撤销最后一次提交（保留改动）
git reset --hard HEAD~1             # 撤销最后一次提交（丢弃改动）
git commit --amend -m "new message" # 修改最后一次提交
```

## 📦 子模块操作

```bash
git submodule update --init --recursive  # 初始化子模块
git submodule update --remote            # 更新子模块
cd client                                # 进入子模块
git status                               # 查看子模块状态
cd ..                                    # 返回主仓库
git add client                           # 提交子模块更新
```

## 🔍 查看信息

```bash
git log --oneline                   # 单行显示提交历史
git log --graph --oneline --all     # 图形化显示分支
git show <commit-hash>              # 查看某个提交的详细信息
git blame file.js                   # 查看每一行的修改者
git diff master feature/new-feature # 比较两个分支
```

## 🔗 远程仓库

```bash
git remote -v                                    # 查看远程仓库
git remote add origin <url>                      # 添加远程仓库
git push -u origin master                        # 首次推送（设置上游）
git push origin master                           # 推送到远程
git pull origin master                           # 拉取远程代码
git push origin --delete feature/new-feature     # 删除远程分支
```

## 📋 提交信息规范

```
feat(scope): 新功能
fix(scope): 修复 bug
docs: 文档更新
style: 代码风格
refactor(scope): 代码重构
perf(scope): 性能优化
test: 测试相关
chore: 构建/依赖
```

### 示例
```bash
git commit -m "feat(api): 添加用户认证"
git commit -m "fix(ui): 修复按钮样式"
git commit -m "docs: 更新 README"
```

## 🆘 常见场景

### 场景 1：修改后端代码
```bash
git checkout -b feature/add-api
# 编辑 server/ 目录
git add server/
git commit -m "feat(api): 添加新端点"
git push origin feature/add-api
```

### 场景 2：修改前端代码
```bash
cd client
git checkout -b feature/improve-ui
# 编辑 src/ 目录
git add .
git commit -m "feat(ui): 改进界面"
git push origin feature/improve-ui
cd ..
git add client
git commit -m "chore: 更新前端子模块"
git push origin feature/improve-ui
```

### 场景 3：修复 Bug
```bash
git checkout -b bugfix/fix-error
# 修复代码
git add .
git commit -m "fix: 修复错误"
git push origin bugfix/fix-error
```

### 场景 4：紧急修复
```bash
git checkout -b hotfix/critical-bug master
# 修复问题
git add .
git commit -m "hotfix: 修复关键问题"
git push origin hotfix/critical-bug
# 合并到 master 和 develop
```

## 🎯 工作流总结

```
1. 创建分支
   git checkout -b feature/xxx

2. 进行开发
   # 编辑文件

3. 查看改动
   git status
   git diff

4. 提交改动
   git add .
   git commit -m "feat: xxx"

5. 推送到远程
   git push origin feature/xxx

6. 创建 Pull Request
   # 在 GitHub/GitLab 上

7. 代码审查后合并
   git checkout master
   git pull origin master
   git merge feature/xxx
   git push origin master

8. 删除分支
   git branch -d feature/xxx
   git push origin --delete feature/xxx
```

## ⚠️ 危险操作

```bash
# 强制推送（可能覆盖他人代码！）
git push origin master --force

# 强制重置（会丢失改动！）
git reset --hard HEAD~1

# 删除分支（谨慎操作！）
git branch -D feature/xxx
```

## 💡 提示

- 频繁提交，每个逻辑单元提交一次
- 提交信息要清晰明确
- 推送前先拉取最新代码
- 使用分支，不要直接在 master 上开发
- 定期查看 Git 日志了解项目历史

---

**快速查询**: 需要帮助？查看 `GIT_GUIDE.md` 或 `GIT_WORKFLOW.md`
