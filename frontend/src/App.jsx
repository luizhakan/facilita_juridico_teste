import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import ListaClientes from './components/Clientes/ListaClientes';
import AdicionarClientes from './components/Clientes/AdicionarClientes';

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
