# 🚂 n8n Railway Deployment (Stable)

📦 Version: n8n@1.41.1  
🧠 Node.js 18  
🗂 Volume: /home/node/.n8n

## 🚀 Запуск на Railway

1. Нажми [Deploy on Railway](https://railway.app/new)
2. Укажи переменные окружения, если нужно:
   - `N8N_BASIC_AUTH_USER`
   - `N8N_BASIC_AUTH_PASSWORD`
3. Profit!

## 💾 Локальный запуск

```bash
docker build -t n8n .
docker run -p 5678:5678 -v $(pwd)/.n8n:/home/node/.n8n n8n
