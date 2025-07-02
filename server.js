
const express = require('express');
const http = require('http');
const path = require('path');
const { WebSocketServer, WebSocket } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Serve static files from the public directory
// In a standard Glitch setup, your project root is where you serve from.
app.use(express.static(path.join(__dirname)));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Using a Set to store player names to ensure uniqueness
const players = new Set();

const broadcastPlayers = () => {
  const playerList = Array.from(players);
  const message = JSON.stringify({
    type: 'updatePlayers',
    players: playerList,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

wss.on('connection', (ws) => {
  console.log('Client connected');
  // Send the current player list to the newly connected client
  ws.send(JSON.stringify({ type: 'updatePlayers', players: Array.from(players) }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'join' && data.name) {
        // Associate the player name with this specific websocket connection
        ws.playerName = data.name;
        players.add(data.name);
        console.log(`Player joined: ${data.name}`);
        broadcastPlayers();
      } else if (data.type === 'leave' && data.name) {
        players.delete(data.name);
        console.log(`Player left: ${data.name}`);
        broadcastPlayers();
      }
    } catch (e) {
      console.error('Failed to parse message or invalid message format.');
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // If the connection had a player name associated, remove them
    if (ws.playerName) {
      players.delete(ws.playerName);
      broadcastPlayers();
      console.log(`Player removed due to disconnect: ${ws.playerName}`);
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
