import React from 'react';
import './PostCard.css';
import { formatDate } from '../../lib/dateParser';
const apiUrl = 'http://localhost:3000';
function PostCard({ post }) {
    return (
        <div className="post-card">
            <p>{post.contenido}</p>
            {post.imagen && post.imagen.startsWith('/') ? <img src={`${apiUrl}${post.imagen}`} alt="" className="post-image" /> : <img src={post.imagen} alt="" className="post-image" />}
            <p className="post-date">
                Publicado {formatDate(post.fecha_publicacion)}
            </p>
        </div>
    );
}

export default PostCard;