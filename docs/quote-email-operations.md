# 官网询价自动邮件运维说明

## 运行结构

- 公开地址：`POST https://en.kfdpack.com/api/quote`
- 本机邮件服务：`http://127.0.0.1:8787/quote`
- 程序目录：`/opt/kfd-quote-mailer`
- 机密配置：`/etc/kfd-quote-mailer.env`
- systemd 服务：`kfd-quote-mailer`
- 固定收件人：`909015753@qq.com`

客户资料只用于当次邮件发送，不写入文件或数据库。日志只包含匿名请求编号和成功或失败状态。

## 1. 准备QQ邮箱

登录 `909015753@qq.com`，在邮箱设置中开启 IMAP/SMTP 服务并生成16位客户端授权码。授权码只在服务器上填写，不通过聊天发送，不保存到本项目或 GitHub。

常用配置为：

```text
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
```

如果QQ邮箱设置页面显示不同参数，以邮箱页面为准。

## 2. 安装程序

以下命令需要服务器管理员权限：

```bash
useradd --system --home /nonexistent --shell /usr/sbin/nologin kfd-mailer
install -d -o root -g root -m 755 /opt/kfd-quote-mailer
```

将仓库的 `server/quote-mailer/` 内容上传到 `/opt/kfd-quote-mailer/`。服务器需要 Node.js 20或更高版本、npm以及固定版本的 pnpm：

```bash
npm install --global pnpm@11.9.0
cd /opt/kfd-quote-mailer
pnpm install --prod --frozen-lockfile
chown -R root:root /opt/kfd-quote-mailer
```

安装前可在包含开发依赖的副本中执行：

```bash
pnpm install --frozen-lockfile
pnpm test
```

## 3. 创建机密配置

创建只有 root 可读的环境文件：

```bash
install -o root -g root -m 600 /dev/null /etc/kfd-quote-mailer.env
sudoedit /etc/kfd-quote-mailer.env
```

在编辑器中填写：

```dotenv
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=909015753@qq.com
SMTP_PASS="在这里亲自填写163客户端授权码"
MAIL_FROM=909015753@qq.com
MAIL_TO=909015753@qq.com
PORT=8787
```

关闭编辑器后不要使用会把文件内容输出到终端的检查命令。只检查权限：

```bash
stat -c '%a %U %G' /etc/kfd-quote-mailer.env
```

预期输出：

```text
600 root root
```

## 4. 安装 systemd 服务

```bash
install -o root -g root -m 644 deploy/kfd-quote-mailer.service /etc/systemd/system/kfd-quote-mailer.service
systemctl daemon-reload
systemctl enable --now kfd-quote-mailer
systemctl is-active kfd-quote-mailer
```

最后一条命令必须输出 `active`。如未启动，查看不包含环境文件内容的服务日志：

```bash
journalctl -u kfd-quote-mailer -n 50 --no-pager
```

## 5. 配置 Nginx

先备份现有配置：

```bash
install -d -o root -g root -m 700 /etc/nginx/kfd-backups
cp -a /etc/nginx/sites-enabled/en-kfdpack /etc/nginx/kfd-backups/en-kfdpack.before-quote-mail
```

备份不能放在 `sites-enabled` 目录中，否则 Nginx 会把备份当成第二个启用站点。

把频率限制区域放到 Nginx 的 `http` 上下文。标准安装可以创建：

```nginx
# /etc/nginx/conf.d/kfd-quote-rate.conf
limit_req_zone $binary_remote_addr zone=kfd_quote:10m rate=3r/m;
```

把以下配置放到 `/etc/nginx/sites-enabled/en-kfdpack` 的 HTTPS `server` 块中：

```nginx
location = /api/quote {
    limit_except POST { deny all; }
    client_max_body_size 32k;
    limit_req zone=kfd_quote burst=3 nodelay;

    proxy_pass http://127.0.0.1:8787/quote;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_connect_timeout 3s;
    proxy_read_timeout 20s;
}
```

检查并重载：

```bash
nginx -t
systemctl reload nginx
```

只有 `nginx -t` 成功后才能重载。

## 6. 上线验证

在网页提交带唯一编号的测试需求，例如 `KFD-20260723-001`，确认：

1. 浏览器提交接口返回 `204`。
2. 网页显示“需求已发送”。
3. `909015753@qq.com` 收到一封字段完整的邮件。
4. 服务日志中没有授权码和完整客户资料。
5. 短时间重复提交会收到 `429`。
6. 手机和电脑均能正常显示提交中、成功和失败状态。

## 7. 回滚

如邮件接口影响网站，先恢复 Nginx：

```bash
cp -a /etc/nginx/kfd-backups/en-kfdpack.before-quote-mail /etc/nginx/sites-enabled/en-kfdpack
rm -f /etc/nginx/conf.d/kfd-quote-rate.conf
nginx -t
systemctl reload nginx
```

停止邮件服务：

```bash
systemctl disable --now kfd-quote-mailer
```

前端继续保留上一版静态 release；将 `current` 软链接切回上一版后重载 Nginx。
