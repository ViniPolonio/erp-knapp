import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './UserMenu.css';

const UserMenu = ({ userName = "Vinícius" }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverLeft, setPopoverLeft] = useState(true);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const navigate = useNavigate();
  const avatarRef = useRef(null);
  const hideTimeout = useRef(null);

  const userEmail = "teste@gmail.com";
  const firstInitial = userName.charAt(0).toUpperCase();

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout.current);
    setShowPopover(true);
    if (avatarRef.current) {
      const { right } = avatarRef.current.getBoundingClientRect();
      setPopoverLeft(right + 220 < window.innerWidth);
    }
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setShowPopover(false);
    }, 200);
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
      <div className="user-profile">
        <button
          className="user-avatar"
          ref={avatarRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {firstInitial}
        </button>

        {showPopover && (
          <div
            className={`popover ${popoverLeft ? 'left' : 'right'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
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
