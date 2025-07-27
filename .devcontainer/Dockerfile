FROM n8nio/base:22

# Устанавливаем необходимые утилиты
RUN apk add --no-cache --update \
    openssh \
    sudo \
    shadow \
    bash \
    curl \
    git

# Даём пользователю node права на sudo без пароля
RUN echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node && \
    chmod 0440 /etc/sudoers.d/node

# Создаём и настраиваем рабочую директорию
RUN mkdir -p /workspaces && chown node:node /workspaces

# Переключаемся на пользователя node
USER node

# Подготавливаем глобальное хранилище pnpm
RUN mkdir -p ~/.pnpm-store && \
    corepack enable && \
    pnpm config set store-dir ~/.pnpm-store --global
