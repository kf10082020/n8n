# ✅ Базовый образ
FROM node:18-bullseye-slim

# 🧱 Установка зависимостей
RUN apt-get update && apt-get install -y \
  ffmpeg curl git build-essential python3 sqlite3 \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# 📦 Установка n8n
RUN npm install -g n8n@1.41.1

# 🗂 Рабочая директория
WORKDIR /n8n-data

# ✅ Порт для HTTPS
EXPOSE 443

# 🧪 По умолчанию запустить миграции и потом старт
CMD n8n migrate:up && n8n start
