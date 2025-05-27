import React, { useState, useRef, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import {analytics, functions, firestore, storage} from '../../Firebase'
import { Waveform } from '../../components'

export const EventDashboard = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventId, setEventId] = useState('');
    const [playingId, setPlayingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedMessages, setSelectedMessages] = useState(new Set());
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const audioRefs = useRef({});

    useEffect(() => {
        // Get event ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const eventIdFromUrl = urlParams.get('eventId') || urlParams.get('event');
        if (eventIdFromUrl) {
            setEventId(eventIdFromUrl);
            loadMessages(eventIdFromUrl);
        } else {
            setLoading(false);
        }
    }, []);

    const loadMessages = (eventIdToLoad) => {
        if (!eventIdToLoad) return;

        setLoading(true);
        const q = query(
            collection(firestore, 'audioMessages'),
            where('eventId', '==', eventIdToLoad),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesList = [];
            querySnapshot.forEach((doc) => {
                messagesList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setMessages(messagesList);
            setLoading(false);
        }, (error) => {
            console.error('Error loading messages:', error);
            setLoading(false);
        });

        return unsubscribe;
    };

    const playAudio = (messageId) => {
        const audioToPlay = audioRefs.current[messageId];

        if (!audioToPlay) return;

        // If the same audio is playing, stop it
        if (playingId === messageId) {
            audioToPlay.pause();
            audioToPlay.currentTime = 0;
            setPlayingId(null);
            return;
        }

        // Stop all other audio
        Object.keys(audioRefs.current).forEach(id => {
            const ref = audioRefs.current[id];
            if (ref && id !== messageId) {
                ref.pause();
                ref.currentTime = 0;
            }
        });

        // Now play the new audio
        audioToPlay.play()
            .then(() => {
                setPlayingId(messageId);
            })
            .catch((err) => {
                console.error("Failed to play audio:", err);
            });
    };

    const formatTime = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown date';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    };

    const filteredMessages = messages.filter(message =>
        message.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedMessages = [...filteredMessages].sort((a, b) => {
        switch (sortBy) {
            case 'oldest':
                return (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0);
            case 'name':
                return (a.senderName || '').localeCompare(b.senderName || '');
            case 'duration':
                return (b.recordingDuration || 0) - (a.recordingDuration || 0);
            default: // newest
                return (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);
        }
    });

    const toggleSelectMessage = (messageId) => {
        const newSelected = new Set(selectedMessages);
        if (newSelected.has(messageId)) {
            newSelected.delete(messageId);
        } else {
            newSelected.add(messageId);
        }
        setSelectedMessages(newSelected);
    };

    const selectAllMessages = () => {
        if (selectedMessages.size === sortedMessages.length) {
            setSelectedMessages(new Set());
        } else {
            setSelectedMessages(new Set(sortedMessages.map(m => m.id)));
        }
    };

    const deleteSelectedMessages = async () => {
        try {
            const deletePromises = Array.from(selectedMessages).map(messageId =>
                deleteDoc(doc(firestore, 'audioMessages', messageId))
            );

            await Promise.all(deletePromises);
            setSelectedMessages(new Set());
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Error deleting messages:', error);
            alert('Failed to delete messages. Please try again.');
        }
    };

    const downloadAudio = (audioUrl, senderName, timestamp) => {
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = `${senderName}_${timestamp}_message.audio`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center"
                 style={{
                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                 }}>
                <div className="text-center text-white">
                    <div className="spinner-border mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h4>Loading Messages...</h4>
                </div>
            </div>
        );
    }

    if (!eventId) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center"
                 style={{
                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                 }}>
                <div className="container-fluid px-3">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6">
                            <div className="card shadow-lg border-0"
                                 style={{
                                     background: 'rgba(255, 255, 255, 0.95)',
                                     backdropFilter: 'blur(10px)'
                                 }}>
                                <div className="card-body p-4 text-center">
                                    <h3 className="mb-4">Enter Event ID</h3>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            placeholder="Enter your event ID"
                                            value={eventId}
                                            onChange={(e) => setEventId(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && loadMessages(eventId)}
                                        />
                                    </div>
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={() => loadMessages(eventId)}
                                        disabled={!eventId.trim()}
                                    >
                                        Load Messages
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100"
             style={{
                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                 fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
             }}>

            {/* Header */}
            <div className="container-fluid px-3 py-4">
                <div className="text-center text-white mb-4">
                    <h1 className="display-6 fw-bold mb-2"
                        style={{
                            background: 'linear-gradient(45deg, #fff, #f0f0ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                        Event Messages Dashboard
                    </h1>
                    <p className="lead opacity-75">Event: {eventId}</p>
                    <div className="badge bg-light text-dark fs-6 px-3 py-2">
                        {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
                    </div>
                </div>

                {/* Controls */}
                {messages.length > 0 && (
                    <div className="row mb-4">
                        <div className="col-12 col-md-8 col-lg-6 mx-auto">
                            <div className="card shadow border-0"
                                 style={{
                                     background: 'rgba(255, 255, 255, 0.95)',
                                     backdropFilter: 'blur(10px)'
                                 }}>
                                <div className="card-body p-3">
                                    <div className="row g-2">
                                        <div className="col-12 col-md-6">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search by name or message..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <select
                                                className="form-select"
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                            >
                                                <option value="newest">Newest First</option>
                                                <option value="oldest">Oldest First</option>
                                                <option value="name">By Name</option>
                                                <option value="duration">By Duration</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-md-2">
                                            <button
                                                className="btn btn-outline-primary w-100"
                                                onClick={selectAllMessages}
                                            >
                                                {selectedMessages.size === sortedMessages.length ? 'Deselect' : 'Select'} All
                                            </button>
                                        </div>
                                    </div>

                                    {selectedMessages.size > 0 && (
                                        <div className="mt-3 text-center">
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => setShowDeleteConfirm(true)}
                                            >
                                                <i className="bi bi-trash me-2"></i>
                                                Delete Selected ({selectedMessages.size})
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="row">
                    <div className="col-12 col-lg-10 mx-auto">
                        {sortedMessages.length === 0 ? (
                            <div className="text-center text-white">
                                <i className="bi bi-inbox display-1 opacity-50"></i>
                                <h4 className="mt-3">No Messages Yet</h4>
                                <p className="opacity-75">Messages will appear here as people send them.</p>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {sortedMessages.map((message) => (
                                    <div key={message.id} className="col-12 col-md-6 col-xl-4">
                                        <div className={`card shadow border-0 h-100 ${selectedMessages.has(message.id) ? 'border border-primary' : ''}`}
                                             style={{
                                                 background: 'rgba(255, 255, 255, 0.95)',
                                                 backdropFilter: 'blur(10px)'
                                             }}>
                                            <div className="card-body p-3">

                                                {/* Header with checkbox */}
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div className="flex-grow-1">
                                                        <h6 className="card-title mb-1 fw-bold">
                                                            <i className="bi bi-person-circle me-2"></i>
                                                            {message.senderName}
                                                        </h6>
                                                        <small className="text-muted">
                                                            <i className="bi bi-clock me-1"></i>
                                                            {formatDate(message.timestamp)}
                                                        </small>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={selectedMessages.has(message.id)}
                                                            onChange={() => toggleSelectMessage(message.id)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Audio Player */}
                                                <div className="text-center mb-3">
                                                    <button
                                                        className={`btn ${playingId === message.id ? 'btn-danger' : 'btn-primary'} btn-lg rounded-circle`}
                                                        style={{ width: '60px', height: '60px' }}
                                                        onClick={() => playAudio(message.id)}
                                                    >
                                                        <i className={`fs-1 d-flex align-items-center justify-content-center bi ${playingId === message.id ? 'bi-stop-fill' : 'bi-play-fill'}`}></i>
                                                    </button>
                                                    {/*<div className="p-4">*/}
                                                    {/*    <h1 className="text-xl font-bold mb-4">Audio Waveform</h1>*/}
                                                    {/*    <Waveform audioUrl={message.audioUrl} />*/}
                                                    {/*</div>*/}
                                                    <audio
                                                        ref={el => audioRefs.current[message.id] = el}
                                                        src={message.audioUrl}
                                                        onEnded={() => setPlayingId(null)}
                                                        onPause={() => setPlayingId(null)}
                                                        style={{ display: 'none' }}
                                                        preload="none"
                                                    />
                                                </div>

                                                {/* Written Message */}
                                                {message.message && (
                                                    <div className="mb-3">
                                                        <small className="text-muted d-block mb-1">
                                                            <i className="bi bi-chat-quote me-1"></i>Written Message:
                                                        </small>
                                                        <p className="card-text small bg-light p-2 rounded">
                                                            "{message.message}"
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-outline-primary btn-sm flex-fill"
                                                        onClick={() => downloadAudio(message.audioUrl, message.senderName, message.createdAt)}
                                                    >
                                                        <i className="bi bi-download me-1"></i>Download
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => {
                                                            setSelectedMessages(new Set([message.id]));
                                                            setShowDeleteConfirm(true);
                                                        }}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete {selectedMessages.size} selected message{selectedMessages.size > 1 ? 's' : ''}? This action cannot be undone.
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={deleteSelectedMessages}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};