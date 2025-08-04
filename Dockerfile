FROM n8nio/n8n:latest

# Railway требует, чтобы n8n слушал переменный порт
ENV N8N_PORT=${PORT} \
    N8N_HOST=0.0.0.0 \
    N8N_BASIC_AUTH_ACTIVE=true \
    N8N_BASIC_AUTH_USER=admin \
    N8N_BASIC_AUTH_PASSWORD=admin

# Создаём папку конфигурации, иначе Railway volume упадёт
RUN mkdir -p /home/node/.n8n

# Устанавливаем рабочую директорию
WORKDIR /home/node

EXPOSE 5678

# Запускаем через npx (гарантирует запуск даже если PATH сломан)
CMD ["npx", "n8n"]
