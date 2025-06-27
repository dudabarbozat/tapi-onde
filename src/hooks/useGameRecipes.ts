
import { useState, useEffect } from 'react';
import { Recipe } from '@/data/recipes';
import { useRecipes } from './useRecipes';

export const useGameRecipes = (selectedCountry: string | null) => {
  const { recipes, loading } = useRecipes();
  const [gameRecipes, setGameRecipes] = useState<Recipe[]>([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);

  useEffect(() => {
    if (!selectedCountry || loading || recipes.length === 0) return;

    // Filter recipes by selected country
    const countryMap: { [key: string]: string } = {
      'BR': 'Brasil',
      'PE': 'Peru', 
      'MX': 'México',
      'CO': 'Colômbia',
      'AR': 'Argentina',
      'CL': 'Chile'
    };

    const countryName = countryMap[selectedCountry];
    if (!countryName) return;

    const filteredRecipes = recipes.filter(recipe => recipe.pais === countryName);
    
    // Shuffle recipes for variety
    const shuffled = [...filteredRecipes].sort(() => Math.random() - 0.5);
    setGameRecipes(shuffled);
    setCurrentRecipeIndex(0);
  }, [selectedCountry, recipes, loading]);

  const getNextRecipe = () => {
    if (currentRecipeIndex < gameRecipes.length - 1) {
      setCurrentRecipeIndex(prev => prev + 1);
      return gameRecipes[currentRecipeIndex + 1];
    }
    return null;
  };

  const getCurrentRecipe = () => {
    return gameRecipes[currentRecipeIndex] || null;
  };

  const resetGame = () => {
    setCurrentRecipeIndex(0);
    // Re-shuffle recipes
    const shuffled = [...gameRecipes].sort(() => Math.random() - 0.5);
    setGameRecipes(shuffled);
  };

  return {
    currentRecipe: getCurrentRecipe(),
    hasNextRecipe: currentRecipeIndex < gameRecipes.length - 1,
    getNextRecipe,
    resetGame,
    totalRecipes: gameRecipes.length,
    currentIndex: currentRecipeIndex,
    loading
  };
};
