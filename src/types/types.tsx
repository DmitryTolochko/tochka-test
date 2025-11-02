export type IConstants = {
    ROWS: number; 
    COLS: number; 
    EMPTY: number; 
    PLAYER1: number; 
    PLAYER2: number; 
    WINCELLS: number;
    BOT: boolean
}

export type PlayerPositions = number[][];

export type WinnerInfo = {
  who: 'player_1' | 'player_2';
  positions: number[][];
};

export type StepResult = {
  player_1: PlayerPositions;
  player_2: PlayerPositions;
  board_state: 'waiting' | 'pending' | 'win' | 'draw';
  winner?: WinnerInfo;
};

export type GameResult = {
  [key: `step_${number}`]: StepResult;
};
