# Facilita Jurídico Teste

Bem-vindo ao **Facilita Jurídico Teste**, um sistema de gerenciamento de clientes inovador para empresas de limpeza residencial. Este projeto integra um backend robusto em Node.js, um frontend interativo em React e um banco de dados eficiente PostgreSQL, todos encapsulados em containers Docker para uma experiência de desenvolvimento e implantação simplificada.

## Pré-requisitos

Antes de mergulhar no projeto, certifique-se de ter instalado:

- **Docker**: Uma plataforma de containerização essencial.
- **Docker Compose**: Facilita a execução de aplicações multi-container Docker (Incluído no Docker Desktop para Windows e Mac).
  https://www.docker.com/products/docker-desktop/

## Instruções de Instalação e Execução

### Passos para Windows, Linux e macOS:

#### 1. Clone o Repositório

Abra um terminal e execute os seguintes comandos para clonar o repositório do projeto:

```bash
git clone https://github.com/seu-usuario/facilita_juridico_teste.git
cd facilita_juridico_teste
```
2. Construir e Iniciar os Containers
Para construir e iniciar os containers utilizando Docker Compose, execute:

```bash
docker-compose up --build
```
Se não funcionar de primeira, tente rodar com permissões de administrador (windows) ou com sudo (linux).
Exemplo: 
```bash
sudo docker-compose up --build
```

Este comando irá baixar as imagens necessárias, construir o projeto e iniciar os serviços definidos no docker-compose.yml, incluindo o backend, frontend e o banco de dados PostgreSQL.

3. Acessar a Aplicação
Com os containers em execução, acesse:

Frontend: http://localhost:5173

Backend: http://localhost:5000 (Verifique a porta configurada)

## Comandos Úteis
Para parar os containers: ```bash docker-compose down```

Para visualizar logs dos containers: ```bash docker-compose logs```

## Estrutura do Projeto

/backend: Código-fonte do backend em Node.js.

/frontend: Código-fonte do frontend em React.

Dockerfile: Define a construção dos containers Docker para frontend e backend.

docker-compose.yml: Orquestra os serviços (frontend, backend e banco de dados).
