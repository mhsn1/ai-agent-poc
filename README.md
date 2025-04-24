# AI-Agent PoC (Webhook ➜ Proxy ➜ Chrome-Extension ➜ Cloudflare Bypass)

## Quick Start

```bash
git clone <YOUR-REPO-URL> ai-agent-poc
cd ai-agent-poc
npm install
cp .env.example .env          # or edit .env manually
npm start                     # server on http://localhost:4000
curl -X POST http://localhost:4000/webhook -H "Content-Type: application/json" -d '{ "job": "demo" }'
