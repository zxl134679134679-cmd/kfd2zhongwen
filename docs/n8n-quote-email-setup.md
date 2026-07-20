# 凯丰德官网询价表单接入 n8n 发邮件说明

目标：客户在官网点击“提交需求”后，网站把需求发送到 n8n；n8n 再自动发邮件到 `909015753@qq.com`。

## 1. n8n 工作流建议

在 n8n 新建一个 workflow，节点顺序：

1. Webhook
2. Email Send / SMTP / QQ 邮箱 SMTP

Webhook 节点建议：

- Method：`POST`
- Path：`kfd-quote`
- 使用 Production URL，不要用 Test URL 上线

Email 节点建议：

- To：`909015753@qq.com`
- Subject：`【官网询价】客户提交了新的包装需求`
- Body 建议使用 HTML，字段来自 Webhook 的 JSON：

```html
<h2>官网新询价</h2>
<table border="1" cellpadding="8" cellspacing="0">
  <tr><td>产品类型</td><td>{{$json.product}}</td></tr>
  <tr><td>尺寸</td><td>{{$json.size}}</td></tr>
  <tr><td>数量</td><td>{{$json.quantity}}</td></tr>
  <tr><td>材质 / 楞型</td><td>{{$json.material}}</td></tr>
  <tr><td>印刷需求</td><td>{{$json.printing}}</td></tr>
  <tr><td>交付地区</td><td>{{$json.destination}}</td></tr>
  <tr><td>补充说明</td><td>{{$json.notes}}</td></tr>
  <tr><td>客户联系方式</td><td>{{$json.contact}}</td></tr>
  <tr><td>提交页面</td><td>{{$json.pageUrl}}</td></tr>
  <tr><td>提交时间</td><td>{{$json.submittedAt}}</td></tr>
</table>
```

## 2. 网站需要填写的环境变量

部署网站时增加：

```env
VITE_N8N_QUOTE_WEBHOOK_URL=https://你的n8n域名/webhook/kfd-quote
```

填好以后，需要重新构建并部署网站。

## 3. 当前网站会发送的数据

```json
{
  "source": "kfdpack-website",
  "recipientEmail": "909015753@qq.com",
  "language": "zh",
  "submittedAt": "2026-07-20T00:00:00.000Z",
  "pageUrl": "https://example.com/",
  "product": "客户选择的产品",
  "size": "客户填写的尺寸",
  "quantity": "客户填写的数量",
  "material": "客户填写的材质 / 楞型",
  "printing": "客户填写的印刷需求",
  "destination": "客户填写的交付地区",
  "notes": "客户填写的补充说明",
  "contact": "客户填写的邮箱 / 微信 / WhatsApp"
}
```

## 4. 安全提醒

不要把 QQ 邮箱密码、QQ 邮箱授权码、SMTP 密码写进网页代码。  
这些只能配置在 n8n 或服务器后台里。
