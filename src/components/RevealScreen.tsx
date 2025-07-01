
import React from 'react';
import { GameState, Role } from '../types';
import { ArrowPathIcon } from './icons/ArrowPathIcon';

interface RevealScreenProps {
    gameState: GameState;
    onResetGame: () => void;
}

const PlayerCard: React.FC<{ player: GameState['players'][0], info: string }> = ({ player, info }) => (
    <div className={`relative bg-gray-800 p-6 rounded-lg border-2 ${player.role === Role.IMPOSTER ? 'border-red-500 shadow-red-500/20' : 'border-cyan-500 shadow-cyan-500/20'} shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl`}>
        <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-white">{player.name}</h3>
            <p className={`text-sm font-medium uppercase tracking-wider mb-4 ${player.role === Role.IMPOSTER ? 'text-red-400' : 'text-cyan-400'}`}>
                {player.role}
            </p>
            <div className="bg-gray-900/50 w-full p-4 rounded-md min-h-[80px] flex items-center justify-center">
                <p className="text-2xl font-light text-gray-100 select-all">"{info}"</p>
            </div>
        </div>
    </div>
);

const RevealScreen: React.FC<RevealScreenProps> = ({ gameState, onResetGame }) => {
    return (
        <div className="flex flex-col items-center space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-white">Rollen & Informationen wurden zugewiesen!</h2>
            
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameState.players.map(player => (
                    <PlayerCard
                        key={player.id}
                        player={player}
                        info={player.role === Role.IMPOSTER ? gameState.hint : gameState.secretWord}
                    />
                ))}
            </div>

            <div className="mt-8">
                <button
                    onClick={onResetGame}
                    className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                >
                    <ArrowPathIcon />
                    Neues Spiel einrichten
                </button>
            </div>
        </div>
    );
};

export default RevealScreen;

// Simple fade-in animation for reveal screen
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