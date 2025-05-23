// src/layout/Users.jsx
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaUsers, FaChevronDown, FaChevronRight, FaUserPlus, FaUserEdit, FaUserCheck } from "react-icons/fa";
import './Users.css';

const UsersMenu = () => {
  const location = useLocation();
  const isUsersSection = location.pathname.startsWith("/users");

  const [isOpen, setIsOpen] = useState(isUsersSection);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <li onClick={toggleMenu} className={`nav-item ${isUsersSection ? "active" : ""}`} style={{ cursor: "pointer" }}>
        <span className="nav-icon"><FaUsers /></span>
        Usuários
        <span style={{ marginLeft: "auto" }}>
          {isOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
        </span>
      </li>

      {isOpen && (
        <ul className="submenu submenu-shadow">          
          <li>
          <NavLink 
            to="/consult-users"
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <span className="nav-icon user-option-special"><FaUserEdit /></span>
            Consultar
            <span className="user-option-separator"></span>
          </NavLink>
          </li>
          <li>
            <NavLink 
              to="/users-approve"
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              <span className="nav-icon user-option-special"><FaUserCheck /></span>
              Aprovar/Reprovar
            <span className="user-option-separator"></span></NavLink>
          </li>
        </ul>
      )}
    </>
  );
};

export default UsersMenu;
