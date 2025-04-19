import { Outlet, NavLink } from "react-router-dom";
import UserMenu from "../../pages/UserMenu/UserMenu";
import './Layout.css';
import UsersMenu from "./Users";
import { FaFolderOpen, FaChartLine } from "react-icons/fa";

const Layout = () => {
  const menuItems = [
    { path: "/projects", name: "Projetos", icon: <FaFolderOpen /> },
    { path: "/reports", name: "Relatórios", icon: <FaChartLine /> }
  ];

  const userName = "Vinicius"; // depois pode puxar do localStorage/session etc.

  return (
    <div className="app-layout">
      <header className="layout-header">
        <div className="header-content">
          {/* Logo clicável que leva para /home */}
          <NavLink to="/home">
            <img src="/knapp_logo.svg.png" alt="Logo Knapp" className="layout-logo" />
          </NavLink>
          <UserMenu userName={userName} />
        </div>
      </header>

      <div className="layout-main-container">
        <aside className="layout-sidebar">
          <nav className="sidebar-nav">
            <ul>
              <UsersMenu />

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
