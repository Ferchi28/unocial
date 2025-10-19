import React from 'react';
import './Sidebar.css';

function Sidebar({ activeMenu, setActiveMenu, onLogout }) {
  return (
    <aside className="sidebar">
      <h2 className="logo">Unocial</h2>
      <nav className="menu">
        <button
          className={activeMenu === "inicio" ? "active" : ""}
          onClick={() => setActiveMenu("inicio")}
        >
          Inicio
        </button>
        <button
          className={activeMenu === "perfil" ? "active" : ""}
          onClick={() => setActiveMenu("perfil")}
        >
          👤 Perfil
        </button>
        <button
          className={activeMenu === "mensajes" ? "active" : ""}
          onClick={() => setActiveMenu("mensajes")}
        >
          💬 Mensajes
        </button>
        <button
          className={activeMenu === "notificaciones" ? "active" : ""}
          onClick={() => setActiveMenu("notificaciones")}
        >
          🔔 Notificaciones
        </button>
        <button
          className={activeMenu === "config" ? "active" : ""}
          onClick={() => setActiveMenu("config")}
        >
          ⚙️ Configuración
        </button>
      </nav>

      <button className="logout-btn" onClick={onLogout}>Cerrar sesión</button>
    </aside>
  );
}

export default Sidebar;