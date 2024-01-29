const express = require("express");
const app = express();
const port = 5000;
const { Pool } = require("pg");

require("dotenv").config();

const cors = require("cors");
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(express.json());

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

app.get("/", (req, res) => {
  res.send("Olá, mundo!");
});

app.get("/testdb", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Erro ao conectar ao banco de dados");
  }
});

app.get("/clientes", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM clientes");
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao listar clientes");
  }
});

app.post("/clientes", async (req, res) => {
  const { nome, email, telefone, coordenada_x, coordenada_y } = req.body;
  try {
    const client = await pool.connect();
    const coordenadasXNum = parseFloat(coordenada_x);
    const coordenadasYNum = parseFloat(coordenada_y);

    // Verificar se existe algum cliente com o mesmo email antes de inserir
    const resultEmail = await client.query(
      "SELECT * FROM clientes WHERE email = $1",
      [email]
    );

    if (resultEmail.rows.length > 0) {
      res.status(400).send("Já existe um cliente com esse email");
    } else {
      const result = await client.query(
        "INSERT INTO clientes (nome, email, telefone, coordenada_x, coordenada_y) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [nome, email, telefone, coordenadasXNum, coordenadasYNum]
      );
      res.json(result.rows[0]);
    }

    client.release();
  } catch (err) {
    console.error("Erro ao adicionar cliente:", err);
    res.status(500).send("Erro ao adicionar cliente: " + err.message);
  }
});


app.get("/telefones", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT telefone FROM clientes");
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao listar telefones: " + err.message);
  }
});

app.get("/emails", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT email FROM clientes");
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao listar emails");
  }
});

app.delete("/clientes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const client = await pool.connect();
    const result = await client.query(
      "DELETE FROM clientes WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao excluir cliente");
  }
});

function calcularRota(clientes) {
  if (clientes.length === 0) return [];

  let clienteAtual = { coordenada_x: 0, coordenada_y: 0 };
  let rota = [];
  let clientesRestantes = [...clientes];

  while (clientesRestantes.length > 0) {
    let indiceMaisProximo = 0;
    let distanciaMaisProxima = Infinity;

    for (let i = 0; i < clientesRestantes.length; i++) {
      const dx = clienteAtual.coordenada_x - clientesRestantes[i].coordenada_x;
      const dy = clienteAtual.coordenada_y - clientesRestantes[i].coordenada_y;
      const distancia = Math.sqrt(dx * dx + dy * dy);

      if (distancia < distanciaMaisProxima) {
        distanciaMaisProxima = distancia;
        indiceMaisProximo = i;
      }
    }

    clienteAtual = clientesRestantes[indiceMaisProximo];
    rota.push(clienteAtual);
    clientesRestantes.splice(indiceMaisProximo, 1);
  }

  rota.push({ coordenada_x: -8.0584933, coordenada_y: -34.8848193, nome: 'Ponto Inicial' });
  
  return rota;
}



// Rota para calcular a rota otimizada e com tratamento de erros
app.get("/rota", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM clientes WHERE coordenada_x IS NOT NULL AND coordenada_y IS NOT NULL");
    const rota = calcularRota(result.rows);
    // Verifique se as coordenadas estão no formato correto
    const rotaValida = rota.every(cliente => typeof cliente.coordenada_x === 'number' && typeof cliente.coordenada_y === 'number');
    if (!rotaValida) {
      throw new Error('Coordenadas inválidas');
    }
    res.json(rota);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao calcular rota: " + err.message);
  }
});

