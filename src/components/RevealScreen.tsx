import React from 'react';
import { GameState, Role, RoleInfo } from '../types';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { resetGame } from '../services/socketService';

interface RevealScreenProps {
    gameState: GameState;
    myRoleInfo: RoleInfo | null;
    myPlayerId: string | null;
}

const PlayerCard: React.FC<{ name: string; isHost: boolean }> = ({ name, isHost }) => (
     <div className="flex items-center justify-center gap-2 bg-gray-700/50 p-2 rounded-md">
        <span className="text-gray-300">{name}</span>
        {isHost && (
            <span className="text-xs font-bold text-cyan-400 bg-cyan-900/50 px-2 py-1 rounded-full">
                HOST
            </span>
        )}
    </div>
);


const RevealScreen: React.FC<RevealScreenProps> = ({ gameState, myRoleInfo, myPlayerId }) => {
    const isHost = gameState.hostId === myPlayerId;

    if (!myRoleInfo) {
        return <div className="text-center text-gray-400">Warte auf deine Rolle...</div>;
    }

    const { role, info } = myRoleInfo;
    const isImposter = role === Role.IMPOSTER;

    return (
        <div className="w-full flex flex-col items-center space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-white">Deine geheime Rolle!</h2>
            
            {/* Personalized Card for the user */}
            <div className={`w-full max-w-sm bg-gray-800 p-6 rounded-2xl border-2 ${isImposter ? 'border-red-500 shadow-red-500/20' : 'border-cyan-500 shadow-cyan-500/20'} shadow-lg`}>
                <div className="flex flex-col items-center text-center">
                    <p className={`text-sm font-medium uppercase tracking-wider mb-2 ${isImposter ? 'text-red-400' : 'text-cyan-400'}`}>
                        Du bist: {role}
                    </p>
                    <div className="bg-gray-900/50 w-full p-4 rounded-md min-h-[80px] flex items-center justify-center">
                        <p className="text-3xl font-light text-gray-100 select-all">"{info}"</p>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-sm text-center">
                <h3 className="text-lg font-semibold text-gray-300 mb-3">Alle Spieler in dieser Runde:</h3>
                <div className="space-y-2">
                    {gameState.players.map(player => (
                        <PlayerCard key={player.id} name={player.name} isHost={player.isHost} />
                    ))}
                </div>
            </div>

            {isHost && (
                 <div className="mt-4">
                    <button
                        onClick={resetGame}
                        className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                    >
                        <ArrowPathIcon />
                        Neues Spiel einrichten
                    </button>
                </div>
            )}
        </div>
    );
};

export default RevealScreen;
