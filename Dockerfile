FROM n8nio/n8n:latest

# Установка переменных среды
ENV N8N_PORT=${PORT} \
    N8N_HOST=0.0.0.0 \
    N8N_BASIC_AUTH_ACTIVE=true \
    N8N_BASIC_AUTH_USER=admin \
    N8N_BASIC_AUTH_PASSWORD=admin

# Создаём конфиг директорию, чтобы volume не ломал запуск
RUN mkdir -p /home/node/.n8n

# Устанавливаем рабочую директорию
WORKDIR /home/node

# Проксируем порт 5678 (по умолчанию для n8n)
EXPOSE 5678

# Запускаем n8n через npx, т.к. Railway может терять глобальные бинари
CMD ["n8n"]
