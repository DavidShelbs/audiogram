import React, { useState } from 'react';
import { useAuth } from '../../components';

export const NavBar = () => {
    const { user, loading, signIn, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar navbar-expand-lg sticky-top"
             style={{
                 background: 'rgba(255, 255, 255, 0.95)',
                 backdropFilter: 'blur(15px)',
                 borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                 boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)'
             }}>
            <div className="container-fluid px-3">
                {/* Brand */}
                <a className="navbar-brand fw-bold d-flex align-items-center" href="/"
                   style={{
                       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                       WebkitBackgroundClip: 'text',
                       WebkitTextFillColor: 'transparent',
                       backgroundClip: 'text',
                       fontSize: '1.5rem'
                   }}>
                    <i className="bi bi-mic-fill me-2"></i>
                    Audiogram
                </a>

                {/* Mobile toggle button */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    onClick={toggleMenu}
                    style={{ boxShadow: 'none' }}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation items */}
                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link fw-semibold" href="/"
                               style={{ color: '#495057' }}>
                                <i className="bi bi-house me-1"></i>
                                Home
                            </a>
                        </li>

                        {user && (
                            <li className="nav-item">
                                <a className="nav-link fw-semibold" href="/dashboard"
                                   style={{ color: '#495057' }}>
                                    <i className="bi bi-speedometer2 me-1"></i>
                                    Dashboard
                                </a>
                            </li>
                        )}

                        <li className="nav-item">
                            <a className="nav-link fw-semibold" href="/about"
                               style={{ color: '#495057' }}>
                                <i className="bi bi-info-circle me-1"></i>
                                About
                            </a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link fw-semibold" href="/help"
                               style={{ color: '#495057' }}>
                                <i className="bi bi-question-circle me-1"></i>
                                Help
                            </a>
                        </li>
                    </ul>

                    {/* Auth section */}
                    <div className="d-flex align-items-center">
                        {loading ? (
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : user ? (
                            <div className="dropdown">
                                <button
                                    className="btn btn-link text-decoration-none dropdown-toggle d-flex align-items-center"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    style={{
                                        border: 'none',
                                        boxShadow: 'none',
                                        color: '#495057'
                                    }}
                                >
                                    {user.photoURL && (
                                        <img
                                            src={user.photoURL}
                                            alt="Profile"
                                            className="rounded-circle me-2"
                                            style={{ width: '32px', height: '32px' }}
                                        />
                                    )}
                                    <span className="fw-semibold">
                                        {user.displayName || user.email?.split('@')[0]}
                                    </span>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.98)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '12px'
                                    }}>
                                    <li>
                                        <a className="dropdown-item d-flex align-items-center" href="/dashboard">
                                            <i className="bi bi-speedometer2 me-2"></i>
                                            Dashboard
                                        </a>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button
                                            className="dropdown-item d-flex align-items-center text-danger"
                                            onClick={signOut}
                                        >
                                            <i className="bi bi-box-arrow-right me-2"></i>
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={signIn}
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    borderRadius: '20px',
                                    fontWeight: '600',
                                    padding: '8px 20px'
                                }}
                            >
                                <i className="bi bi-google me-2"></i>
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};