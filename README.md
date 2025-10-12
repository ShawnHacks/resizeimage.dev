This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm install
npx playwright install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## TODO:

要实现每次点击网站按钮都进行Cloudflare 校验，你需要使用Cloudflare Turnstile。Turnstile 是一种无障碍的人机验证解决方案，可以集成到网站中，通过JavaScript 代码在客户端进行校验，然后在后端验证用户是否通过了验证。
以下是实现这一功能的步骤：
1. 获取Cloudflare Turnstile 站点密钥和密钥:
访问Cloudflare 控制面板，找到Turnstile 服务。
创建一个新的Turnstile 应用，获取到你的站点密钥和密钥。
2. 在网站前端添加Cloudflare Turnstile JavaScript 代码:
在需要进行校验的按钮所在的页面，引入Cloudflare Turnstile 的JavaScript 代码。通常，这段代码会包含一个占位符，用于显示验证界面。
确保这段代码在页面加载时执行，并且在按钮被点击之前完成初始化。

3. 按钮点击事件处理:
在按钮的点击事件处理函数中，调用Cloudflare Turnstile 提供的API，触发验证过程。
Turnstile 会在用户界面上显示验证元素，并引导用户完成验证。
验证成功后，Turnstile 会返回一个令牌(token)。
4. 后端验证:
当用户点击按钮，前端获取到令牌后，需要将该令牌发送到你的后端服务器。
在你的后端服务器上，使用你的站点密钥和密钥，向Cloudflare 的API 发送请求，验证令牌的有效性。
如果令牌验证成功，则继续执行按钮点击后的操作(例如提交表单，发送请求等等)。

```
<!-- 前端 -->
<button id="myButton">提交</button>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<script>
  var myButton = document.getElementById('myButton');
  myButton.addEventListener('click', function() {
    turnstile.execute('your_site_key', {
      action: 'submit_form' // 可以根据实际情况修改
    }).then(function(token) {
      // 验证通过，发送令牌到后端
      sendTokenToServer(token);
    });
  });

  function sendTokenToServer(token) {
    // 这里使用fetch或其他方式将token发送到后端
    fetch('/your_backend_endpoint', {
      method: 'POST',
      body: JSON.stringify({ token: token })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // 验证成功，执行按钮点击后的操作
        console.log("验证成功，执行后续操作");
        // 例如：提交表单，发送请求等
      } else {
        console.error("验证失败", data.error);
      }
    });
  }
</script>
```

```
# 后端 (Python示例，使用Flask)
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)
CLOUDFLARE_SECRET_KEY = 'your_secret_key'

@app.route('/your_backend_endpoint', methods=['POST'])
def verify_token():
    token = request.json.get('token')
    if not token:
        return jsonify({'success': False, 'error': 'Missing token'}), 400

    response = requests.post('https://challenges.cloudflare.com/turnstile/v0/siteverify',
                             data={'secret': CLOUDFLARE_SECRET_KEY, 'response': token})
    result = response.json()

    if result.get('success'):
        # 验证成功，执行后续操作
        return jsonify({'success': True})
    else:
        # 验证失败
        return jsonify({'success': False, 'error': result.get('error-codes')}), 400

if __name__ == '__main__':
    app.run(debug=True)
```

关键点:
前端集成:Cloudflare Turnstile 的JavaScript 代码需要在前端页面中加载和初始化。
后端验证:后端服务器需要使用站点密钥和密钥向Cloudflare 的API 发送请求，验证前端传来的令牌。
错误处理:需要处理前端验证失败或后端验证失败的情况。
安全性:不要将Cloudflare 密钥直接硬编码到前端代码中。


## 截图存储配置

### 环境变量

- `SCREENSHOTS_DIR`: 截图文件存储目录（可选）
  - 开发环境：不设置或留空，默认使用 `public/screenshots`
  - 生产环境：设置为专门的目录，如 `/var/www/screenshots`

### 生产环境部署

1. 创建截图存储目录：
```bash
sudo mkdir -p /var/www/screenshots
sudo chown www-data:www-data /var/www/screenshots
sudo chmod 755 /var/www/screenshots
```

2. 配置环境变量：
```bash
SCREENSHOTS_DIR=/var/www/screenshots
```

3. 配置nginx（参考 `nginx-screenshots.conf.example`）：
```nginx
location /screenshots/ {
    alias /var/www/screenshots/;
    add_header X-Robots-Tag "noindex, nofollow, noarchive, nosnippet" always;
    add_header Cache-Control "public, max-age=86400" always;
    expires 24h;
    access_log off;
}
```

## SSL证书配置

sudo certbot --nginx -d websitescreenshot.online -d www.websitescreenshot.online

## Email配置

https://app.improvmx.com/domains/websitescreenshot.online/dns


export ANTHROPIC_BASE_URL="https://api.moonshot.cn/anthropic/"


export ANTHROPIC_API_KEY=sk-n8draowg1akfc6wQBbjlojkqRBRXh1As0OznT2WJum8NKSDL

### 安装MCP：
claude mcp add context7 -s user -- npx -y @upstash/context7-mcp

## 部署

pnpm run deploy