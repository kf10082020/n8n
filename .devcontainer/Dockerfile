# Базируемся на официальном n8n образе
FROM n8nio/n8n:latest

# Установка базовых инструментов разработчика
USER root
RUN apt-get update && apt-get install -y \
    curl \
    git \
    nano \
    vim \
    build-essential \
    sudo \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Добавляем пользователя vscode (по стандарту devcontainer)
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000

RUN groupadd --gid $USER_GID $USERNAME \
 && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
 && echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/$USERNAME \
 && chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME
WORKDIR /home/$USERNAME

# Создаём директорию под n8n конфиг, чтобы не ломался запуск
RUN mkdir -p /home/$USERNAME/.n8n

# Установка глобально удобных тулов (опционально)
RUN npm install -g npm nodemon n8n

# Открываем стандартный порт n8n
EXPOSE 5678

# Установка переменных среды
ENV N8N_PORT=5678 \
    N8N_HOST=0.0.0.0 \
    N8N_BASIC_AUTH_ACTIVE=true \
    N8N_BASIC_AUTH_USER=admin \
    N8N_BASIC_AUTH_PASSWORD=admin

# Запускаем n8n
CMD ["n8n"]
