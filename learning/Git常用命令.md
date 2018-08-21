## Git常用命令

- [整理的Git常用命令清单.md](https://github.com/jaywcjlove/handbook/blob/master/other/Git%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4%E6%B8%85%E5%8D%95.md)

基本命令需要了解，不过实际应用还是建议使用图形化工具SourceTree、TortoiseGit之类，工具本就是为了使用方便

特殊命令往往可能需要在命令终端执行

### 创建SSH密钥

```bash
# 生成密钥
ssh-keygen -t rsa -C 'wowohoo@qq.com'
# 指定生成目录文件名字
ssh-keygen -t rsa -C "wowohoo@qq.com" -f ~/.ssh/ww_rsa
# 测试是否成功
ssh -T git@github.com
```

### 重置(reset)、变基(rebase)、强推(force)

```bash
# 将当前分支重置成master提交记录
git reset --hard master 
# 将当前分支重置成远程最新提交记录
git reset --hard FETCH_HEAD  
# 将当前分支推送到origin远程仓库的master分支
git push origin master --force 
# 将本地dev分支推送到test远程仓库的master分支
git push test dev:master --force 
```

### 配置项(config)

```bash
# 全局配置
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
# 当前仓库配置
git config user.email "you@example.com"
git config user.name "Your Name"
```

### Git批量修改历史commit中的user.name和user.email

```bash
# 将用户名evanliu2968@gmail.com的提交记录改为用户名296823596@qq.com
git filter-branch -f --env-filter '
OLD_EMAIL="evanliu2968@gmail.com"
CORRECT_NAME="evanliu2968"
CORRECT_EMAIL="296823596@qq.com"
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```

