FROM node:18-bullseye-slim

# Установка зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    git \
    build-essential \
    python3 \
    cmake \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Установка стабильной версии n8n (v1.41.1 — стабильна и работает)
RUN npm install -g n8n@1.41.1

WORKDIR /data

EXPOSE 5678

ENTRYPOINT ["n8n"]
