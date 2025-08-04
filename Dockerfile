# ✅ Node 18 совместим с n8n@1.41.1
FROM node:18-bullseye-slim

# 🧰 Установка зависимостей
RUN apt-get update && \
  apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    git \
    build-essential \
    python3 \
    cmake \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# 📦 Установка стабильной версии n8n
RUN npm install -g n8n@1.41.1

# 🏠 Рабочая директория
WORKDIR /home/node

# 📁 Создаём volume на .n8n
VOLUME ["/home/node/.n8n"]

# 📡 Порт n8n
EXPOSE 5678

# 🚀 Команда запуска
CMD ["n8n", "start"]
