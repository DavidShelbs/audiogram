import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

let currentWaveSurfer = null;

export const Waveform = ({ audioUrl }) => {
    const waveformRef = useRef(null);
    const waveSurfer = useRef(null);
    const isDraggingRef = useRef(false);
    const dragStartXRef = useRef(0);
    const dragStartProgressRef = useRef(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Helper function to get clientX for mouse and touch
    const getClientX = (e) => {
        if (e.type.startsWith('touch')) {
            return e.touches[0]?.clientX ?? e.changedTouches[0]?.clientX ?? 0;
        }
        return e.clientX;
    };

    // Drag handlers
    const handleDragStart = (e) => {
        e.preventDefault();
        isDraggingRef.current = true;
        dragStartXRef.current = getClientX(e);
        dragStartProgressRef.current = waveSurfer.current.getCurrentTime() / waveSurfer.current.getDuration();
    };

    const handleDragMove = (e) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();

        const clientX = getClientX(e);
        const deltaX = clientX - dragStartXRef.current;
        const width = waveformRef.current.clientWidth;

        let newProgress = dragStartProgressRef.current + deltaX / width;
        newProgress = Math.min(Math.max(newProgress, 0), 1);

        waveSurfer.current.seekTo(newProgress);
        setIsPlaying(waveSurfer.current.isPlaying());
    };

    const handleDragEnd = (e) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();
        isDraggingRef.current = false;
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        isDraggingRef.current = true;
        // For mouse, no need to track dragStartX/delta — we'll seek directly in move
    };

    const handleMouseMove = (e) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();

        const rect = waveformRef.current.getBoundingClientRect();
        let relativeX = e.clientX - rect.left;
        relativeX = Math.min(Math.max(relativeX, 0), rect.width);

        const progress = relativeX / rect.width;
        waveSurfer.current.seekTo(progress);
        setIsPlaying(waveSurfer.current.isPlaying());
    };

    const handleMouseUp = (e) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();
        isDraggingRef.current = false;
    };

    const handleTouchStart = (e) => {
        e.preventDefault();
        isDraggingRef.current = true;
        dragStartXRef.current = getClientX(e);
        dragStartProgressRef.current = waveSurfer.current.getCurrentTime() / waveSurfer.current.getDuration();
    };

    const handleTouchMove = (e) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();

        const clientX = getClientX(e);
        const deltaX = clientX - dragStartXRef.current;
        const width = waveformRef.current.clientWidth;

        let newProgress = dragStartProgressRef.current + deltaX / width;
        newProgress = Math.min(Math.max(newProgress, 0), 1);

        waveSurfer.current.seekTo(newProgress);
        setIsPlaying(waveSurfer.current.isPlaying());
    };

    const handleTouchEnd = (e) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();
        isDraggingRef.current = false;
    };


    useEffect(() => {
        if (!audioUrl || !waveformRef.current) return;

        const controller = new AbortController();

        const initWaveSurfer = async () => {
            if (waveSurfer.current) {
                waveSurfer.current.destroy();
                waveSurfer.current = null;
            }

            const ws = WaveSurfer.create({
                container: waveformRef.current,
                // waveColor: 'rgba(102, 126, 234, 0.5)',
                // progressColor: '#764ba2',
                // cursorColor: '#764ba2',
                waveColor: '#a0c4ff',
                progressColor: '#0077b6',
                cursorColor: '#000',
                height: 100,
                responsive: true,
                normalize: true,
                backend: 'WebAudio',
            });

            waveSurfer.current = ws;

            try {
                const response = await fetch(audioUrl, { signal: controller.signal });
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                ws.load(blobUrl);

                ws.on('ready', () => setIsPlaying(false));

                ws.on('play', () => setIsPlaying(true));
                ws.on('pause', () => setIsPlaying(false));
                ws.on('finish', () => {
                    setIsPlaying(false);
                    if (currentWaveSurfer === waveSurfer.current) {
                        currentWaveSurfer = null;
                    }
                });

                ws.on('error', e => console.error('WaveSurfer error:', e));
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Audio load failed:', err);
                }
            }
        };

        initWaveSurfer();

        return () => {
            controller.abort();
            if (waveSurfer.current) {
                waveSurfer.current.destroy();
                waveSurfer.current = null;
            }
        };
    }, [audioUrl]);

    const togglePlay = () => {
        if (!waveSurfer.current) return;

        if (currentWaveSurfer && currentWaveSurfer !== waveSurfer.current) {
            currentWaveSurfer.pause();
        }

        if (waveSurfer.current.isPlaying()) {
            waveSurfer.current.pause();
            currentWaveSurfer = null;
        } else {
            waveSurfer.current.play();
            currentWaveSurfer = waveSurfer.current;
        }
    };

    return (
        <div>
            <div
                ref={waveformRef}
                style={{ cursor: 'pointer' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            />
            <button
                onClick={togglePlay}
                className={`btn ${isPlaying ? 'btn-danger' : 'btn-primary'} btn-lg rounded-pill mt-3 w-100`}
                style={{ width: '60px', height: '60px' }}
            >
                <i
                    className={`fs-1 d-flex align-items-center justify-content-center bi ${
                        isPlaying ? 'bi-stop-fill' : 'bi-play-fill'
                    }`}
                ></i>
            </button>
        </div>
    );
};
