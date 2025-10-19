import React from 'react';

function Header({ username, onLogout }) {
  return (
    <header className="header">
      <h1>Unocial</h1>
      <div className="header-right">
        <span>Hola, {username}</span>
        <button className="gradient-button" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </header>
  );
}

export default Header;
