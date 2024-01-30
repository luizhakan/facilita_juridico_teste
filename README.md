# Facilita Jurídico Teste
Este projeto é um sistema de gerenciamento de clientes para uma empresa de limpeza residencial. Ele inclui um backend em Node.js, um frontend em React e um banco de dados PostgreSQL.

Pré-requisitos
Antes de iniciar, certifique-se de ter instalado:

# Docker

Docker Compose (geralmente incluído na instalação do Docker Desktop em Windows e Mac)
Instruções de Instalação e Execução
Windows, Linux e macOS
Clone o Repositório

Abra um terminal e clone o repositório do projeto:


# git clone https://github.com/seu-usuario/facilita_juridico_teste.git
# cd facilita_juridico_teste
# Construir e Iniciar os Containers

Execute o seguinte comando para construir e iniciar os containers usando Docker Compose:


# docker-compose up --build
Este comando irá baixar as imagens necessárias, construir o projeto e iniciar os serviços definidos no docker-compose.yml, incluindo o backend, frontend e o banco de dados PostgreSQL.

Acessar a Aplicação

Após os containers estarem rodando, você pode acessar:

O frontend em http://localhost:5173
O backend geralmente em http://localhost:5000 (dependendo de como está configurado)

# Comandos Úteis
Para parar os containers, use docker-compose down.
Para ver os logs dos containers, use docker-compose logs.
Para executar comandos dentro de um container, use docker-compose exec [service_name] [command], onde [service_name] é o nome do serviço definido no docker-compose.yml e [command] é o comando que você deseja executar.

# Estrutura do Projeto
/backend: Contém o código-fonte do backend em Node.js.
/frontend: Contém o código-fonte do frontend em React.
Dockerfile: Define como os containers Docker para o frontend e o backend são construídos.
docker-compose.yml: Define como os serviços (frontend, backend e banco de dados) são orquestrados.