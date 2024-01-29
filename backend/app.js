// Importando o módulo express
const express = require("express");

// Criando uma instância do aplicativo express
const app = express();

// Definindo a porta em que o servidor irá escutar
const port = 5000;

// Importando o módulo dotenv para carregar as variáveis de ambiente
require("dotenv").config();

// Importando o módulo cors para permitir requisições de diferentes origens
const cors = require("cors");
app.use(cors());

// Configurando o aplicativo para usar o middleware express.json para analisar o corpo das requisições como JSON
app.use(express.json());

// Definindo uma rota raiz que retorna a mensagem "Olá, mundo!"
app.get("/", (req, res) => {
  res.send("Olá, mundo!");
});

// Definindo rotas para manipulação de dados de clientes
app.get("/testdb", require("./routes/routes").testdb);
app.get("/clientes", require("./routes/routes").getClientes);
app.post("/clientes", require("./routes/routes").postClientes);
app.delete("/clientes/:id", require("./routes/routes").deleteClientes);

// Definindo rotas para manipulação de dados de emails e rota
app.get("/emails", require("./routes/routes").getEmails);
app.get("/rota", require("./routes/routes").getRota);
app.post("/empresa", require("./routes/routes").postEmpresa);

// Iniciando o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
