import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './UserMenu.css';

const UserMenu = ({ userName = "Vinícius" }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverLeft, setPopoverLeft] = useState(true);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const navigate = useNavigate();
  const avatarRef = useRef(null);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const userEmail = user?.email || "Usuário";

  const firstInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setShowPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const togglePopover = () => {
    setShowPopover((prev) => !prev);
  
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      const popoverWidth = 200; // igual ao .popover { width: 200px; }
      const margin = 10;
  
      // se houver espaço à direita, coloca à direita; se não, coloca à esquerda
      setPopoverLeft(rect.right + popoverWidth + margin < window.innerWidth);
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleSendEmail = () => {
    toast.success(`E‑mail de recuperação enviado para ${userEmail}`, {
      position: "top-right",
      autoClose: 3000,
      theme: "light",
    });
    setShowPwdModal(false);
  };

  return (
    <>
      <div className="user-profile" ref={avatarRef}>
        <div className="user-avatar">
          {firstInitial}
        </div>

        <button className="settings-button" onClick={togglePopover}>
          <FaCog />
        </button>

        {showPopover && (
          <div className={`popover ${popoverLeft ? 'left' : 'right'}`}>
            <div className="popover-content">
              <h4>Olá, {userName}!</h4>
              <div className="popover-buttons">
                <button
                  className="popover-item"
                  onClick={() => {
                    navigate("/edit-profile");
                    setShowPopover(false);
                  }}
                >
                  Editar Perfil
                </button>
                <button
                  className="popover-item"
                  onClick={() => {
                    setShowPopover(false);
                    setShowPwdModal(true);
                  }}
                >
                  Trocar Senha
                </button>
                <button
                  className="popover-item logout"
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}

        {showPwdModal && (
          <div
            className="pwd-modal-overlay"
            onClick={() => setShowPwdModal(false)}
          >
            <div
              className="pwd-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Recuperação de Senha</h3>
              <p>Um e‑mail será enviado para:</p>
              <p className="email-destino">{userEmail}</p>
              <div className="pwd-modal-buttons">
                <button className="confirm" onClick={handleSendEmail}>
                  Disparar E‑mail
                </button>
                <button className="cancel" onClick={() => setShowPwdModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </>
  );
};

export default UserMenu;
