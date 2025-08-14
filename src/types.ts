export interface WordPair {
  id: number;
  arabic: string;
  english: string;
  level: 1 | 2 | 3; // 1: Easy, 2: Medium, 3: Hard
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export enum GameMode {
  TIMED,
  ZEN,
  CATEGORIZED,
}

export enum GameState {
  MENU,
  CATEGORY_SELECTION,
  PLAYING,
  LEVEL_UP,
  GAME_OVER,
  CONFIRM_EXIT,
}

export enum SelectionStatus {
  NONE,
  SELECTED,
  CORRECT,
  INCORRECT,
}
