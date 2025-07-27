FROM n8nio/base:22

# Устанавливаем необходимые утилиты
RUN apk add --no-cache --update \
    openssh \
    sudo \
    shadow \
    bash

# Даём пользователю node права на sudo без пароля
RUN echo "node ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/node && \
    chmod 0440 /etc/sudoers.d/node

# Создаём и настраиваем рабочую директорию
RUN mkdir /workspaces && chown node:node /workspaces

# Переключаемся на пользователя node
USER node

# Создаём кэш для pnpm и настраиваем глобальный путь
RUN mkdir -p ~/.pnpm-store && \
    pnpm config set store-dir ~/.pnpm-store --global
