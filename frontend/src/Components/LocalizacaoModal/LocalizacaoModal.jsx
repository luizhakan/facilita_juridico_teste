import { useState } from "react";
import Modal from "react-modal";
import Autosuggest from "react-autosuggest";

// eslint-disable-next-line react/prop-types
export default function LocalizacaoModal({ isOpen, onLocalizacaoSubmit }) {
  const [endereco, setEndereco] = useState("");
  const [sugestoes, setSugestoes] = useState([]);

  // Buscar sugestões de endereços
  const buscarEndereco = async (valor) => {
    const resposta = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${valor}`
    );

    // verificar quantas requisições de API foram feitas
    console.log("Requisições feitas:", resposta);

    const dados = await resposta.json();
    setSugestoes(dados);
  };

  const onSugestoesFetchRequested = ({ value }) => {
    if (value.length >= 4) {
      buscarEndereco(value);
    }
  };

  const onSugestoesClearRequested = () => {
    setSugestoes([]);
  };

  const getSugestaoValor = (sugestao) => sugestao.display_name;

  const renderSugestao = (sugestao) => <span>{sugestao.display_name}</span>;

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
