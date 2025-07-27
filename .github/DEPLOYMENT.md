# 部署配置说明

## GitHub Secrets 配置

为了让自动部署正常工作，你需要在 GitHub 仓库中配置以下 Secrets：

### 必需的 Secrets

1. **SSH_PRIVATE_KEY** - SSH 私钥内容

   - 用于连接到目标服务器的 SSH 私钥
   - 确保对应的公钥已添加到目标服务器的 `~/.ssh/authorized_keys`

2. **SCP_USER** - 远程服务器用户名

   - 例如：`root` 或 `ubuntu`

3. **SCP_HOST** - 远程服务器地址

   - 例如：`192.168.1.100` 或 `example.com`

4. **SCP_REMOTE_PATH** - 远程服务器部署路径
   - 例如：`/var/www/html` 或 `/home/user/www`

### 可选的 Secrets

5. **SCP_PORT** - SSH 端口（可选，默认 22）
   - 例如：`2222`

## 配置步骤

1. 进入你的 GitHub 仓库
2. 点击 **Settings** 选项卡
3. 在左侧菜单中点击 **Secrets and variables** → **Actions**
4. 点击 **New repository secret** 添加上述每个 secret

## 工作流说明

- **构建阶段**：在 Node.js 18.x、20.x、22.x 版本上并行构建项目
- **部署阶段**：仅在推送到 `main` 分支时触发，使用 Node.js 20.x 构建并部署
- **安全性**：自动配置 SSH 密钥和已知主机，确保安全连接

## 本地部署

如果你想在本地运行部署脚本，可以：

```bash
# 直接使用命令行参数
./deploy-design-scp.sh <user> <host> <remote-path> [port]

# 或者创建 .env 文件
SCP_USER=your_user
SCP_HOST=your_host
SCP_REMOTE_PATH=/var/www/html
SCP_PORT=22
SSH_KEY_PATH=/path/to/private/key  # 可选

# 然后运行
./deploy-design-scp.sh
```
