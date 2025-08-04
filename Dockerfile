# Используем стабильный node-образ
FROM node:18-bullseye-slim

# Установка зависимостей
RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  ffmpeg curl git build-essential python3 && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Устанавливаем n8n
RUN npm install -g n8n

# Создаём рабочую директорию
WORKDIR /home/node

# Открываем порт
EXPOSE 5678

# Указываем volume для n8n данных
VOLUME ["/home/node/.n8n"]

# Запускаем n8n
CMD ["n8n"]
