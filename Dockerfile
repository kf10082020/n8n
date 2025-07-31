# ✅ 1. Используем официальный образ, где уже есть команда `n8n`
FROM n8nio/n8n:1.45.0

# ✅ 2. Временно включаем root, чтобы установить кастомные ноды в /data
USER root

# ✅ 3. Устанавливаем кастомные ноды ЛОКАЛЬНО (не глобально!)
RUN npm install --prefix /data \
    @tavily/n8n-nodes-tavily \
    n8n-nodes-base

# ✅ 4. Возвращаем безопасного пользователя node
USER node

# ✅ 5. Настраиваем переменные
ENV N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true

# ✅ 6. Порт для Railway (внутренний, внешний всегда 443)
EXPOSE 5678

# ✅ 7. Явная команда запуска (важно!)
CMD ["n8n"]
