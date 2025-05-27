import React, { useEffect, useRef } from 'react';

export const Waveform = ({ audioUrl }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const drawWaveform = async () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.offsetWidth;
            canvas.height = 100;

            const response = await fetch(audioUrl);
            const arrayBuffer = await response.arrayBuffer();

            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

            const data = audioBuffer.getChannelData(0);
            const step = Math.ceil(data.length / canvas.width);
            const amp = canvas.height / 2;

            ctx.fillStyle = '#e0e0e0';
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < canvas.width; i++) {
                let min = 1.0;
                let max = -1.0;
                for (let j = 0; j < step; j++) {
                    const datum = data[i * step + j];
                    if (datum < min) min = datum;
                    if (datum > max) max = datum;
                }
                ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
            }
        };

        drawWaveform();
    }, [audioUrl]);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100px' }} />;
};