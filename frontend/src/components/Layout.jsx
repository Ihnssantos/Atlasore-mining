import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

// Itens do menu lateral
const MENU_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/cadastros', label: 'Cadastros' },
  { to: '/gestao-operacional', label: 'Gestão operacional' },
  { to: '/relatorios', label: 'Relatórios' },
];

// Estrutura comum das telas: sidebar fixa à esquerda e conteúdo da página à direita
export default function Layout() {
  return (
    <div className="layout">
      {/* Sidebar com a logo e o menu */}
      <aside className="sidebar">
        <div className="logo">
          Atlas<span>Ore</span>
          <small>MINING</small>
        </div>
        <nav>
          {MENU_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className="menu-link">
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Área onde a tela escolhida é exibida */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}