# 文件加速

基于 Cloudflare Workers 的文件传输加速服务 (File transfer acceleration service)

**预览网址：**

1. https://wfile.kkgo.cc
2. https://filetas.skiy.net
3. https://filetas.ixxx.workers.dev

- 仅支持 [`CloudFlare Workers` 项目](https://developers.cloudflare.com/workers/)；

  ```bash
   # 图片会直接显示
   https://wfile.kkgo.cc/https://kernel.org/theme/images/logos/tux.png

   # 文件会直接下载
   https://wfile.kkgo.cc/https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.1.18.tar.xz
  ```

## 部署教程

### 通过 GitHub Actions 发布至 CloudFlare

从 CloudFlare 获取 `CLOUDFLARE_API_TOKEN` 值，并设置到项目。

> `https://github.com/<ORG>/<REPO>/settings/secrets/actions`

### 本地部署到 CloudFlare

1. 注册 [CloudFlare 账号](https://www.cloudflare.com/)，并且设置 **Workers** 域名 (比如：`***.workers.dev`)
2. 安装 [Wrangler 命令行工具](https://developers.cloudflare.com/workers/wrangler/)。
   ```bash
    npm install -g wrangler
   ```
3. 登录 `Wrangler`（可能需要扶梯）：

   ```bash
   # 若登录不成功，可能需要使用代理。
   wrangler login
   ```

4. 拉取本项目：

   ```bash
   git clone https://github.com/servless/worker-filetas.git
   ```

5. 修改 `wrangler.toml` 文件中的 `name`（filetas）为服务名 `xxx`（访问域名为：`xxx.***.workers.dev`）

6. 本地测试

   ```bash
   npm install
   npm run dev
   ```

7. 发布

   ```bash
    wrangler deploy
   ```

   发布成功将会显示对应的网址

   ```bash
   Proxy environment variables detected. We'll use your proxy for fetch requests.
   ⛅️ wrangler 2.12.2
   --------------------
   Total Upload: 4.48 KiB / gzip: 1.40 KiB
   Uploaded xxx (2.20 sec)
   Published xxx (1.83 sec)
   	https://xxx.***.workers.dev
   Current Deployment ID: xxxx.xxxx.xxxx.xxxx
   ```

## 仓库镜像

- https://git.jetsung.com/servless/worker-filetas
- https://framagit.org/servless/worker-filetas
- https://github.com/servless/worker-filetas
