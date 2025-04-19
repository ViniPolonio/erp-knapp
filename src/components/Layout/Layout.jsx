import { Outlet, NavLink } from "react-router-dom";
import UserMenu from "../../pages/UserMenu/UserMenu";
import './Layout.css';

const Layout = () => {
  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: "📊" },
    { path: "/projects", name: "Projetos", icon: "📁" },
    { path: "/reports", name: "Relatórios", icon: "📈" }
  ];

  // Nome mockado do usuário
  const userName = "Vinicius"; // Aqui você pode alterar para o nome real do usuário conforme necessário | PEGAR DO STORAGE DO NAVEGADOR

  return (
    <div className="app-layout">
      <header className="layout-header">
        <div className="header-content">
          <img src="/knapp_logo.svg.png" alt="Logo Knapp" className="layout-logo" />
          <UserMenu userName={userName} /> {/* Passando o nome para o componente UserMenu */}
        </div>
      </header>

      <div className="layout-main-container">
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

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
