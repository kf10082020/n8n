FROM n8nio/n8n:latest

USER root

# whisper.cpp + ffmpeg + deps
RUN apt-get update && apt-get install -y ffmpeg curl git build-essential cmake wget && \
    git clone https://github.com/ggerganov/whisper.cpp.git /opt/whisper.cpp && \
    cd /opt/whisper.cpp && make -j && cp main /usr/local/bin/whisper

# Скачиваем модель
RUN mkdir -p /data && \
    curl -L -o /data/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin

# Настройки n8n
ENV N8N_ENABLE_NODEJS_CODE_EXECUTION=true
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=admin

WORKDIR /data
EXPOSE 5678
CMD ["n8n"]
