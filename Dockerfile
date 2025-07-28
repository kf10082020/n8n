# Используем официальный образ n8n
FROM n8nio/n8n:latest

USER root

# Устанавливаем необходимые зависимости
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    git \
    build-essential \
    cmake \
    wget

# Клонируем и компилируем whisper.cpp
WORKDIR /opt
RUN git clone https://github.com/ggerganov/whisper.cpp.git && \
    cd whisper.cpp && make -j && \
    cp main /usr/local/bin/whisper

# Проверка
RUN whisper --help || echo "Whisper установлен"

# Скачиваем модель в папку, видимую n8n
RUN mkdir -p /data && \
    curl -L -o /data/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin

# Включаем Node.js-код
ENV N8N_ENABLE_NODEJS_CODE_EXECUTION=true

# Авторизация
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=admin

# Порт
EXPOSE 5678

# Рабочая директория
WORKDIR /data

# Запуск
CMD ["n8n"]
