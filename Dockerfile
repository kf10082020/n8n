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

# Установка n8n глобально
RUN npm install -g n8n

# Создание рабочей директории
WORKDIR /data

# Установка volume (но без инструкции VOLUME для Railway)
ENV N8N_USER_FOLDER=/data

# Открытие порта
EXPOSE 5678

# Запуск n8n
CMD [ "sh", "-c", "n8n"]
