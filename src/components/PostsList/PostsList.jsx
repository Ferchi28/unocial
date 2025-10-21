import React from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../PostCard/PostCard';
import './PostsList.css';

function PostsList({ posts }) {
    return (
        <div className="posts-list">
            {Array.isArray(posts) ? (
                posts.map((post) => (
                    <Link 
                        key={post.id_post}
                        to={`/post/${post.id_post}`}
                        className="post-link"
                    >
                        <PostCard post={post} />
                    </Link>
                ))
            ) : (
                <p>No hay publicaciones disponibles</p>
            )}
        </div>
    );
}

export default PostsList;