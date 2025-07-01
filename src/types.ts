export enum Role {
  REGULAR = 'Normaler Spieler',
  IMPOSTER = 'Imposter',
}

export enum Status {
    SETUP = 'SETUP',
    REVEALED = 'REVEALED',
}

export interface Player {
  id: string;
  name: string;
  role: Role | null;
}

export interface GameState {
  players: Player[];
  secretWord: string;
  hint: string;
  imposterId: string | null;
  status: Status;
}