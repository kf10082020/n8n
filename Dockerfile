# ✅ Используем стабильный официальный образ n8n
FROM n8nio/n8n:1.45.0

# ✅ Устанавливаем переменную окружения для прав
ENV N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true

# ❌ Не используем VOLUME — Railway сам монтирует volume

# ✅ Порт по умолчанию
EXPOSE 5678

# ✅ Явно указываем команду запуска
CMD ["n8n"]
