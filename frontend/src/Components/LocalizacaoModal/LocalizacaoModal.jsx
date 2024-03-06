import { useState } from "react";
import Modal from "react-modal";
import Autosuggest from "react-autosuggest";

// eslint-disable-next-line react/prop-types
export default function LocalizacaoModal({ isOpen, onLocalizacaoSubmit }) {
  const [endereco, setEndereco] = useState("");
  const [sugestoes, setSugestoes] = useState([]);

  /**
   * Busca assíncrona de informações de endereço com base no valor fornecido.
   *
   * @param {type} valor - O valor para buscar informações de endereço.
   * @return {type} undefined
   */
  const buscarEndereco = async (valor) => {
    const resposta = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${valor}`
    );

    // verificar quantas requisições de API foram feitas
    console.log("Requisições feitas:", resposta);

    const dados = await resposta.json();
    setSugestoes(dados);
  };

  /**
   * Uma função para lidar com a solicitação de busca de sugestões.
   *
   * @param {Object} value - o valor de entrada para buscar sugestões
   * @return {void} 
   */
  const onSugestoesFetchRequested = ({ value }) => {
    if (value.length >= 4) {
      buscarEndereco(value);
    }
  };

    /**
     * Uma descrição da função inteira.
     *
     * @param {tipo} nomeDoParametro - descrição do parâmetro
     * @return {tipo} descrição do valor de retorno
     */
  const onSugestoesClearRequested = () => {
    setSugestoes([]);
  };

  const getSugestaoValor = (sugestao) => sugestao.display_name;

  const renderSugestao = (sugestao) => <span>{sugestao.display_name}</span>;

    /**
     * Manipula a seleção de uma sugestão.
     *
     * @param {Evento} event - o objeto de evento
     * @param {objeto} suggestion - o objeto de sugestão selecionado
     * @return {void} 
     */
  const onSugestaoSelected = (event, { suggestion }) => {
    setEndereco(suggestion.display_name);
    onLocalizacaoSubmit(suggestion.lat, suggestion.lon);
  };

  return (
    <Modal isOpen={isOpen} contentLabel="Definir Localização da Empresa">
      <h2>Definir Localização da Empresa</h2>
      <div className="relative w-full">
        <Autosuggest
          suggestions={sugestoes}
          onSuggestionsFetchRequested={onSugestoesFetchRequested}
          onSuggestionsClearRequested={onSugestoesClearRequested}
          getSuggestionValue={getSugestaoValor}
          renderSuggestion={renderSugestao}
          theme={{
            container: "flex flex-col w-full",
            suggestionsContainer: "w-full",
            suggestionsContainerOpen: "block",
            suggestionsList: "w-full",
            input: 'border border-gray-300 rounded p-2'
          }}
          inputProps={{
            placeholder: "Digite um endereço",
            value: endereco,
            onChange: (_, { newValue }) => {
              setEndereco(newValue)
            },
            autoFocus: true
          }}
          onSuggestionSelected={onSugestaoSelected}
        />
      </div>
    </Modal>
  );
}
