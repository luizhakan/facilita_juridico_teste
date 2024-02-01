# Usando a imagem base do Node
FROM node:20

# Instalar PostgreSQL
RUN apt-get update && apt-get install -y postgresql postgresql-contrib

# Configurar o ambiente do PostgreSQL
USER postgres
RUN /etc/init.d/postgresql start &&\
    psql --command "CREATE USER luizjuridico WITH SUPERUSER PASSWORD 'senhajuridico';" &&\
    createdb -O luizjuridico banco_facilita_juridico

# Mudar para o usuário root para instalar mais dependências
USER root

# Instalar as dependências do frontend
WORKDIR /usr/src/app/frontend
COPY frontend/package*.json ./
RUN npm install

# Verificar a instalação do Vite
RUN npx vite --version

# Instalar as dependências do backend
WORKDIR /usr/src/app/backend
COPY backend/package*.json ./
RUN npm install

# Copiar o restante dos arquivos do projeto
WORKDIR /usr/src/app
COPY . .

# Expor as portas necessárias
EXPOSE 5173 5000 52120

# Comandos para iniciar o backend e o frontend
CMD ["/bin/bash", "-c", "service postgresql start && cd /usr/src/app/backend && npm start & cd /usr/src/app/frontend && npm start"]
