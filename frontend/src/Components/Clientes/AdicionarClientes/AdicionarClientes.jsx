import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Autosuggest from "react-autosuggest";

function AdicionarClientes() {
  // State variables
  const [nome, setNome] = useState(""); // Nome do cliente
  const [email, setEmail] = useState(""); // Email do cliente
  const [telefone, setTelefone] = useState(""); // Telefone do cliente
  const [endereco, setEndereco] = useState(""); // Endereço do cliente
  const [sugestoes, setSugestoes] = useState([]); // Sugestões de endereços
  const [coordenada_x, setCoordenada_x] = useState(""); // Coordenada X do endereço selecionado
  const [coordenada_y, setCoordenada_y] = useState(""); // Coordenada Y do endereço selecionado
  const [disabled, setDisabled] = useState(false); // Indica se o botão de envio está desabilitado
  const [validEmail, setValidEmail] = useState(false); // Indica se os campos são válidos
  const [validTelefone, setValidTelefone] = useState(false); // Indica se os campos são válidos
  const navigate = useNavigate(); // Função de navegação

  // useEffect para ativar/desativar o botão de envio quando os campos são preenchidos
  useEffect(() => {
    ativarDesativarBotao();
  }, [nome, email, telefone, endereco]);

  // Função para atualizar o estado do nome
  const handleChangeNome = (e) => setNome(e.target.value);

  // Função para atualizar o estado do email
  const handleEmail = (e) => setEmail(e.target.value);

  // verifica se o email já existe e se está no formato correto, se sim, seta o estado de validação do email como true
  const handleChangeEmail = async (e) => {
    try {
      const resposta = await fetch("http://localhost:5000/emails");
      if (resposta.ok) {
        const dados = await resposta.json();
        if (dados.includes(e.target.value)) {
          alert("Email já cadastrado");
          setValidEmail(false);
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
          alert("Email inválido");
          setValidEmail(false);
        } else {
          setValidEmail(true);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar emails:", err);
    }
  };

  // Função para atualizar o estado do telefone, verificando se já existe e testar com regex de telefone no formato brasileiro. o aviso só deverá aparecer ao sair do campo
  const handleTelefone = (e) => {
    setTelefone(e.target.value);
  };

  const handleChangeTelefone = (e) => {
    // regex para telefone no formato 99999999999
    if (!/^\d{11}$/.test(e.target.value)) {
      alert("Telefone inválido");
      setValidTelefone(false);
    } else {
      setValidTelefone(true);
    }
  };

  // Função para ativar/desativar o botão de envio
  const ativarDesativarBotao = () => {
    if (nome === "" || email === "" || telefone === "" || endereco === "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  // Função para buscar sugestões de endereços
  const buscarEndereco = async (valor) => {
    const resposta = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${valor}`
    );
    const dados = await resposta.json();
    setSugestoes(dados);
  };

  // Função para buscar sugestões de endereços quando o usuário digita
  const onSugestoesFetchRequested = ({ value }) => {
    buscarEndereco(value);
  };

  // Função para limpar as sugestões de endereços
  const onSugestoesClearRequested = () => {
    setSugestoes([]);
  };

  // Função para obter o valor da sugestão de endereço
  const getSugestaoValor = (sugestao) => sugestao.display_name;

  // Função para renderizar a sugestão de endereço
  const renderSugestao = (sugestao) => <span>{sugestao.display_name}</span>;

  // Função para lidar com a seleção de uma sugestão de endereço
  const onSugestaoSelected = (event, { suggestion }) => {
    setEndereco(suggestion.display_name);
    setCoordenada_x(suggestion.lat);
    setCoordenada_y(suggestion.lon);
  };

  // Função para lidar com o envio do formulário, mas antes verificar se o email e o telefone são válidos, e se todos os campos estão preenchidos
  const handleSubmit = async () => {
    if (validEmail && validTelefone) {
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
        if (resposta.ok) {
          alert("Cliente adicionado com sucesso");
          navigate(-1);
        } else {
          alert("Erro ao adicionar cliente");
        }
      } catch (err) {
        console.error("Erro ao adicionar cliente:", err);
      }
    } else {
      alert("Preencha todos os campos corretamente");
    }

    navigate("/listaclientes");
  };

  useEffect(() => {
    if (
      !validEmail ||
      !validTelefone ||
      nome === "" ||
      email === "" ||
      telefone === "" ||
      endereco === ""
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [validEmail, validTelefone, nome, email, telefone, endereco]);

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
            maxLength={11}
            max={11}
            placeholder="99999999999"
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
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Voltar
          </button>
          <button
            disabled={disabled}
            onClick={handleSubmit}
            className={
              disabled
                ? "bg-gray-300 py-2 px-4 rounded"
                : "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            }
          >
            Adicionar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdicionarClientes;
