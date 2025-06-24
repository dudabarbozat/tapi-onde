
import { useState } from 'react';
import { Recipe } from '@/data/recipes';

export type GamePhase = 'country-selection' | 'loading' | 'ingredients' | 'map' | 'result';

export interface GameState {
  phase: GamePhase;
  selectedCountry: string | null;
  currentRecipe: Recipe | null;
  userGuess: { lat: number; lng: number } | null;
  score: number;
  distance: number | null;
  round: number;
  totalRounds: number;
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'country-selection',
    selectedCountry: null,
    currentRecipe: null,
    userGuess: null,
    score: 0,
    distance: null,
    round: 0,
    totalRounds: 5
  });

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const resetGame = () => {
    setGameState({
      phase: 'country-selection',
      selectedCountry: null,
      currentRecipe: null,
      userGuess: null,
      score: 0,
      distance: null,
      round: 0,
      totalRounds: 5
    });
  };

  return {
    gameState,
    updateGameState,
    resetGame
  };
};
