FROM n8nio/n8n:latest

# Railway требует, чтобы n8n слушал переменный порт
ENV N8N_PORT=${PORT} \
    N8N_HOST=0.0.0.0 \
    N8N_BASIC_AUTH_ACTIVE=true \
    N8N_BASIC_AUTH_USER=admin \
    N8N_BASIC_AUTH_PASSWORD=admin

# Создаём папку конфигурации (иначе Railway volume не сможет смонтировать)
RUN mkdir -p /home/node/.n8n

# Устанавливаем рабочую директорию (важно!)
WORKDIR /home/node

EXPOSE 5678

# Используем npx, потому что railway не поднимает глобальные bin'ы
CMD ["npx", "n8n"]
