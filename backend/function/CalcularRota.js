function calcularRota(clientes) {
  if (clientes.length === 0) return []; // Verifica se a lista de clientes está vazia e retorna uma lista vazia caso verdadeiro

  let clienteAtual = { coordenada_x: 0, coordenada_y: 0 }; // Define as coordenadas iniciais do cliente atual como (0, 0)
  let rota = []; // Inicializa uma lista vazia para armazenar a rota
  let clientesRestantes = [...clientes]; // Cria uma cópia da lista de clientes

  while (clientesRestantes.length > 0) {
    // Enquanto ainda houver clientes restantes
    let indiceMaisProximo = 0; // Índice do cliente mais próximo
    let distanciaMaisProxima = Infinity; // Distância para o cliente mais próximo, inicializada com infinito

    for (let i = 0; i < clientesRestantes.length; i++) {
      // Percorre a lista de clientes restantes
      const dx = clienteAtual.coordenada_x - clientesRestantes[i].coordenada_x; // Calcula a diferença entre as coordenadas x
      const dy = clienteAtual.coordenada_y - clientesRestantes[i].coordenada_y; // Calcula a diferença entre as coordenadas y
      const distancia = Math.sqrt(dx * dx + dy * dy); // Calcula a distância usando o teorema de Pitágoras

      if (distancia < distanciaMaisProxima) {
        // Verifica se a distância é menor que a distância mais próxima atual
        distanciaMaisProxima = distancia; // Atualiza a distância mais próxima
        indiceMaisProximo = i; // Atualiza o índice do cliente mais próximo
      }
    }

    clienteAtual = clientesRestantes[indiceMaisProximo]; // Define o cliente atual como o cliente mais próximo
    rota.push(clienteAtual); // Adiciona o cliente atual à rota
    clientesRestantes.splice(indiceMaisProximo, 1); // Remove o cliente atual da lista de clientes restantes
  }

  rota.push({
    // Adiciona um ponto inicial à rota
    coordenada_x: -8.0584933,
    coordenada_y: -34.8848193,
    nome: "Ponto Inicial (ícone vermelho)",
  });

  return rota; // Retorna a rota calculada
}

module.exports = calcularRota; // Exporta a função calcularRota para uso em outros arquivos
