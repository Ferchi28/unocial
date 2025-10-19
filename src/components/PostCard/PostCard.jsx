import React from 'react';
import './PostCard.css';

function PostCard({ post }) {
    return (
        <div key={post.id_post} className="post-card">
            <p>{post.contenido}</p>
            {post.imagen && <img src={post.imagen} alt="" className="post-image" />}
            <p className="post-date">
                Publicado {new Date(post.fecha_publicacion).toLocaleDateString("es-MX")}
            </p>
        </div>
    );
}

export default PostCard;