import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const irParaListarClientes = () => {
    navigate('/listaclientes');
  };

  const irParaAdicionarCliente = () => {
    navigate('/adicionarcliente');
  };

  return (
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
  );
}

export default Home;
