FROM node:18-bullseye-slim

# Устанавливаем ffmpeg и необходимые зависимости
USER root
RUN apt-get update && apt-get install -y ffmpeg curl gnupg2

# Устанавливаем n8n
RUN npm install --global n8n

# Создаём папку для n8n
RUN mkdir /root/.n8n

# Указываем порт
EXPOSE 5678

# Запуск n8n
CMD ["n8n"]
