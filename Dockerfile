# Используем официальный образ n8n
FROM n8nio/n8n:latest

USER root

# Устанавливаем необходимые пакеты
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    git \
    build-essential \
    cmake

# Клонируем и собираем whisper.cpp
WORKDIR /opt/whisper
RUN git clone --recurse-submodules https://github.com/ggerganov/whisper.cpp.git \
 && cd whisper.cpp && make -j

# Копируем бинарник whisper в PATH
RUN cp whisper.cpp/main /usr/local/bin/whisper && chmod +x /usr/local/bin/whisper

# Скачиваем модель (можно изменить на другую)
RUN curl -L -o /data/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin

# Включаем Node.js-исполнение
ENV N8N_ENABLE_NODEJS_CODE_EXECUTION=true

# (опционально) Включаем базовую авторизацию
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=admin

# Порт по умолчанию
EXPOSE 5678

# Устанавливаем рабочую директорию
WORKDIR /data

# Запуск n8n
CMD ["n8n"]
