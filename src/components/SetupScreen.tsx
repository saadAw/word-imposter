import React from 'react';
import { GameState } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { UserIcon } from './icons/UserIcon';
import { startGame } from '../services/socketService';

interface SetupScreenProps {
    gameState: GameState;
    myPlayerId: string | null;
    error: string | null;
}

const SetupScreen: React.FC<SetupScreenProps> = ({
    gameState,
    myPlayerId,
    error,
}) => {
    const isHost = gameState.hostId === myPlayerId;
    const canStart = gameState.players.length >= 3;

    return (
        <div className="w-full space-y-8 animate-fade-in text-center">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                    <UserIcon />
                    Spieler in der Lobby ({gameState.players.length})
                </h2>
                <div className="bg-gray-900/50 p-4 rounded-lg space-y-3 mt-4 max-h-60 overflow-y-auto">
                    {gameState.players.map(player => (
                        <div key={player.id} className="flex items-center justify-center gap-2 bg-gray-700/50 p-2 rounded-md">
                            <span className="text-gray-200">{player.name}</span>
                            {player.isHost && (
                                <span className="text-xs font-bold text-cyan-400 bg-cyan-900/50 px-2 py-1 rounded-full">
                                    HOST
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {isHost ? (
                <div>
                    <button
                        onClick={startGame}
                        disabled={!canStart}
                        className="w-full md:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:scale-105 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                    >
                        <PlayIcon />
                        Spiel starten
                    </button>
                    <p className={`mt-3 text-sm ${canStart ? 'text-green-400' : 'text-yellow-400'}`}>
                        {canStart ? 'Bereit zum Start!' : 'Mindestens 3 Spieler benötigt.'}
                    </p>
                </div>
            ) : (
                <p className="text-gray-400">Warte, bis der Host das Spiel startet...</p>
            )}
        </div>
    );
};

export default SetupScreen;

// Simple fade-in animation
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
