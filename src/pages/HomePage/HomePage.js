import React, { useState } from 'react';

export const HomePage = () => {
    const [eventId, setEventId] = useState('');
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [newEventName, setNewEventName] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    const [createdEventUrl, setCreatedEventUrl] = useState('');

    const handleJoinEvent = () => {
        if (!eventId.trim()) {
            alert('Please enter an event ID');
            return;
        }
        // Redirect to audio recorder with event ID
        const audioRecorderUrl = `/audio-recorder?eventId=${encodeURIComponent(eventId.trim())}`;
        window.open(audioRecorderUrl, '_blank');
    };

    const handleCreateEvent = () => {
        if (!newEventName.trim()) {
            alert('Please enter an event name');
            return;
        }

        // Generate a simple event ID (in real app, this would come from your backend)
        const generatedEventId = newEventName.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-6);

        const eventUrl = `${window.location.origin}/audio-recorder?eventId=${encodeURIComponent(generatedEventId)}`;
        setCreatedEventUrl(eventUrl);

        // Reset form
        setNewEventName('');
        setNewEventDescription('');
        setShowCreateEvent(false);
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                alert('Link copied to clipboard!');
            } catch (err) {
                alert('Unable to copy to clipboard. Please copy the link manually.');
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center"
             style={{
                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                 fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
             }}>
            <div className="container-fluid px-3">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6">

                        {/* Header */}
                        <div className="text-center text-white mb-5">
                            <div className="mb-4">
                                <i className="bi bi-mic-fill display-1 mb-3"
                                   style={{
                                       background: 'linear-gradient(45deg, #fff, #f0f0ff)',
                                       WebkitBackgroundClip: 'text',
                                       WebkitTextFillColor: 'transparent',
                                       backgroundClip: 'text'
                                   }}></i>
                            </div>
                            <h1 className="display-4 fw-bold mb-3"
                                style={{
                                    background: 'linear-gradient(45deg, #fff, #f0f0ff)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                Audiogram
                            </h1>
                            <p className="lead opacity-75">
                                Create memorable moments with personal audio messages for your special events
                            </p>
                        </div>

                        {/* Main Action Cards */}
                        <div className="row g-4 mb-5">
                            {/* Join Event Card */}
                            <div className="col-md-6">
                                <div className="card shadow-lg border-0 h-100"
                                     style={{
                                         background: 'rgba(255, 255, 255, 0.95)',
                                         backdropFilter: 'blur(10px)'
                                     }}>
                                    <div className="card-body p-4 text-center">
                                        <i className="bi bi-calendar-heart display-4 text-primary mb-3"></i>
                                        <h4 className="card-title mb-3">Join an Event</h4>
                                        <p className="card-text mb-4 text-muted">
                                            Have an event ID or invitation link? Enter it here to share your voice message.
                                        </p>

                                        <div className="mb-3">
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="Enter Event ID"
                                                value={eventId}
                                                onChange={(e) => setEventId(e.target.value)}
                                                style={{
                                                    border: '2px solid #e9ecef',
                                                    borderRadius: '12px'
                                                }}
                                                onKeyPress={(e) => e.key === 'Enter' && handleJoinEvent()}
                                            />
                                        </div>

                                        <button
                                            className="btn btn-primary btn-lg w-100"
                                            onClick={handleJoinEvent}
                                            style={{
                                                borderRadius: '12px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            <i className="bi bi-arrow-right-circle me-2"></i>
                                            Join Event
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Create Event Card */}
                            <div className="col-md-6">
                                <div className="card shadow-lg border-0 h-100"
                                     style={{
                                         background: 'rgba(255, 255, 255, 0.95)',
                                         backdropFilter: 'blur(10px)'
                                     }}>
                                    <div className="card-body p-4 text-center">
                                        <i className="bi bi-plus-circle display-4 text-success mb-3"></i>
                                        <h4 className="card-title mb-3">Create New Event</h4>
                                        <p className="card-text mb-4 text-muted">
                                            Start collecting voice messages for your wedding, birthday, or special occasion.
                                        </p>

                                        <button
                                            className="btn btn-success btn-lg w-100"
                                            onClick={() => setShowCreateEvent(true)}
                                            style={{
                                                borderRadius: '12px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            <i className="bi bi-plus-lg me-2"></i>
                                            Create Event
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features Section */}
                        <div className="card shadow-lg border-0 mb-4"
                             style={{
                                 background: 'rgba(255, 255, 255, 0.95)',
                                 backdropFilter: 'blur(10px)'
                             }}>
                            <div className="card-body p-4">
                                <h5 className="card-title text-center mb-4">
                                    <i className="bi bi-stars me-2"></i>
                                    Why Choose Voice Messages?
                                </h5>

                                <div className="row g-3">
                                    <div className="col-md-4 text-center">
                                        <i className="bi bi-heart-fill text-danger mb-2" style={{ fontSize: '2rem' }}></i>
                                        <h6>Personal Touch</h6>
                                        <small className="text-muted">
                                            Capture emotions that text simply can't convey
                                        </small>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <i className="bi bi-cloud-check text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                                        <h6>Safely Stored</h6>
                                        <small className="text-muted">
                                            All messages are securely saved and easily accessible
                                        </small>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <i className="bi bi-share text-success mb-2" style={{ fontSize: '2rem' }}></i>
                                        <h6>Easy Sharing</h6>
                                        <small className="text-muted">
                                            Share via QR codes or simple links
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-white-50">
                            <small>
                                <i className="bi bi-mic me-1"></i>
                                Making every voice heard, every moment memorable
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Event Modal */}
            {showCreateEvent && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content"
                             style={{
                                 background: 'rgba(255, 255, 255, 0.98)',
                                 backdropFilter: 'blur(10px)',
                                 border: 'none',
                                 borderRadius: '20px'
                             }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title">
                                    <i className="bi bi-calendar-plus me-2"></i>
                                    Create New Event
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowCreateEvent(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-tag me-2"></i>Event Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="e.g., Sarah & John's Wedding"
                                        value={newEventName}
                                        onChange={(e) => setNewEventName(e.target.value)}
                                        style={{
                                            border: '2px solid #e9ecef',
                                            borderRadius: '12px'
                                        }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-chat-text me-2"></i>Description (Optional)
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Tell people what this event is about..."
                                        value={newEventDescription}
                                        onChange={(e) => setNewEventDescription(e.target.value)}
                                        style={{
                                            border: '2px solid #e9ecef',
                                            borderRadius: '12px'
                                        }}
                                    ></textarea>
                                </div>
                                <button
                                    className="btn btn-success btn-lg w-100"
                                    onClick={handleCreateEvent}
                                    style={{
                                        borderRadius: '12px',
                                        fontWeight: '600'
                                    }}
                                >
                                    <i className="bi bi-check-lg me-2"></i>
                                    Create Event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Created Event Success Modal */}
            {createdEventUrl && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content"
                             style={{
                                 background: 'rgba(255, 255, 255, 0.98)',
                                 backdropFilter: 'blur(10px)',
                                 border: 'none',
                                 borderRadius: '20px'
                             }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title text-success">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    Event Created Successfully!
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setCreatedEventUrl('')}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p className="mb-3">
                                    Your event has been created! Share this link with your guests so they can leave voice messages:
                                </p>

                                <div className="bg-light p-3 rounded-3 mb-3">
                                    <small className="font-monospace text-break">{createdEventUrl}</small>
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={() => copyToClipboard(createdEventUrl)}
                                        style={{
                                            borderRadius: '12px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        <i className="bi bi-clipboard me-2"></i>
                                        Copy Link
                                    </button>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => window.open(createdEventUrl, '_blank')}
                                        style={{
                                            borderRadius: '12px'
                                        }}
                                    >
                                        <i className="bi bi-arrow-up-right-square me-2"></i>
                                        Test Event Page
                                    </button>
                                </div>

                                <div className="alert alert-info mt-3" role="alert">
                                    <small>
                                        <i className="bi bi-info-circle me-1"></i>
                                        <strong>Tip:</strong> You can also create QR codes from this link to make it easy for guests to access on their phones.
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .btn:focus {
                    box-shadow: none !important;
                }
                
                .form-control:focus {
                    border-color: #667eea !important;
                    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
                }
                
                .card {
                    transition: transform 0.2s ease-in-out;
                }
                
                .card:hover {
                    transform: translateY(-5px);
                }
                
                @media (max-width: 576px) {
                    .display-4 {
                        font-size: 2.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};