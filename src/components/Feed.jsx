import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import RightPanel from "./RightPanel/RightPanel";
import "./Feed.css";

function Feed() {
  const [activeMenu, setActiveMenu] = useState("inicio");
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  
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

  const handleCreatePost = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newPost,
          // Add user information when auth is implemented
        }),
      });
      
      if (response.ok) {
        setNewPost("");
        fetchPosts(); // Refresh posts after creating new one
      }
    } catch (error) {
      console.error('Error creating post:', error);
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
          <button className="post-btn" onClick={handleCreatePost}>Publicar</button>
        </div>

        {posts.map((post) => (
          <div key={post.id_post} className="post-card">
            <a className="user-link" href={`/profile/${post.id_usuario}`}>{post.nombre + ' ' + post.apellido_pa}</a>
            <p>{post.contenido}</p>
              <img src={post.imagen} alt='' className="post-image" />
            <p className="post-date">Publicado {new Date(post.fecha_publicacion).toLocaleDateString("es-MX")}</p>
          </div>
        ))}
      </main>

      <RightPanel />
    </div>
  );
}

export default Feed;
