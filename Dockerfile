FROM debian:bullseye-slim

# Установим зависимости
RUN apt-get update && \
  apt-get install -y --no-install-recommends \
    build-essential cmake git curl ffmpeg python3 \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Клонируем Whisper.cpp
WORKDIR /app
RUN git clone https://github.com/ggerganov/whisper.cpp.git
WORKDIR /app/whisper.cpp

# Собираем
RUN cmake -B build -DCMAKE_BUILD_TYPE=Release && cmake --build build -j

# Копируем модель
COPY ggml-base.en.bin /app/ggml-base.en.bin

# Точка входа
ENTRYPOINT ["/app/whisper.cpp/build/bin/main"]
