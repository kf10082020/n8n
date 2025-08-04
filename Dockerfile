FROM node:20-bullseye-slim

# Установка зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    git \
    build-essential \
    python3 \
    cmake \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Установка n8n
RUN npm install -g n8n@latest

# Рабочая директория
WORKDIR /home/node/.n8n

# Обязательный Volume для Railway
VOLUME ["/home/node/.n8n"]

# Открытие порта
EXPOSE 5678

# Запуск n8n
CMD ["n8n"]
