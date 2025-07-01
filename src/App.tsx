import React, { useState, useEffect } from 'react';
import { GameState, RoleInfo, Status } from './types';
import SetupScreen from './components/SetupScreen';
import RevealScreen from './components/RevealScreen';
import { socket } from './services/socketService';
import Lobby from './components/Lobby';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
    const [myRoleInfo, setMyRoleInfo] = useState<RoleInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // --- Socket Listeners ---
        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);
            setMyPlayerId(socket.id);
        });

        socket.on('gameStateUpdate', (newGameState: GameState) => {
            setGameState(newGameState);
            setError(null);
        });

        socket.on('roleInfo', (roleInfo: RoleInfo) => {
            setMyRoleInfo(roleInfo);
        });
        
        socket.on('gameError', (errorMessage: string) => {
            setError(errorMessage);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server.');
            setGameState(null); // Clear state on disconnect
        });
        
        // --- Cleanup ---
        return () => {
            socket.off('connect');
            socket.off('gameStateUpdate');
            socket.off('roleInfo');
            socket.off('gameError');
            socket.off('disconnect');
        };
    }, []);

    const hasJoined = gameState?.players.some(p => p.id === myPlayerId);

    const renderContent = () => {
        if (!gameState) {
            return <div className="text-center text-gray-400">Verbinde mit Server...</div>;
        }

        if (!hasJoined) {
            return <Lobby />;
        }

        if (gameState.status === Status.SETUP) {
            return (
                <SetupScreen
                    gameState={gameState}
                    myPlayerId={myPlayerId}
                    error={error}
                />
            );
        }

        if (gameState.status === Status.REVEALED) {
            return (
                <RevealScreen
                    gameState={gameState}
                    myRoleInfo={myRoleInfo}
                    myPlayerId={myPlayerId}
                />
            );
        }
        
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 selection:bg-cyan-500 selection:text-cyan-900">
            <div className="w-full max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-500">
                        Word Imposter
                    </h1>
                     <p className="text-gray-400 mt-2">
                        {gameState ? `Spiel-Lobby (${gameState.players.length} Spieler)` : 'Ein Echtzeit-Multiplayer-Spiel'}
                    </p>
                </header>
                
                <main className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 md:p-8 min-h-[400px] flex items-center justify-center">
                    {renderContent()}
                </main>

                 <footer className="text-center mt-8 text-gray-500 text-sm">
                    <p>Entwickelt für geheime Missionen und lustige Spieleabende.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
