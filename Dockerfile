FROM n8nio/n8n:latest

USER root

# Устанавливаем дополнительные утилиты (например, ffmpeg, curl)
RUN apt-get update && apt-get install -y ffmpeg curl gnupg2

# Включаем доступ к Node.js-модулям
ENV N8N_ENABLE_NODEJS_CODE_EXECUTION=true

# (опционально) Включаем базовую авторизацию
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=admin

# Указываем порт
EXPOSE 5678

# Запуск n8n
CMD ["n8n"]
