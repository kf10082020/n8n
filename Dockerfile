FROM n8nio/n8n:latest

USER root

# Устанавливаем зависимости
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    git \
    build-essential \
    cmake

# Скачиваем whisper.cpp и компилируем
RUN git clone https://github.com/ggerganov/whisper.cpp.git /whisper && \
    cd /whisper && \
    make -j

# Скачиваем модель
RUN mkdir -p /data && \
    curl -L -o /data/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin

# Добавляем whisper в PATH
ENV PATH="/whisper:${PATH}"

# Включаем Node.js code execution
ENV N8N_ENABLE_NODEJS_CODE_EXECUTION=true

# (Опционально) Basic auth
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=admin

EXPOSE 5678

CMD ["n8n"]
