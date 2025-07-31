# Используем официальный стабильный образ Community Edition
FROM n8nio/n8n:1.44.0

# Устанавливаем рабочую директорию
WORKDIR /data

# Открываем порт, используемый n8n
EXPOSE 5678

# Указываем, что данные будут сохраняться в volume
VOLUME ["/data"]

# Устанавливаем переменные окружения прямо здесь (можно также задать в Railway UI)
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=securepassword
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=http

# Запускаем n8n
CMD ["n8n"]
