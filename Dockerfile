FROM n8nio/n8n:1.45.0

# Переключаемся на root, чтобы можно было писать в /data
USER root

# Устанавливаем кастомные ноды ЛОКАЛЬНО в /data
RUN npm install --prefix /data \
    @tavily/n8n-nodes-tavily \
    n8n-nodes-base

# Возвращаем пользователя node
USER node

# Переменная для прав доступа к настройкам
ENV N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true

EXPOSE 5678

CMD ["n8n"]
