import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ activeMenu, setActiveMenu, onLogout }) {
  const navigate = useNavigate();

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    
    switch(menu) {
      case 'inicio':
        navigate('/feed');
        break;
      case 'perfil':
        const userId = localStorage.getItem('userId');
        navigate(`/profile/${userId}`);
        break;
      case 'mensajes':
        navigate('/messages');
        break;
      case 'yovendo':
        navigate('/yovendo');
        break;
      case 'comunidades':
        navigate('/comunidades');
        break;
      default:
        break;
    }
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">Unocial</h2>
      <nav className="menu">
        <button
          className={activeMenu === "inicio" ? "active" : ""}
          onClick={() => handleMenuClick("inicio")}
        >
          Inicio
        </button>
        <button
          className={activeMenu === "perfil" ? "active" : ""}
          onClick={() => handleMenuClick("perfil")}
        >
         👤 Perfil
        </button>
        <button
          className={activeMenu === "mensajes" ? "active" : ""}
          onClick={() => handleMenuClick("mensajes")}
        >
         💬 Mensajes
        </button>
        <button
          className={activeMenu === "yovendo" ? "active" : ""}
          onClick={() => handleMenuClick("yovendo")}
        >
          🛒 Yo vendo
        </button>
        <button
          className={activeMenu === "comunidades" ? "active" : ""}
          onClick={() => handleMenuClick("comunidades")}
        >
          🫂 Comunidades
        </button>
      </nav>

      <button className="logout-btn" onClick={onLogout}>Cerrar sesión</button>
    </aside>
  );
}

export default Sidebar;