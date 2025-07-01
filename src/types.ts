export enum Role {
  REGULAR = 'Normaler Spieler',
  IMPOSTER = 'Imposter',
}

export enum Status {
    SETUP = 'SETUP',
    REVEALED = 'REVEALED',
}

// Player information that is public to everyone in the lobby
export interface Player {
  id: string; // This will be the socket.id
  name: string;
  isHost: boolean;
}

// The overall state of the game, broadcast to all players
export interface GameState {
  players: Player[];
  status: Status;
  hostId: string | null;
}

// Secret information sent ONLY to a specific player
export interface RoleInfo {
    role: Role;
    info: string; // Either the secret word or the hint
}
