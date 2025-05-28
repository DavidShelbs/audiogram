import { createContext, useContext, useState } from 'react';

const WaveformContext = createContext();

export const WaveformProvider = ({ children }) => {
    const [currentPlayer, setCurrentPlayer] = useState(null);

    const registerAndPlay = (player) => {
        if (currentPlayer && currentPlayer !== player) {
            currentPlayer.stop();
        }
        setCurrentPlayer(player);
        player.play();
    };

    const stopCurrent = () => {
        if (currentPlayer) {
            currentPlayer.stop();
            setCurrentPlayer(null);
        }
    };

    return (
        <WaveformContext.Provider value={{ registerAndPlay, stopCurrent }}>
            {children}
        </WaveformContext.Provider>
    );
};

export const useWaveformControl = () => useContext(WaveformContext);