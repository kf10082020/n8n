FROM node:20-bullseye-slim

# Установка зависимостей
RUN apt-get update && \
    apt-get install -y ffmpeg build-essential python3 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Установка n8n
RUN npm install -g n8n

# Установка рабочей директории
WORKDIR /data

# Порт
EXPOSE 5678

# Запуск n8n
CMD ["n8n"]
