import React, { useState } from "react";
import "./Feed.css";

function Feed() {
  const [activeMenu, setActiveMenu] = useState("inicio");

  const posts = [
    { id: 1, user: "María Hernandez", content: "Mi primer post en Unocial ", image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/250px-Logo_of_Twitter.svg.png' },
    { id: 2, user: "Reyli vincent", content: "Amo el diseño oscuro de esta red 😎" },
    { id: 3, user: "Luna carbajal", content: "¡Hola comunidad Unocial!" },
  ];
  let posts1;
  fetch('http://10.33.24.170:3000/api/post')
  .then(response => response.json())
  .then(data => {
    posts1 = data;
    console.log(posts);
  }).catch(error => console.error('Error:', error));

  return (
    <div className="feed-layout">
      {/* ---------- SIDEBAR ---------- */}
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

        <button className="logout-btn">Cerrar sesión</button>
      </aside>

      {/* ---------- FEED PRINCIPAL ---------- */}
      <main className="main-feed">
        <h2>Inicio</h2>

        <div className="create-post">
          <textarea placeholder="¿Qué estás pensando hoy? 💭" />
          <button className="post-btn">Publicar</button>
        </div>

        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <strong>{post.user}</strong>
            <p>{post.content}</p>
            <img src={}>
          </div>
        ))}
      </main>

      {/* ---------- PANEL DERECHO ---------- */}
      <aside className="right-panel">
        <h3>Tendencias 🔥</h3>
        <ul>
          <li>#UnocialLovers</li>
          <li>#ModoOscuro</li>
          <li>#ReactVibes</li>
        </ul>

        <h3>Sugerencias </h3>
        <ul>
          <li>@sofia_dev</li>
          <li>@arturo_ui</li>
          <li>@diana_js</li>
        </ul>
      </aside>
    </div>
  );
}

export default Feed;
