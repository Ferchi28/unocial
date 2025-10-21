import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import RightPanel from "../../components/RightPanel/RightPanel";
import PostCard from "../../components/PostCard/PostCard";
import './post.css';

function PostPage({ username, onLogout }) {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    // new state for new comment
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                // Fetch post data
                const postResponse = await fetch(`http://localhost:3000/api/post/${id}`);
                if (!postResponse.ok) throw new Error(`Failed to fetch post: ${postResponse.status}`);
                const postData = await postResponse.json();
                const postObj = Array.isArray(postData) ? postData[0] : postData;
                setPost(postObj || null);
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };

        const fetchComments = async () => {
            try {
                const commentsResponse = await fetch(`http://localhost:3000/api/comments/post/${id}`);
                if (!commentsResponse.ok) throw new Error(`Failed to fetch comments: ${commentsResponse.status}`);
                const commentsData = await commentsResponse.json();
                setComments(Array.isArray(commentsData) ? commentsData : []);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        const fetchAll = async () => {
            setLoading(true);
            await Promise.all([fetchPostData(), fetchComments()]);
            setLoading(false);
        };

        fetchAll();
    }, [id]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const id_usuario = localStorage.getItem('userId'); // make sure frontend sets this on login
        if (!id_usuario) {
            alert('You must be logged in to post a comment.');
            return;
        }
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch('http://localhost:3000/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contenido: newComment.trim(), id_usuario, id_post: id })
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `Failed to post comment: ${res.status}`);
            }
            // Clear input and refresh comments
            setNewComment('');
            // Re-fetch comments
            const commentsResponse = await fetch(`http://localhost:3000/api/comments/post/${id}`);
            if (commentsResponse.ok) {
                const commentsData = await commentsResponse.json();
                setComments(Array.isArray(commentsData) ? commentsData : []);
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!post) {
        return <div>Post not found</div>;
    }
    return (
        <div className="page post-page">
            <Sidebar activeMenu="inicio" setActiveMenu={() => { }} onLogout={onLogout} />
            <div className="post-container">
                <div className="post-content">
                    <PostCard post={post} />
                </div>
                <div className="comments-section">
                    <h2 className="section-title">Comentarios</h2>

                    {/* New comment form with updated styling */}
                    <form className="comment-form" onSubmit={handleSubmitComment}>
                        <textarea
                            className="comment-input"
                            placeholder="¿Qué opinas?"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={3}
                        />
                        <button 
                            className="comment-submit"
                            type="submit" 
                            disabled={submitting || !newComment.trim()}
                        >
                            {submitting ? 'Enviando...' : 'Comentar'}
                        </button>
                    </form>

                    <div className="comments-list">
                        {comments.length === 0 ? (
                            <p className="no-comments">No hay comentarios aún</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id_comentario} className="comment-card">
                                    <a href={`/profile/${comment.id_usuario}`} className="comment-author">
                                        {`${comment.nombre} ${comment.apellido_pa} ${comment.apellido_ma}`}
                                    </a>
                                    <p className="comment-content">{comment.contenido}</p>
                                    <span className="comment-date">
                                        {new Date(comment.fecha_comentario).toLocaleDateString("es-MX", {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <RightPanel />
        </div>
    );
}

export default PostPage;