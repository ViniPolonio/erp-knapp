// src/layout/Users.jsx
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaUsers, FaChevronDown, FaChevronRight, FaUserPlus, FaUserEdit, FaUserCheck } from "react-icons/fa";

const CompanyMenu = () => {
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
        Empresa
        <span style={{ marginLeft: "auto" }}>
          {isOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
        </span>
      </li>

      {isOpen && (
        <ul className="submenu submenu-shadow">          
          <li>
            <NavLink 
              to="/company"
              CompanyPage
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              <span className="nav-icon user-option-special"><FaUserEdit /></span>
              Principal
            <span className="user-option-separator"></span></NavLink>
          </li>
          <li>
            <NavLink 
              to="/branch"
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              <span className="nav-icon user-option-special"><FaUserCheck /></span>
              Filiais
            <span className="user-option-separator"></span></NavLink>
          </li>
        </ul>
      )}
    </>
  );
};

export default CompanyMenu;
