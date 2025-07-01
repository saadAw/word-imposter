import { io } from 'socket.io-client';

// The server URL will be the same as the window's origin
// This works for Glitch and local development
export const socket = io();

// --- Event Emitters ---

export const joinGame = (name: string) => {
    if (name.trim()) {
        socket.emit('joinGame', name.trim());
    }
};

export const startGame = () => {
    socket.emit('startGame');
};

export const resetGame = () => {
    socket.emit('resetGame');
};
