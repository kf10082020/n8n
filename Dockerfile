FROM n8nio/n8n:1.45.0

# Установка переменных
ENV N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true

# Установка кастомных нод
RUN npm install -g @tavily/n8n-nodes-tavily \
    && npm install -g n8n-nodes-base

# Порт
EXPOSE 5678

# Запуск n8n
CMD ["n8n"]
