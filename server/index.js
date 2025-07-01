import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GoogleGenAI } from '@google/genai';
import { Status } from '../src/types.js'; // Use .js extension for module imports in Node

// --- Game State (centralized on server) ---
let gameState = {
    players: [],
    status: Status.SETUP,
    hostId: null,
    secretWord: '',
    hint: '',
};

const resetGameState = () => {
    gameState = {
        players: [],
        status: Status.SETUP,
        hostId: null,
        secretWord: '',
        hint: '',
    };
};

// --- Server Setup ---
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Gemini AI Setup ---
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.warn("API_KEY environment variable not set. AI features will fail.");
}
const ai = new GoogleGenAI(apiKey || "DUMMY_KEY");

const PROMPT = `
Generiere ein Spiel-Setup für 'Word Imposter' auf Deutsch.
1. Wähle ein komplett alltägliches, einfaches deutsches Substantiv.
2. Erstelle einen extrem subtilen und vagen Hinweis für dieses Wort. Der Hinweis darf KEINE direkte Eigenschaft, Kategorie, Funktion oder Definition sein. Er sollte eine sehr breite Assoziation oder einen abstrakten Kontext darstellen.
Beispiele für extrem subtile Hinweise:
- Wort: 'Baum', Subtiler Hinweis: 'Kann groß sein'
- Wort: 'Wasser', Subtiler Hinweis: 'Manchmal fließend'
Gib das Ergebnis als einzelnes JSON-Objekt mit den Schlüsseln "secretWord" und "hint" zurück. Gib NUR das JSON-Objekt zurück.
`;

// --- WebSocket Logic ---
io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Send current game state to the new player
    socket.emit('gameStateUpdate', gameState);

    socket.on('joinGame', (playerName) => {
        if (gameState.players.some(p => p.id === socket.id)) return;

        const isHost = gameState.players.length === 0;
        if (isHost) {
            gameState.hostId = socket.id;
        }
        gameState.players.push({ id: socket.id, name: playerName, isHost });

        io.emit('gameStateUpdate', gameState); // Broadcast new state to all
        console.log(`Player ${playerName} (${socket.id}) joined. Host: ${gameState.hostId}`);
    });

    socket.on('startGame', async () => {
        if (socket.id !== gameState.hostId || gameState.players.length < 3) {
            // Only host can start, and only with enough players
            return;
        }

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-04-17",
                contents: PROMPT,
                config: { responseMimeType: "application/json", temperature: 1.0 },
            });
            let jsonStr = response.text.trim();
            const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
            const match = jsonStr.match(fenceRegex);
            if (match && match[2]) {
                jsonStr = match[2].trim();
            }
            const parsedData = JSON.parse(jsonStr);

            gameState.secretWord = parsedData.secretWord;
            gameState.hint = parsedData.hint;

            // Assign roles
            const players = [...gameState.players];
            const imposterIndex = Math.floor(Math.random() * players.length);
            const imposterId = players[imposterIndex].id;

            // Send private role info to each player
            gameState.players.forEach(player => {
                const isImposter = player.id === imposterId;
                const role = isImposter ? 'Imposter' : 'Normaler Spieler';
                const info = isImposter ? gameState.hint : gameState.secretWord;
                io.to(player.id).emit('roleInfo', { role, info });
            });

            gameState.status = Status.REVEALED;
            io.emit('gameStateUpdate', gameState); // Broadcast reveal state
            console.log("Game started. Roles assigned.");

        } catch (e) {
            console.error("Failed to start game:", e);
            io.to(gameState.hostId).emit('gameError', 'Fehler beim Starten des Spiels. Die KI konnte nicht erreicht werden.');
        }
    });
    
    socket.on('resetGame', () => {
        if (socket.id !== gameState.hostId) return;
        resetGameState();
        io.emit('gameStateUpdate', gameState);
        console.log("Game reset by host.");
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        const wasHost = socket.id === gameState.hostId;
        gameState.players = gameState.players.filter(p => p.id !== socket.id);

        if (wasHost && gameState.players.length > 0) {
            // If host leaves, make the next player the new host
            gameState.players[0].isHost = true;
            gameState.hostId = gameState.players[0].id;
        } else if (gameState.players.length === 0) {
            // If last player leaves, reset everything
            resetGameState();
        }

        io.emit('gameStateUpdate', gameState);
    });
});


// --- Static File Serving ---
const staticPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(staticPath));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(staticPath, 'index.html'));
});

// --- Start Server ---
httpServer.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
