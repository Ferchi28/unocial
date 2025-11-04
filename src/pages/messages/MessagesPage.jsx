import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Sidebar from '../../components/Sidebar/Sidebar';
import RightPanel from '../../components/RightPanel/RightPanel';
import './messages.css';

const apiUrl = 'http://localhost:3000';

function MessagesPage({ onLogout }) {
    const { userId: targetUserId } = useParams();
    const [activeMenu, setActiveMenu] = useState("mensajes");
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState('');
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const currentUserId = localStorage.getItem('userId');
    const currentUserName = localStorage.getItem('userName');

    useEffect(() => {
        const newSocket = io(apiUrl);
        setSocket(newSocket);

        newSocket.emit('register', currentUserId);

        newSocket.on('registered', (data) => {
            console.log('Registrado en socket:', data);
        });

        newSocket.on('receive_message', (mensaje) => {
            setMessages(prev => [...prev, mensaje]);
            scrollToBottom();
        });

        newSocket.on('user_typing', (data) => {
            if (data.userId !== currentUserId) {
                setIsTyping(true);
                setTypingUser(data.userName);
            }
        });

        newSocket.on('user_stop_typing', () => {
            setIsTyping(false);
            setTypingUser('');
        });

        return () => newSocket.close();
    }, [currentUserId]);

    useEffect(() => {
        fetchConversations();
    }, [currentUserId]);

    useEffect(() => {
        if (targetUserId && currentUserId) {
            createOrGetConversation(currentUserId, targetUserId);
        }
    }, [targetUserId, currentUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/chat/conversations/${currentUserId}`);
            const data = await response.json();
            setConversations(data);
        } catch (error) {
            console.error('Error al obtener conversaciones:', error);
        }
    };

    const createOrGetConversation = async (usuario1Id, usuario2Id) => {
        try {
            const response = await fetch(`${apiUrl}/api/chat/conversation/get-or-create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario1Id, usuario2Id })
            });
            const data = await response.json();
            
            const userResponse = await fetch(`${apiUrl}/api/user/${usuario2Id}`);
            const userData = await userResponse.json();
            const user = Array.isArray(userData) ? userData[0] : userData;

            const conversationData = {
                id_conversacion: data.conversacionId,
                otro_usuario_id: usuario2Id,
                otro_usuario_nombre: user.nombre,
                otro_usuario_apellido: user.apellido_pa
            };

            selectConversation(conversationData);
            fetchConversations();
        } catch (error) {
            console.error('Error al crear conversación:', error);
        }
    };

    const selectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        
        if (socket) {
            socket.emit('join_conversation', conversation.id_conversacion);
        }

        try {
            const response = await fetch(`${apiUrl}/api/chat/messages/${conversation.id_conversacion}`);
            const data = await response.json();
            setMessages(data);

            await fetch(`${apiUrl}/api/chat/messages/read/${conversation.id_conversacion}/${currentUserId}`, {
                method: 'PUT'
            });
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        
        if (!newMessage.trim() || !selectedConversation || !socket) return;

        socket.emit('send_message', {
            conversacionId: selectedConversation.id_conversacion,
            remitenteId: currentUserId,
            contenido: newMessage.trim()
        });

        setNewMessage('');
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        socket.emit('stop_typing', {
            conversacionId: selectedConversation.id_conversacion,
            userId: currentUserId
        });
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!socket || !selectedConversation) return;

        socket.emit('typing', {
            conversacionId: selectedConversation.id_conversacion,
            userId: currentUserId,
            userName: currentUserName
        });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', {
                conversacionId: selectedConversation.id_conversacion,
                userId: currentUserId
            });
        }, 1000);
    };

    return (
        <div className="messages-page">
            <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} onLogout={onLogout} />

            <div className="messages-container">
                <div className="conversations-list">
                    <h2>Mensajes</h2>
                    {conversations.length === 0 ? (
                        <p className="no-conversations">No tienes conversaciones</p>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.id_conversacion}
                                className={`conversation-item ${selectedConversation?.id_conversacion === conv.id_conversacion ? 'active' : ''}`}
                                onClick={() => selectConversation(conv)}
                            >
                                <div className="conversation-avatar">
                                    {conv.otro_usuario_nombre?.charAt(0).toUpperCase()}
                                </div>
                                <div className="conversation-info">
                                    <div className="conversation-header">
                                        <span className="conversation-name">
                                            {conv.otro_usuario_nombre} {conv.otro_usuario_apellido}
                                        </span>
                                        {parseInt(conv.mensajes_no_leidos) > 0 && (
                                            <span className="unread-badge">{conv.mensajes_no_leidos}</span>
                                        )}
                                    </div>
                                    <p className="last-message">{conv.ultimo_mensaje || 'Sin mensajes'}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="chat-area">
                    {selectedConversation ? (
                        <>
                            <div className="chat-header">
                                <div className="chat-user-info">
                                    <div className="chat-avatar">
                                        {selectedConversation.otro_usuario_nombre?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="chat-user-name">
                                        {selectedConversation.otro_usuario_nombre} {selectedConversation.otro_usuario_apellido}
                                    </span>
                                </div>
                            </div>

                            <div className="messages-area">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id_mensaje}
                                        className={`message ${msg.id_remitente == currentUserId ? 'sent' : 'received'}`}
                                    >
                                        <div className="message-content">
                                            <p>{msg.contenido}</p>
                                            <span className="message-time">
                                                {new Date(msg.fecha_envio).toLocaleTimeString('es-MX', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                                {isTyping && (
                                    <div className="typing-indicator">
                                        <span>{typingUser} está escribiendo...</span>
                                    </div>
                                )}
                            </div>

                            <form className="message-input-area" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={handleTyping}
                                    placeholder="Escribe un mensaje..."
                                    className="message-input"
                                />
                                <button type="submit" className="send-button">
                                    Enviar
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <p>Selecciona una conversación para comenzar</p>
                        </div>
                    )}
                </div>
            </div>

            <RightPanel />
        </div>
    );
}

export default MessagesPage;