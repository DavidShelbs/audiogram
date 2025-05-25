import React, { useState, useRef, useEffect } from 'react';

export const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [senderName, setSenderName] = useState('');
    const [message, setMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        // Check browser compatibility
        const checkSupport = () => {
            const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
            const hasMediaRecorder = !!window.MediaRecorder;
            const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';

            if (!hasGetUserMedia || !hasMediaRecorder || !isSecure) {
                setIsSupported(false);
            }
        };

        checkSupport();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startRecording = async () => {
        try {
            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert('Audio recording is not supported in this browser. Please try Chrome, Firefox, or Safari on iOS 14.3+');
                return;
            }

            // Check if we're on HTTPS (required for Safari)
            if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
                alert('Audio recording requires a secure connection (HTTPS). Please access this page via HTTPS.');
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Check MediaRecorder support
            if (!window.MediaRecorder) {
                alert('Audio recording is not supported in this browser version. Please update your browser or try a different one.');
                stream.getTracks().forEach(track => track.stop());
                return;
            }

            // Safari-specific MediaRecorder options
            let options = {};
            if (MediaRecorder.isTypeSupported('audio/mp4')) {
                options = { mimeType: 'audio/mp4' };
            } else if (MediaRecorder.isTypeSupported('audio/webm')) {
                options = { mimeType: 'audio/webm' };
            } else if (MediaRecorder.isTypeSupported('audio/wav')) {
                options = { mimeType: 'audio/wav' };
            }

            mediaRecorderRef.current = new MediaRecorder(stream, options);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const mimeType = mediaRecorderRef.current.mimeType || 'audio/wav';
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.onerror = (event) => {
                console.error('MediaRecorder error:', event);
                alert('Recording error occurred. Please try again.');
                stream.getTracks().forEach(track => track.stop());
                setIsRecording(false);
                clearInterval(timerRef.current);
            };

            mediaRecorderRef.current.start(1000); // Collect data every second for better Safari compatibility
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (error) {
            console.error('Recording error:', error);
            if (error.name === 'NotAllowedError') {
                alert('Microphone access was denied. Please allow microphone access and try again.');
            } else if (error.name === 'NotFoundError') {
                alert('No microphone found. Please check your device and try again.');
            } else if (error.name === 'NotSupportedError') {
                alert('Audio recording is not supported in this browser.');
            } else {
                alert('Unable to access microphone. Please check your browser settings and try again.');
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const playAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const sendRecording = () => {
        if (!senderName.trim()) {
            alert('Please enter your name');
            return;
        }
        if (!audioURL) {
            alert('Please record a message first');
            return;
        }

        // Here you would typically send the audio to your backend
        setShowSuccess(true);
        setTimeout(() => {
            // Reset form
            setAudioURL('');
            setSenderName('');
            setMessage('');
            setRecordingTime(0);
            setShowSuccess(false);
        }, 3000);
    };

    const resetRecording = () => {
        setAudioURL('');
        setRecordingTime(0);
        setIsPlaying(false);
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center"
             style={{
                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                 fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
             }}>
            <div className="container-fluid px-3">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-8 col-md-6 col-lg-4">

                        {/* Header */}
                        <div className="text-center text-white mb-5">
                            <h1 className="display-5 fw-bold mb-3"
                                style={{
                                    background: 'linear-gradient(45deg, #fff, #f0f0ff)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                Share Your Voice
                            </h1>
                            <p className="lead opacity-75">
                                Record a special message for this memorable occasion
                            </p>
                        </div>

                        {/* Browser Compatibility Warning */}
                        {!isSupported && (
                            <div className="alert alert-warning mb-4" role="alert">
                                <h6 className="alert-heading">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    Browser Compatibility Notice
                                </h6>
                                <p className="mb-2">Audio recording requires:</p>
                                <ul className="mb-2">
                                    <li>A secure connection (HTTPS)</li>
                                    <li>Modern browser (Chrome, Firefox, Safari 14.3+)</li>
                                    <li>Microphone permissions</li>
                                </ul>
                                <small>If you're having issues, try accessing this page via HTTPS or use a different browser.</small>
                            </div>
                        )}

                        {/* Success Message */}
                        {showSuccess && (
                            <div className="alert alert-success text-center mb-4" role="alert">
                                <i className="bi bi-check-circle-fill me-2"></i>
                                Your message has been sent! Thank you for sharing.
                            </div>
                        )}

                        {/* Recording Section */}
                        <div className="card shadow-lg border-0 mb-4"
                             style={{
                                 background: 'rgba(255, 255, 255, 0.95)',
                                 backdropFilter: 'blur(10px)'
                             }}>
                            <div className="card-body p-4">

                                {/* Record Button */}
                                <div className="text-center mb-4">
                                    <button
                                        className={`btn btn-lg rounded-circle d-flex align-items-center justify-content-center mx-auto ${
                                            isRecording
                                                ? 'btn-danger'
                                                : audioURL
                                                    ? 'btn-success'
                                                    : 'btn-primary'
                                        }`}
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            boxShadow: isRecording
                                                ? '0 0 30px rgba(220, 53, 69, 0.5)'
                                                : '0 8px 25px rgba(0, 0, 0, 0.15)',
                                            animation: isRecording ? 'pulse 1.5s infinite' : 'none'
                                        }}
                                        onClick={isRecording ? stopRecording : audioURL ? resetRecording : startRecording}
                                    >
                                        <div className="text-center">
                                            {isRecording ? (
                                                <>
                                                    <i className="bi bi-stop-fill d-block mb-1" style={{ fontSize: '2rem' }}></i>
                                                    <small>Stop</small>
                                                </>
                                            ) : audioURL ? (
                                                <>
                                                    <i className="bi bi-arrow-clockwise d-block mb-1" style={{ fontSize: '2rem' }}></i>
                                                    <small>Re-record</small>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-mic-fill d-block mb-1" style={{ fontSize: '2rem' }}></i>
                                                    <small>Record</small>
                                                </>
                                            )}
                                        </div>
                                    </button>

                                    {/* Timer */}
                                    {(isRecording || audioURL) && (
                                        <div className="mt-3">
                      <span className="badge bg-secondary fs-6 px-3 py-2">
                        <i className="bi bi-clock me-1"></i>
                          {formatTime(recordingTime)}
                      </span>
                                        </div>
                                    )}
                                </div>

                                {/* Audio Playback */}
                                {audioURL && (
                                    <div className="text-center mb-4">
                                        <button
                                            className="btn btn-outline-primary btn-lg"
                                            onClick={playAudio}
                                        >
                                            <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'} me-2`}></i>
                                            {isPlaying ? 'Pause' : 'Play'} Recording
                                        </button>
                                        <audio
                                            ref={audioRef}
                                            src={audioURL}
                                            onEnded={() => setIsPlaying(false)}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                )}

                                {/* Form Fields */}
                                <div className="mb-3">
                                    <label htmlFor="senderName" className="form-label fw-semibold">
                                        <i className="bi bi-person me-2"></i>Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        id="senderName"
                                        placeholder="Enter your name"
                                        value={senderName}
                                        onChange={(e) => setSenderName(e.target.value)}
                                        style={{
                                            border: '2px solid #e9ecef',
                                            borderRadius: '12px'
                                        }}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="message" className="form-label fw-semibold">
                                        <i className="bi bi-chat-heart me-2"></i>Written Message (Optional)
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        rows="3"
                                        placeholder="Add a written note to go with your recording..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        style={{
                                            border: '2px solid #e9ecef',
                                            borderRadius: '12px'
                                        }}
                                    ></textarea>
                                </div>

                                {/* Send Button */}
                                <button
                                    className="btn btn-primary btn-lg w-100 py-3"
                                    onClick={sendRecording}
                                    disabled={!audioURL || !senderName.trim()}
                                    style={{
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    <i className="bi bi-send me-2"></i>
                                    Send Your Message
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-white-50">
                            <small>
                                <i className="bi bi-heart-fill me-1"></i>
                                Your message will make this day even more special
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .btn:focus {
          box-shadow: none !important;
        }
        
        .form-control:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
        }
        
        @media (max-width: 576px) {
          .display-5 {
            font-size: 2rem !important;
          }
        }
      `}</style>
        </div>
    );
};