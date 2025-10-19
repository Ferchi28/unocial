import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import RightPanel from '../../components/RightPanel/RightPanel';
import PostsList from '../../components/PostsList/PostsList';
import './profile.css';

function ProfilePage({ username, onLogout }) {
    const { id } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user profile data
                const profileResponse = await fetch(`http://localhost:3000/api/user/${id}`);
                const profileData = await profileResponse.json();
                setUserProfile(profileData[0]);

                // Fetch user posts (you'll need to create this endpoint)
                const postsResponse = await fetch(`http://localhost:3000/api/post/user/${id}`);
                const postsData = await postsResponse.json();
                setUserPosts(postsData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userProfile) {
        return <div>User not found</div>;
    }

    return (
        <div className="page profile-page">
            <Sidebar activeMenu="perfil" setActiveMenu={() => {}} onLogout={onLogout} />
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-info">
                        <h1>{`${userProfile.nombre} ${userProfile.apellido_pa} ${userProfile.apellido_ma}`}</h1>
                        <p className="user-faculty">{userProfile.nombre_facultad}</p>
                        <p className="user-career">{userProfile.nombre_carrera}</p>
                        <p className="join-date">Miembro desde: {new Date(userProfile.fecha_registro).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="profile-content">
                    <h2>Publicaciones</h2>
                    <PostsList posts={userPosts} />
                </div>
            </div>
            <RightPanel />
        </div>
    );
}

export default ProfilePage;