import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthPage } from '@/components/AuthPage';
import { Navigation } from '@/components/Navigation';
import { GameHomeScreen } from '@/components/GameHomeScreen';
import { LoadingScreen } from '@/components/LoadingScreen';
import { IngredientsDisplay } from '@/components/IngredientsDisplay';
import { GameMap } from '@/components/GameMap';
import { ResultScreen } from '@/components/ResultScreen';
import { AdminPanel } from '@/components/AdminPanel';
import { useGameState } from '@/hooks/useGameState';
import { getRecipesByCountry } from '@/data/recipes';
import { calculateDistance, calculateScore, getRandomRecipe } from '@/utils/gameLogic';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { gameState, updateGameState, resetGame } = useGameState();
  const [usedRecipes, setUsedRecipes] = useState<string[]>([]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    // Auth state will be updated by the listener
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    resetGame();
  };

  const handleHome = () => {
    resetGame();
  };

  const handleGameStart = () => {
    // Update game state to show country selection
    updateGameState({ phase: 'country-selection' });
  };

  const handleOpenAdmin = () => {
    setShowAdminPanel(true);
  };

  const startNewRound = (countryCode: string) => {
    const countryRecipes = getRecipesByCountry(countryCode);
    const availableRecipes = countryRecipes.filter(recipe => !usedRecipes.includes(recipe.id));
    
    if (availableRecipes.length === 0) {
      setUsedRecipes([]);
      const recipe = getRandomRecipe(countryRecipes);
      setUsedRecipes([recipe.id]);
      updateGameState({
        currentRecipe: recipe,
        phase: 'ingredients',
        round: gameState.round + 1
      });
    } else {
      const recipe = getRandomRecipe(availableRecipes);
      setUsedRecipes(prev => [...prev, recipe.id]);
      updateGameState({
        currentRecipe: recipe,
        phase: 'ingredients',
        round: gameState.round + 1
      });
    }
  };

  const handleShowMap = () => {
    updateGameState({ phase: 'map' });
  };

  const handleGuess = (lat: number, lng: number) => {
    if (!gameState.currentRecipe) return;

    const distance = calculateDistance(
      lat,
      lng,
      gameState.currentRecipe.latitude,
      gameState.currentRecipe.longitude
    );
    
    const roundScore = calculateScore(distance);
    
    updateGameState({
      userGuess: { lat, lng },
      distance,
      score: gameState.score + roundScore,
      phase: 'result'
    });
  };

  const handleNextRound = () => {
    if (gameState.round >= gameState.totalRounds) {
      resetGame();
      return;
    }
    
    updateGameState({ phase: 'loading' });
    setTimeout(() => {
      startNewRound(gameState.selectedCountry!);
    }, 1000);
  };

  const handleRestart = () => {
    setUsedRecipes([]);
    resetGame();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-leaf-600 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-leaf-600">
      <Navigation
        onHome={handleHome}
        onLogout={handleLogout}
        isAuthenticated={!!user}
      />
      
      {(() => {
        switch (gameState.phase) {
          case 'country-selection':
            return (
              <div>
                <GameHomeScreen 
                  onStartGame={handleGameStart}
                  onSignOut={handleLogout}
                  onOpenAdmin={handleOpenAdmin}
                />
                {showAdminPanel && (
                  <AdminPanel onClose={() => setShowAdminPanel(false)} />
                )}
              </div>
            );
          
          case 'loading':
            return <LoadingScreen country={gameState.selectedCountry!} />;
          
          case 'ingredients':
            return (
              <IngredientsDisplay
                recipe={gameState.currentRecipe!}
                onContinue={handleShowMap}
              />
            );
          
          case 'map':
            return (
              <GameMap
                recipe={gameState.currentRecipe!}
                onGuess={handleGuess}
                selectedCountry={gameState.selectedCountry!}
              />
            );
          
          case 'result':
            return (
              <ResultScreen
                recipe={gameState.currentRecipe!}
                distance={gameState.distance!}
                score={calculateScore(gameState.distance!)}
                onNextRound={handleNextRound}
                onRestart={handleRestart}
                isLastRound={gameState.round >= gameState.totalRounds}
                totalScore={gameState.score}
              />
            );
          
          default:
            return (
              <div>
                <GameHomeScreen 
                  onStartGame={handleGameStart}
                  onSignOut={handleLogout}
                  onOpenAdmin={handleOpenAdmin}
                />
                {showAdminPanel && (
                  <AdminPanel onClose={() => setShowAdminPanel(false)} />
                )}
              </div>
            );
        }
      })()}
    </div>
  );
};

export default Index;
