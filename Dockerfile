FROM n8nio/n8n:latest

# Railway требует слушать переменную PORT
ENV N8N_PORT=$PORT \
    N8N_HOST=0.0.0.0 \
    N8N_BASIC_AUTH_ACTIVE=true \
    N8N_BASIC_AUTH_USER=admin \
    N8N_BASIC_AUTH_PASSWORD=admin

EXPOSE $PORT

CMD ["n8n"]
