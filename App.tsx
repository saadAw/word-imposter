
import React, { useState, useCallback, useEffect } from 'react';
import { PlayerCard } from './components/PlayerCard';

export default function App(): React.ReactNode {
  const [playerName, setPlayerName] = useState<string>('');
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [allPlayers, setAllPlayers] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Construct WebSocket URL from the current page's location
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}`;
    
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'updatePlayers' && Array.isArray(message.players)) {
          setAllPlayers(message.players);
        }
      } catch (err) {
        console.error('Failed to parse message from server:', err);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
      // Optional: handle reconnection logic here
      setHasJoined(false); // Player is no longer in the lobby if connection is lost
    };

    socket.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('Verbindungsfehler zum Server.');
    };

    setWs(socket);

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);

  const handleJoin = useCallback(() => {
    if (playerName.trim().length < 3) {
      setError('Der Name muss mindestens 3 Zeichen lang sein.');
      return;
    }
    if (playerName.trim().length > 15) {
      setError('Der Name darf höchstens 15 Zeichen lang sein.');
      return;
    }
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        setError('Keine Verbindung zum Server. Bitte versuche es erneut.');
        return;
    }

    ws.send(JSON.stringify({ type: 'join', name: playerName.trim() }));
    setError('');
    setHasJoined(true);
  }, [playerName, ws]);

  const handleLeave = useCallback(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'leave', name: playerName }));
    }
    setHasJoined(false);
    // Do not clear player name to allow for quick re-joining
  }, [playerName, ws]);
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleJoin();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 font-sans">
      <div className="w-full max-w-md mx-auto">
        {!hasJoined ? (
          <div className="bg-slate-800/50 backdrop-blur-sm shadow-2xl shadow-cyan-500/10 rounded-2xl p-8 border border-slate-700">
            <h1 className="text-3xl font-bold text-center text-cyan-400 mb-2">Lobby beitreten</h1>
            <p className="text-center text-slate-400 mb-6">Gib deinen Namen ein, um beizutreten.</p>
            <div className="space-y-4">
              <input
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  if (error) setError('');
                }}
                onKeyDown={handleKeyDown}
                placeholder="Dein Name"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all duration-300"
                maxLength={15}
              />
               {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button
                onClick={handleJoin}
                className="w-full bg-cyan-500 text-slate-900 font-bold py-3 px-4 rounded-lg hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
                disabled={!playerName.trim() || !ws || ws.readyState !== WebSocket.OPEN}
              >
                Beitreten
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm shadow-2xl shadow-indigo-500/10 rounded-2xl p-8 border border-slate-700">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-indigo-400">Lobby</h1>
                 <button 
                    onClick={handleLeave}
                    className="bg-red-500/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-all duration-300 text-sm"
                 >
                    Verlassen
                </button>
            </div>
            
            <p className="text-slate-300 mb-6">Willkommen, <span className="font-bold text-white">{playerName}</span>! Warte auf den Start des Spiels.</p>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-300 mb-2 border-b border-slate-700 pb-2">Spieler in der Lobby ({allPlayers.length}/10)</h2>
              {allPlayers.map((name, index) => (
                <PlayerCard key={index} name={name} isCurrentUser={name === playerName} />
              ))}
            </div>
          </div>
        )}
      </div>
      <footer className="text-center text-slate-600 mt-8 text-sm">
        <p>Erstellt für Glitch</p>
      </footer>
    </div>
  );
}
