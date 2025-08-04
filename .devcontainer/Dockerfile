# ✅ Официальная база
FROM node:18-bullseye-slim

# 🧰 Зависимости для n8n (ffmpeg, python, build tools)
RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  ffmpeg \
  python3 \
  git \
  curl \
  build-essential \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# 📂 Рабочая директория
WORKDIR /app

# 🔽 Копируем все файлы в контейнер (важно: Dockerfile не должен быть в .dockerignore)
COPY . .

# 📦 Установка зависимостей
RUN corepack enable && \
    pnpm install --frozen-lockfile --workspace-root && \
    pnpm build

# 📌 Устанавливаем глобально cli (чтобы `n8n` попал в $PATH)
RUN pnpm --filter n8n install -g

# 📂 Каталог для данных (можно примонтировать в Railway)
VOLUME ["/home/node/.n8n"]

# 🌍 Порт, на котором работает n8n
EXPOSE 5678

# 🚀 Команда запуска
CMD ["n8n"]
