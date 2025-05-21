import { Outlet, NavLink } from "react-router-dom";
import UserMenu from "../../pages/UserMenu/UserMenu";
import './Layout.css';
import UsersMenu from "./User/Users";
import { FaFolderOpen, FaChartLine } from "react-icons/fa";
import CompanyMenu from "./Company/Company";

const Layout = () => {
  const menuItems = [
    { path: "/", name: "Projetos", icon: <FaFolderOpen /> },
    { path: "/reports", name: "Relatórios", icon: <FaChartLine /> }
  ];

  const user = JSON.parse(sessionStorage.getItem("user"));
  const userName = user?.name || "Usuário";
  
  return (
    <div className="app-layout">
      <header className="layout-header">
        <div className="header-wrapper">
          <NavLink to="/home" className="logo-container">
            <img src="/knapp_logo.svg.png" alt="Logo Knapp" className="layout-logo" />
          </NavLink>
          
          <div className="header-content">
            <UserMenu userName={userName} />
          </div>
        </div>
      </header>

      <div className="layout-main-container">
        <aside className="layout-sidebar">
          <nav className="sidebar-nav">
            <ul>

              {/* MENU CONFIG COMPANY */}
              <CompanyMenu></CompanyMenu>

              {/* MENU DE USUARIOS */}
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
