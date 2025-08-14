
import { Difficulty } from './types';

interface GameConfig {
  timer: number;
  wordsOnScreen: number;
  matchesPerRound: number;
  pointsPerMatch: number;
}

export const GAME_CONFIG: Record<Difficulty, GameConfig> = {
  [Difficulty.EASY]: {
    timer: 90,
    wordsOnScreen: 4,
    matchesPerRound: 8,
    pointsPerMatch: 10,
  },
  [Difficulty.MEDIUM]: {
    timer: 90,
    wordsOnScreen: 5,
    matchesPerRound: 12,
    pointsPerMatch: 15,
  },
  [Difficulty.HARD]: {
    timer: 120,
    wordsOnScreen: 6,
    matchesPerRound: 16,
    pointsPerMatch: 20,
  },
};

export const TOTAL_ROUNDS_PER_LEVEL = 3;

export const DIFFICULTY_NAMES_AR: Record<Difficulty, string> = {
  [Difficulty.EASY]: 'سهل',
  [Difficulty.MEDIUM]: 'متوسط',
  [Difficulty.HARD]: 'صعب',
};