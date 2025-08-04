FROM node:18-bullseye-slim

# Установка зависимостей
RUN apt-get update && \
  apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    git \
    build-essential \
    python3 \
    cmake \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Установка стабильной версии n8n
RUN npm install -g n8n@1.41.1

# Установка директории
WORKDIR /home/node

# Создание volume (нужен для Railway)
VOLUME ["/home/node/.n8n"]

# Открытие порта
EXPOSE 5678

# Запуск
CMD ["n8n", "start"]
