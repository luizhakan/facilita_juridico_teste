import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LocalizacaoModal from "../LocalizacaoModal/LocalizacaoModal";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    // Verificar se as coordenadas já estão no localStorage
    if (
      localStorage.getItem("coordenada_x") &&
      localStorage.getItem("coordenada_y")
    ) {
      setIsModalOpen(false);
    }
  }, []); // O segundo argumento vazio [] garante que isso seja executado apenas uma vez na montagem do componente

  const handleLocalizacaoSubmit = (x, y) => {
    localStorage.setItem("coordenada_x", x);
    localStorage.setItem("coordenada_y", y);
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  const irParaListarClientes = () => {
    if (
      localStorage.getItem("coordenada_x") &&
      localStorage.getItem("coordenada_y")
    ) {
      setIsModalOpen(false);
      navigate("/listaclientes");
    } else {
      setIsModalOpen(true);
    }
  };

  const irParaAdicionarCliente = () => {
    if (
      localStorage.getItem("coordenada_x") &&
      localStorage.getItem("coordenada_y")
    ) {
      setIsModalOpen(false);
      navigate("/adicionarcliente");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <LocalizacaoModal
        isOpen={isModalOpen}
        onLocalizacaoSubmit={handleLocalizacaoSubmit}
      />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-800 mb-8">
          Bem-vindo à Facilita Jurídico
        </h1>
        <div className="space-x-4">
          <button
            onClick={irParaListarClientes}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Listar Clientes
          </button>
          <button
            onClick={irParaAdicionarCliente}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Adicionar Cliente
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
