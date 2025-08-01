FROM n8nio/n8n:latest

# Убедись, что Railway будет монтировать volume в правильную директорию
ENV N8N_USER_FOLDER="/home/node/.n8n"

# Настройки Railway совместимости
ENV N8N_PORT=5678 \
    N8N_HOST=0.0.0.0 \
    N8N_BASIC_AUTH_ACTIVE=true \
    N8N_BASIC_AUTH_USER=admin \
    N8N_BASIC_AUTH_PASSWORD=admin

EXPOSE 5678

CMD ["n8n"]
