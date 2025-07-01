import React, { useState } from 'react';
import { joinGame } from '../services/socketService';
import { PlusIcon } from './icons/PlusIcon';

const Lobby: React.FC = () => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        joinGame(name);
    };

    return (
        <div className="w-full max-w-sm text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-4">Tritt dem Spiel bei</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dein Name"
                    maxLength={15}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition text-center text-lg"
                    aria-label="Dein Name"
                    autoFocus
                />
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg text-lg transition"
                    disabled={!name.trim()}
                    aria-label="Spiel beitreten"
                >
                    <PlusIcon />
                    Beitreten
                </button>
            </form>
        </div>
    );
};

export default Lobby;
