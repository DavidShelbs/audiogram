const EventCard = ({ event, onSelect, formatDate }) => (
    <div className="col-12 col-md-6 col-xl-4">
        <div className="card shadow border-0 h-100 event-card"
             style={{
                 background: 'rgba(255, 255, 255, 0.95)',
                 backdropFilter: 'blur(10px)',
                 cursor: 'pointer',
                 transition: 'transform 0.2s ease-in-out'
             }}
             onClick={onSelect}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                        <h5 className="card-title mb-2 fw-bold text-primary">
                            <i className="bi bi-calendar-event me-2"></i>
                            {event.eventName}
                        </h5>
                        <small className="text-muted">
                            <i className="bi bi-clock me-1"></i>
                            Created: {formatDate(event.createdAt)}
                        </small>
                    </div>
                    <i className="bi bi-arrow-right-circle text-primary fs-4"></i>
                </div>

                {event.description && (
                    <p className="card-text text-muted mb-3">
                        {event.description}
                    </p>
                )}

                <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-primary">
                        ID: {event.id.slice(0, 8)}...
                    </span>
                    <small className="text-muted">
                        <i className="bi bi-people me-1"></i>
                        Click to view messages
                    </small>
                </div>
            </div>
        </div>
    </div>
);