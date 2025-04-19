import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import './Layout.css';

const Layout = () => {
  // Itens do menu - pode ser movido para um arquivo de configuração depois
  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: "📊" },
    { path: "/projects", name: "Projetos", icon: "📁" },
    { path: "/reports", name: "Relatórios", icon: "📈" },
    { path: "/settings", name: "Configurações", icon: "⚙️" }
  ];

  return (
    <div className="app-layout">
      {/* Topbar Amarelo Vibrante */}
      <header className="layout-header">
        <div className="header-content">
          <img src="/knapp_logo.svg.png" alt="Logo Knapp" className="layout-logo" />
          <div className="user-profile">
            <span>Olá, Usuário</span>
            <div className="user-avatar">U</div>
          </div>
        </div>
      </header>

      <div className="layout-main-container">
        {/* Sidebar Branca (20% da largura) */}
        <aside className="layout-sidebar">
          <nav className="sidebar-nav">
            <ul>
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => 
                      isActive ? "nav-item active" : "nav-item"
                    }
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Conteúdo Principal (80% da largura) */}
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;