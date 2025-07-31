FROM n8nio/n8n:1.45.0

# Установка кастомной ноды ЛОКАЛЬНО, а не глобально
USER root
RUN npm install --prefix /data @tavily/n8n-nodes-tavily

# Назначаем рабочую директорию и права обратно node-пользователю
USER node

ENV N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true

EXPOSE 5678

CMD ["n8n"]
