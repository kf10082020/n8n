FROM n8nio/n8n:latest

USER root

# Установка зависимостей
RUN apt-get update && apt-get install -y ffmpeg curl git build-essential cmake wget

# Сборка whisper.cpp
WORKDIR /opt
RUN git clone https://github.com/ggerganov/whisper.cpp.git && \
    cd whisper.cpp && make -j && cp main /usr/local/bin/whisper

# Скачиваем модель
RUN mkdir -p /data && \
    curl -L -o /data/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin

# Активация NodeJS
ENV N8N_ENABLE_NODEJS_CODE_EXECUTION=true

# Авторизация
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=admin

EXPOSE 5678

WORKDIR /data
CMD ["n8n"]
