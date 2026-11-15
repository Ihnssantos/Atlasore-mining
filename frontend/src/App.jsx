import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Cadastros from './pages/Cadastros.jsx';
import GestaoOperacional from './pages/GestaoOperacional.jsx';
import Relatorios from './pages/Relatorios.jsx';

// Define a URL de cada tela, todas dentro do Layout que traz a sidebar
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="cadastros" element={<Cadastros />} />
        <Route path="gestao-operacional" element={<GestaoOperacional />} />
        <Route path="relatorios" element={<Relatorios />} />
      </Route>
    </Routes>
  );
}