import React, { useState, useCallback } from 'react';
import { GameState, Player, Role, Status } from './types';
import SetupScreen from './components/SetupScreen';
import RevealScreen from './components/RevealScreen';
import { generateWordAndHint } from './services/geminiService';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        players: [],
        secretWord: '',
        hint: '',
        imposterId: null,
        status: Status.SETUP,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdatePlayers = (players: Player[]) => {
        setGameState(prev => ({ ...prev, players }));
    };

    const handleAddPlayer = (name: string) => {
        if (name.trim() === '') return;
        const newPlayer: Player = { id: `player-${Date.now()}`, name: name.trim(), role: null };
        handleUpdatePlayers([...gameState.players, newPlayer]);
    };

    const handleRemovePlayer = (id: string) => {
        handleUpdatePlayers(gameState.players.filter(p => p.id !== id));
    };

    const handleStartGame = async () => {
        if (gameState.players.length < 3) {
            setError("Es werden mindestens 3 Spieler benötigt, um das Spiel zu starten.");
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            // This now calls our own secure backend endpoint
            const { secretWord, hint } = await generateWordAndHint();

            const players = [...gameState.players];
            // Shuffle players to pick a random imposter
            for (let i = players.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [players[i], players[j]] = [players[j], players[i]];
            }
            
            const imposter = players[0];
            const updatedPlayers = gameState.players.map(p => {
                if (p.id === imposter.id) {
                    return { ...p, role: Role.IMPOSTER };
                }
                return { ...p, role: Role.REGULAR };
            });

            setGameState(prev => ({
                ...prev,
                players: updatedPlayers,
                imposterId: imposter.id,
                secretWord,
                hint,
                status: Status.REVEALED,
            }));
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'Ein unbekannter Fehler ist aufgetreten.';
            setError(`Fehler beim Starten des Spiels: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetGame = () => {
        setGameState({
            players: [],
            secretWord: '',
            hint: '',
            imposterId: null,
            status: Status.SETUP,
        });
        setError(null);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 selection:bg-cyan-500 selection:text-cyan-900">
            <div className="w-full max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-500">
                        Word Imposter
                    </h1>
                    <p className="text-gray-400 mt-2">Die geheime Setup-Anwendung</p>
                </header>
                
                <main className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 md:p-8">
                    {gameState.status === Status.SETUP ? (
                        <SetupScreen
                            gameState={gameState}
                            onAddPlayer={handleAddPlayer}
                            onRemovePlayer={handleRemovePlayer}
                            onStartGame={handleStartGame}
                            isStarting={isLoading}
                            error={error}
                        />
                    ) : (
                        <RevealScreen gameState={gameState} onResetGame={handleResetGame} />
                    )}
                </main>
                 <footer className="text-center mt-8 text-gray-500 text-sm">
                    <p>Entwickelt für geheime Missionen und lustige Spieleabende.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;