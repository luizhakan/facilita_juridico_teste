import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalClientes from "../../ModalClientes/ModalClientes";
import Mapa from "../../Mapa/Mapa";

function ListaClientes() {
  // Estados
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [rota, setRota] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Hook para navegação
  const navigate = useNavigate();

  // Efeito para buscar clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const resposta = await fetch("http://localhost:5000/clientes");
        if (!resposta.ok) {
          throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        const dados = await resposta.json();
        setClientes(dados);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      }
    };

    fetchClientes();
  }, []);

  // Função para calcular rota
  const handleCalculateRoute = async () => {
    try {
      const resposta = await fetch("http://localhost:5000/rota");
      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }
      const rotaCalculada = await resposta.json();
      setRota(rotaCalculada);
      setShowModal(true);
    } catch (err) {
      console.error("Erro ao calcular rota:", err);
    }
  };

  // Função para deletar cliente
  const handleDelete = async (id) => {
    try {
      const resposta = await fetch(`http://localhost:5000/clientes/${id}`, {
        method: "DELETE",
      });
      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }
      setClientes(clientes.filter((cliente) => cliente.id !== id));
    } catch (err) {
      console.error("Erro ao deletar cliente:", err);
    }
  };

  // Filtro de clientes
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Telefone</th>
            <th className="px-4 py-2">Coordenadas</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((cliente) => (
            <tr key={cliente.id}>
              <td className="border px-4 py-2">{cliente.nome}</td>
              <td className="border px-4 py-2">{cliente.email}</td>
              <td className="border px-4 py-2">{cliente.telefone}</td>
              <td className="border px-4 py-2">{`X: ${cliente.coordenada_x}, Y: ${cliente.coordenada_y}`}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleDelete(cliente.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Voltar
      </button>
      <button
        onClick={handleCalculateRoute}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Calcular Rota
      </button>

      {showModal && (
        <ModalClientes
          title="Rota de Visitas"
          onClose={() => setShowModal(false)}
        >
          <Mapa rota={rota} />
          <ul
            className="list-disc pl-5"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowModal(false);
              }
            }}
          >
            {rota.map((cliente, index) => (
              <li key={index} className="mb-2">
                {`${cliente.nome} - Coordenadas: (${cliente.coordenada_x}, ${cliente.coordenada_y})`}
              </li>
            ))}
          </ul>
        </ModalClientes>
      )}
    </div>
  );
}

export default ListaClientes;
