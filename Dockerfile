# ✅ Используем официальный стабильный образ Node.js с Debian slim
FROM node:18-bullseye-slim

# 🧾 Обновляем и устанавливаем зависимости в одном слое
RUN apt-get update && \
  apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    git \
    build-essential \
    cmake \
    python3 \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# 📦 Установка n8n глобально
RUN npm install -g n8n

# 📂 Создаём и переходим в рабочую директорию
WORKDIR /data

# 🐳 Открываем порт, на котором работает n8n
EXPOSE 5678

# 📦 Добавляем volume (по желанию, если контейнер stateful)
VOLUME ["/data"]

# 🚀 Команда по умолчанию
CMD ["n8n"]
