import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Autosuggest from "react-autosuggest";

function AdicionarClientes() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [coordenada_x, setCoordenada_x] = useState("");
  const [coordenada_y, setCoordenada_y] = useState("");
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const handleChangeNome = (e) => setNome(e.target.value);


  const handleChangeEmail = (e) => {
    // ao sair do campo de email, verificar no backend (http://localhost:5000/emails) se o email já existe. se sim, exibir um alerta de erro
    const verificarEmail = async () => {
      try {
        const resposta = await fetch("http://localhost:5000/emails");
        if (!resposta.ok) {
          throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        const dados = await resposta.json();
        const emails = dados.map((email) => email.email);
        if (emails.includes(e.target.value)) {
          alert("Já existe um cliente com este email");
          setDisabled(true);
        }
      } catch (err) {
        console.error("Erro ao buscar emails:", err);
      }
    };

    verificarEmail();
  };

  const handleEmail = (e) => setEmail(e.target.value);

  const handleTelefone = (e) => setTelefone(e.target.value);

  const handleChangeTelefone = (e) => {
    // ao sair do campo de telefone, verificar no backend (http://localhost:5000/telefones) se o telefone já existe. se sim, exibir um alerta de erro
    const verificarTelefone = async () => {
        try {
            const resposta = await fetch("http://localhost:5000/telefones");
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }
            const dados = await resposta.json();
            const telefones = dados.map((telefone) => telefone.telefone);
            if (telefones.includes(e.target.value)) {
                alert("Já existe um cliente com este telefone");
                setDisabled(true);
            }
        } catch (err) {
            console.error("Erro ao buscar telefones:", err);
        }
    };

    verificarTelefone();
    };

  const buscarEndereco = async (valor) => {
    const resposta = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${valor}`
    );
    const dados = await resposta.json();
    setSugestoes(dados);
  };

  const onSugestoesFetchRequested = ({ value }) => {
    buscarEndereco(value);
  };

  const onSugestoesClearRequested = () => {
    setSugestoes([]);
  };

  const getSugestaoValor = (sugestao) => {
    return sugestao.display_name;
  };

  const renderSugestao = (sugestao) => {
    return <span>{sugestao.display_name}</span>;
  };

  const onSugestaoSelected = (event, { suggestion }) => {
    setEndereco(suggestion.display_name);
    setCoordenada_x(suggestion.lat);
    setCoordenada_y(suggestion.lon);
  };

  const ativarDesativarBotao = () => {
    if (nome === "" || email === "" || telefone === "" || endereco === "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    ativarDesativarBotao();
  }, [nome, email, telefone, endereco]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resposta = await fetch("http://localhost:5000/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          endereco,
          coordenada_x,
          coordenada_y,
        }),
      });

      if (resposta.status === 409) {
        throw new Error("Já existe um cliente com este email");
      } else if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      } else {
        navigate("/listaclientes");
      }
    } catch (err) {
      console.error("Erro ao adicionar cliente:", err);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Adicionar Cliente
      </h1>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome:
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            autoFocus
            onChange={handleChangeNome}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            onBlur={handleChangeEmail}
            onChange={handleEmail}
            value={email}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label
            htmlFor="telefone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Telefone:
          </label>
          <input
            type="text"
            id="telefone"
            value={telefone}
            onBlur={handleChangeTelefone}
            onChange={handleTelefone} // Atualizado para usar a função handleChangeTelefone
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <label
          htmlFor="endereco"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Endereço:
        </label>
        <div className="relative w-full p-2 border border-gray-300 rounded">
          <Autosuggest
            // ... outras props
            suggestions={sugestoes}
            onSuggestionsFetchRequested={onSugestoesFetchRequested}
            onSuggestionsClearRequested={onSugestoesClearRequested}
            getSuggestionValue={getSugestaoValor}
            renderSuggestion={renderSugestao}
            inputProps={{
              placeholder: "Digite um endereço",
              value: endereco,
              className: "w-full p-2",
              onChange: (_, { newValue }) => setEndereco(newValue),
            }}
            theme={{
              container: "w-full",
              suggestion: "cursor-pointer",
              suggestionsList:
                "absolute z-10 bg-white shadow-lg max-h-60 overflow-auto",
              suggestionsContainerOpen: "absolute w-full mt-1",
              input: "w-full p-2 flex",
            }}
            onSuggestionSelected={onSugestaoSelected}
          />
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Voltar
          </button>
          <button
            disabled={disabled}
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Adicionar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdicionarClientes;
