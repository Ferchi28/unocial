import React from 'react';
import PostCard from '../PostCard/PostCard';
import './PostsList.css';

function PostsList({ posts }) {
    return (
        <div className="posts-list">
            {Array.isArray(posts) ? (
                posts.map((post) => (
                    <PostCard key={post.id_post} post={post} />
                ))
            ) : (
                <p>No hay publicaciones disponibles</p>
            )}
        </div>
    );
}

export default PostsList;