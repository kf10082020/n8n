# Используем стабильный Node.js с поддержкой apt
FROM node:18-bullseye-slim

# Установка всех зависимостей
RUN apt-get update && apt-get install -y \
  ffmpeg \
  curl \
  git \
  build-essential \
  cmake \
  python3 \
  && rm -rf /var/lib/apt/lists/*

# Установка n8n
RUN npm install -g n8n

# Создаём рабочую директорию
WORKDIR /data

# Railway передаёт ENV автоматически, дополнительно ничего не нужно

# Открываем порт n8n
EXPOSE 5678

# Старт n8n с указанием рабочей папки (используется в volume)
CMD ["n8n"]
