# ✅ Минималистичный и рабочий образ
FROM node:18-slim

# Установка зависимостей
RUN apt-get update && \
    apt-get install -y python3 ffmpeg build-essential && \
    rm -rf /var/lib/apt/lists/*

# Установка n8n глобально
RUN npm install -g n8n

# Создание рабочей директории
WORKDIR /data

# Railway mount volume будет сюда
VOLUME /data

# Открытие порта
EXPOSE 5678

# Переменные окружения
ENV N8N_PORT=5678 \
    N8N_HOST=0.0.0.0 \
    N8N_BASIC_AUTH_ACTIVE=true \
    N8N_BASIC_AUTH_USER=admin \
    N8N_BASIC_AUTH_PASSWORD=admin

# Команда запуска
CMD ["n8n"]
