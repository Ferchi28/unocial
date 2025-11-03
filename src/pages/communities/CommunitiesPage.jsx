import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import RightPanel from '../../components/RightPanel/RightPanel';
import './communities.css';

function CommunitiesPage({ username, onLogout }) {
    const [activeMenu, setActiveMenu] = useState("comunidades");
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCommunity, setNewCommunity] = useState({
        nombre: '',
        descripcion: ''
    });

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/communities');
            const data = await response.json();
            setCommunities(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching communities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCommunity = async () => {
        if (!newCommunity.nombre.trim() || !newCommunity.descripcion.trim()) {
            alert('Por favor completa todos los campos');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/communities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCommunity)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al crear la comunidad');
            }

            setNewCommunity({ nombre: '', descripcion: '' });
            setShowCreateModal(false);
            fetchCommunities();
        } catch (error) {
            console.error('Error creating community:', error);
            alert(error.message);
        }
    };

    if (loading) {
        return <div className="loading">Cargando comunidades...</div>;
    }

    return (
        <div className="communities-page">
            <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} onLogout={onLogout} />

            <main className="communities-main">
                <div className="communities-header">
                    <h2>Comunidades</h2>
                    <button 
                        className="create-community-btn"
                        onClick={() => setShowCreateModal(true)}
                    >
                        + Crear Comunidad
                    </button>
                </div>

                <div className="communities-grid">
                    {communities.length === 0 ? (
                        <p className="no-communities">No hay comunidades disponibles</p>
                    ) : (
                        communities.map((community) => (
                            <div key={community.id_comunidad} className="community-card">
                                <div className="community-icon">
                                    {community.nombre.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="community-name">{community.nombre}</h3>
                                <p className="community-description">{community.descripcion}</p>
                                <button className="join-btn">Unirse</button>
                            </div>
                        ))
                    )}
                </div>

                {showCreateModal && (
                    <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>Crear Nueva Comunidad</h3>
                            <div className="create-community-form">
                                <div className="form-group">
                                    <label>Nombre de la comunidad</label>
                                    <input
                                        type="text"
                                        value={newCommunity.nombre}
                                        onChange={(e) => setNewCommunity({
                                            ...newCommunity,
                                            nombre: e.target.value
                                        })}
                                        placeholder="Ej: Desarrolladores Web"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <textarea
                                        value={newCommunity.descripcion}
                                        onChange={(e) => setNewCommunity({
                                            ...newCommunity,
                                            descripcion: e.target.value
                                        })}
                                        placeholder="Describe de qué trata tu comunidad..."
                                        rows="4"
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={() => setShowCreateModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="button"
                                        className="submit-btn"
                                        onClick={handleCreateCommunity}
                                    >
                                        Crear Comunidad
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <RightPanel />
        </div>
    );
}

export default CommunitiesPage;