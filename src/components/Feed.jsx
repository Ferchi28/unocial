import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import RightPanel from "./RightPanel/RightPanel";
import "./Feed.css";

const apiUrl = 'http://localhost:3000';

function Feed() {
  const [activeMenu, setActiveMenu] = useState("inicio");
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/post');
      const data = await response.json();
      setPosts(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleCreatePost = async () => {
    const id_usuario = localStorage.getItem('userId');
    if (!id_usuario) {
        alert('Debes iniciar sesión para publicar');
        return;
    }

    const formData = new FormData();
    formData.append('contenido', newPost);
    formData.append('id_usuario', id_usuario);
    if (selectedImage) {
        formData.append('imagen', selectedImage);
    }

    try {
        const response = await fetch('http://localhost:3000/api/post', {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al crear la publicación');
        }

        setNewPost("");
        setSelectedImage(null);
        fetchPosts();
    } catch (error) {
        console.error('Error creating post:', error);
        alert(error.message);
    }
  };

  return (
    <div className="feed-layout">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} onLogout={() => {}} />

      {/* ---------- FEED PRINCIPAL ---------- */}
      <main className="main-feed">
        <h2>Inicio</h2>

        <div className="create-post">
          <textarea 
            placeholder="¿Qué estás pensando hoy? 💭"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="post-actions">
            <input
              type="file"
              id="image-input"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleImageSelect}
              className="image-input"
            />
            <label htmlFor="image-input" className="post-btn">
              {selectedImage ? '✓ Imagen seleccionada' : 'Agregar imagen'}
            </label>
            <button className="post-btn" onClick={handleCreatePost}>Publicar</button>
          </div>
          {selectedImage && (
            <div className="image-preview">
              <img src={URL.createObjectURL(selectedImage)} alt="Preview" />
              <button onClick={() => setSelectedImage(null)}>×</button>
            </div>
          )}
        </div>

        {posts.map((post) => (
          <Link 
            key={post.id_post}
            to={`/post/${post.id_post}`}
            className="post-link"
          >
            <div className="post-card">
              <a className="user-link" onClick={e => e.stopPropagation()} href={`/profile/${post.id_usuario}`}>
                {post.nombre + ' ' + post.apellido_pa}
              </a>
              <p>{post.contenido}</p>
              {post.imagen && post.imagen.startsWith('/') ? <img src={`${apiUrl}${post.imagen}`} alt="" className="post-image" /> : <img src={post.imagen} alt="" className="post-image" />}
              <p className="post-date">
                Publicado {new Date(post.fecha_publicacion).toLocaleDateString("es-MX")}
              </p>
            </div>
          </Link>
        ))}
      </main>

      <RightPanel />
    </div>
  );
}

export default Feed;
