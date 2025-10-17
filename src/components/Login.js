import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías validar usuario o conectar a una API más adelante
    console.log("Login exitoso:", formData);
    navigate("/feed"); // 🔥 Esto redirige al feed
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Unocial</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-btn">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
