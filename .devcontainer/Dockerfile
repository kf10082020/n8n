FROM node:18-bullseye-slim

# Устанавливаем зависимости
RUN apt-get update && \
    apt-get install -y python3 ffmpeg build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Устанавливаем n8n глобально
RUN npm install -g n8n

# Создаем рабочую директорию
WORKDIR /data

# Открываем порт
EXPOSE 5678

# Устанавливаем переменные окружения
ENV N8N_BASIC_AUTH_ACTIVE=true \
    N8N_BASIC_AUTH_USER=admin \
    N8N_BASIC_AUTH_PASSWORD=admin \
    N8N_PORT=5678 \
    N8N_HOST=0.0.0.0

# Команда запуска
CMD ["n8n"]
