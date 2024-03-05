const pool = require("../db/db");
const calcularRota = require("../function/CalcularRota");

/**
 * Função assíncrona para interagir com o banco de dados de teste.
 *
 * @param {Object} req - o objeto de requisição
 * @param {Object} res - o objeto de resposta
 * @return {Promise} uma Promise que resolve com as linhas de resultado da consulta ou rejeita com uma mensagem de erro
 */
const testdb = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Erro ao conectar ao banco de dados");
  }
};

/**
 * Função assíncrona para obter a lista de clientes.
 *
 * @param {Object} req - O objeto de requisição
 * @param {Object} res - O objeto de resposta
 * @return {Promise} O resultado da operação assíncrona
 */
const getClientes = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM clientes");
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao listar clientes");
  }
};

/**
 * Manipula a requisição POST para criar um novo cliente,
 * verifica se o e-mail já existe e adiciona o cliente ao banco de dados.
 *
 * @param {Object} req - o objeto de requisição
 * @param {Object} res - o objeto de resposta
 * @return {Promise} uma Promise que resolve para o resultado da operação
 */
const postClientes = async (req, res) => {
  const { nome, email, telefone, coordenada_x, coordenada_y } = req.body;
  try {
    const client = await pool.connect();
    const coordenadasXNum = parseFloat(coordenada_x);
    const coordenadasYNum = parseFloat(coordenada_y);

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
};

/**
 * Função assíncrona para recuperar números de telefone do banco de dados e enviar o resultado como JSON.
 *
 * @param {Object} req - O objeto de requisição
 * @param {Object} res - O objeto de resposta
 * @return {Promise<void>} O resultado da função como uma promise
 */
const getTelefones = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT telefone FROM clientes");
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao listar telefones: " + err.message);
  }
};

/**
 * Função assíncrona para recuperar os emails.
 *
 * @param {Object} req - o objeto de requisição
 * @param {Object} res - o objeto de resposta
 * @return {Promise} uma promise que resolve para os emails recuperados
 */
const getEmails = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT email FROM clientes");
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao listar emails");
  }
};

/**
 * Exclui um cliente do banco de dados com base no ID fornecido.
 *
 * @param {Object} req - o objeto de requisição
 * @param {Object} res - o objeto de resposta
 * @return {Promise} uma Promise que resolve para o resultado da exclusão
 */
const deleteClientes = async (req, res) => {
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
};


 /**
  * Função assíncrona para lidar com a solicitação de post para dados da empresa.
  *
  * @param {object} req - o objeto de solicitação
  * @param {object} res - o objeto de resposta
  * @return {Promise} uma Promise que resolve para a resposta JSON com coordenada_x e coordenada_y
  */
const postEmpresa = async (req, res) => {
  const { coordenada_x, coordenada_y } = req.body;
  try {
    const client = await pool.connect();
    const coordenadasXNum = parseFloat(coordenada_x);
    const coordenadasYNum = parseFloat(coordenada_y);

    // inserir no localStorage
    localStorage.setItem("coordenada_x", coordenadasXNum);
    localStorage.setItem("coordenada_y", coordenadasYNum);

    res.json({ coordenada_x: coordenadasXNum, coordenada_y: coordenadasYNum });
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao adicionar empresa: " + err.message);
  }
};

  /**
   * Função assíncrona para obter a rota com base nas coordenadas válidas do cliente e enviá-la como resposta JSON.
   *
   * @param {Object} req - o objeto de requisição
   * @param {Object} res - o objeto de resposta
   * @return {Promise} uma Promise que é resolvida quando a rota é calculada com sucesso e enviada como resposta JSON, ou rejeitada com uma mensagem de erro
   */
const getRota = async (req, res) => {
  try {
    // Estabelece uma conexão com o banco de dados
    const client = await pool.connect();

    // Executa uma consulta SQL para obter todos os clientes que possuem coordenadas válidas
    const result = await client.query(
      "SELECT * FROM clientes WHERE coordenada_x IS NOT NULL AND coordenada_y IS NOT NULL"
    );

    // Calcula a rota com base nos clientes retornados pela consulta
    const rota = calcularRota(result.rows);

    // Verifica se todas as coordenadas da rota são números válidos
    const rotaValida = rota.every(
      (cliente) =>
        typeof cliente.coordenada_x === "number" &&
        typeof cliente.coordenada_y === "number"
    );

    // Se a rota não for válida, lança um erro com uma mensagem específica
    if (!rotaValida) {
      throw new Error("Coordenadas inválidas");
    }

    // Envia a rota como resposta para o cliente em formato JSON
    res.json(rota);

    // Fecha a conexão com o banco de dados para liberar recursos
    client.release();
  } catch (err) {
    // Trata qualquer erro que ocorra durante a execução do código dentro do bloco try
    // Imprime o erro no console
    // Define o status da resposta HTTP como 500 (Internal Server Error)
    // Envia uma mensagem de erro com a descrição do erro como resposta para o cliente
    console.error(err);
    res.status(500).send("Erro ao calcular rota: " + err.message);
  }
};

// Exporta as funções para serem utilizadas em outros arquivos
exports.testdb = testdb;
exports.getClientes = getClientes;
exports.postClientes = postClientes;
exports.getTelefones = getTelefones;
exports.getEmails = getEmails;
exports.deleteClientes = deleteClientes;
exports.getRota = getRota;
exports.postEmpresa = postEmpresa;
