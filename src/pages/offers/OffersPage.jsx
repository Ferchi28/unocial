import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import RightPanel from '../../components/RightPanel/RightPanel';
import './offers.css';

const apiUrl = 'http://localhost:3000';

function OffersPage({ username, onLogout }) {
    const [activeMenu, setActiveMenu] = useState("ofertas");
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [newOffer, setNewOffer] = useState({
        nombre: '',
        descripcion: '',
        precio: ''
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/offers');
            const data = await response.json();
            setOffers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching offers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const handleCreateOffer = async () => {
        const id_usuario = localStorage.getItem('userId');
        
        if (!id_usuario) {
            alert('Debes iniciar sesión para crear una oferta');
            return;
        }

        if (!newOffer.nombre.trim() || !newOffer.descripcion.trim() || !newOffer.precio) {
            alert('Por favor completa todos los campos');
            return;
        }

        const formData = new FormData();
        formData.append('nombre', newOffer.nombre);
        formData.append('descripcion', newOffer.descripcion);
        formData.append('precio', newOffer.precio);
        formData.append('id_usuario', id_usuario);
        
        if (selectedImage) {
            formData.append('imagen', selectedImage);
        }

        try {
            const response = await fetch('http://localhost:3000/api/offers', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al crear la oferta');
            }

            setNewOffer({ nombre: '', descripcion: '', precio: '' });
            setSelectedImage(null);
            setShowCreateModal(false);
            fetchOffers();
        } catch (error) {
            console.error('Error creating offer:', error);
            alert(error.message);
        }
    };

    if (loading) {
        return <div className="loading">Cargando ofertas...</div>;
    }

    return (
        <div className="offers-page">
            <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} onLogout={onLogout} />

            <main className="offers-main">
                <div className="offers-header">
                    <h2>Ofertas y Servicios</h2>
                    <button 
                        className="create-offer-btn"
                        onClick={() => setShowCreateModal(true)}
                    >
                        + Crear Oferta
                    </button>
                </div>

                <div className="offers-grid">
                    {offers.length === 0 ? (
                        <p className="no-offers">No hay ofertas disponibles</p>
                    ) : (
                        offers.map((offer) => (
                            <div key={offer.id_oferta} className="offer-card">
                                {offer.imagen && (
                                    <div className="offer-image-container">
                                        {offer.imagen.startsWith('/') ? (
                                            <img src={`${apiUrl}${offer.imagen}`} alt={offer.nombre} className="offer-image" />
                                        ) : (
                                            <img src={offer.imagen} alt={offer.nombre} className="offer-image" />
                                        )}
                                    </div>
                                )}
                                <div className="offer-content">
                                    <h3 className="offer-name">{offer.nombre}</h3>
                                    <p className="offer-description">{offer.descripcion}</p>
                                    <div className="offer-footer">
                                        <span className="offer-price">${parseFloat(offer.precio).toFixed(2)}</span>
                                        <button className="contact-btn">Contactar</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {showCreateModal && (
                    <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>Crear Nueva Oferta</h3>
                            <div className="create-offer-form">
                                <div className="form-group">
                                    <label>Nombre del producto/servicio</label>
                                    <input
                                        type="text"
                                        value={newOffer.nombre}
                                        onChange={(e) => setNewOffer({
                                            ...newOffer,
                                            nombre: e.target.value
                                        })}
                                        placeholder="Ej: Clases de programación"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <textarea
                                        value={newOffer.descripcion}
                                        onChange={(e) => setNewOffer({
                                            ...newOffer,
                                            descripcion: e.target.value
                                        })}
                                        placeholder="Describe tu oferta..."
                                        rows="4"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Precio</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newOffer.precio}
                                        onChange={(e) => setNewOffer({
                                            ...newOffer,
                                            precio: e.target.value
                                        })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Imagen (opcional)</label>
                                    <input
                                        type="file"
                                        id="offer-image-input"
                                        accept="image/png, image/jpeg, image/gif"
                                        onChange={handleImageSelect}
                                        className="image-input"
                                    />
                                    <label htmlFor="offer-image-input" className="image-label">
                                        {selectedImage ? `✓ ${selectedImage.name}` : 'Seleccionar imagen'}
                                    </label>
                                </div>
                                {selectedImage && (
                                    <div className="image-preview">
                                        <img src={URL.createObjectURL(selectedImage)} alt="Preview" />
                                        <button 
                                            type="button"
                                            onClick={() => setSelectedImage(null)}
                                            className="remove-image-btn"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                                <div className="modal-actions">
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setSelectedImage(null);
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="button"
                                        className="submit-btn"
                                        onClick={handleCreateOffer}
                                    >
                                        Crear Oferta
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

export default OffersPage;