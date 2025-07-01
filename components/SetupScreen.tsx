import React, { useState } from 'react';
import { GameState } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlayIcon } from './icons/PlayIcon';
import { UserIcon } from './icons/UserIcon';

interface SetupScreenProps {
    gameState: GameState;
    onAddPlayer: (name: string) => void;
    onRemovePlayer: (id: string) => void;
    onStartGame: () => void;
    isStarting: boolean;
    error: string | null;
}

const SetupScreen: React.FC<SetupScreenProps> = ({
    gameState,
    onAddPlayer,
    onRemovePlayer,
    onStartGame,
    isStarting,
    error,
}) => {
    const [newPlayerName, setNewPlayerName] = useState('');

    const handleAddPlayerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPlayerName.trim()) {
            onAddPlayer(newPlayerName);
            setNewPlayerName('');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <UserIcon />
                    Spieler verwalten ({gameState.players.length})
                </h2>
                <div className="bg-gray-900/50 p-4 rounded-lg space-y-3 max-h-60 overflow-y-auto">
                    {gameState.players.length > 0 ? (
                        gameState.players.map(player => (
                            <div key={player.id} className="flex items-center justify-between bg-gray-700/50 p-2 rounded-md">
                                <span className="text-gray-200">{player.name}</span>
                                <button
                                    onClick={() => onRemovePlayer(player.id)}
                                    className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors"
                                    aria-label={`Entferne ${player.name}`}
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center py-4">Noch keine Spieler hinzugefügt.</p>
                    )}
                </div>
                <form onSubmit={handleAddPlayerSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        placeholder="Name des neuen Spielers"
                        className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        aria-label="Name des neuen Spielers"
                    />
                    <button
                        type="submit"
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold p-3 rounded-lg flex items-center justify-center transition"
                        disabled={!newPlayerName.trim()}
                        aria-label="Spieler hinzufügen"
                    >
                        <PlusIcon />
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                    {error}
                </div>
            )}

            <div className="text-center mt-8">
                <button
                    onClick={onStartGame}
                    disabled={isStarting || gameState.players.length < 3}
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:scale-105 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                >
                    {isStarting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Spiel wird gestartet...
                        </>
                    ) : (
                        <>
                            <PlayIcon />
                            Spiel starten
                        </>
                    )}
                </button>
                <p className="text-gray-400 mt-3 text-sm">Mindestens 3 Spieler benötigt.</p>
            </div>
        </div>
    );
};

export default SetupScreen;

// Simple fade-in animation for setup screen
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);