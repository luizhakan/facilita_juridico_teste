import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import ListaClientes from './Components/Clientes/ListaClientes/ListaClientes';
import AdicionarClientes from './Components/Clientes/AdicionarClientes/AdicionarClientes';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/listaclientes' element={<ListaClientes />} />
        <Route path='/adicionarcliente' element={<AdicionarClientes />} />
      </Routes>
    </div>
  );
}

export default App;
