
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

// Import components
import { AuthPage } from '@/components/AuthPage';
import { GameHomeScreen } from '@/components/GameHomeScreen';
import { CountrySelection } from '@/components/CountrySelection';
import { LoadingScreen } from '@/components/LoadingScreen';
import { IngredientsDisplay } from '@/components/IngredientsDisplay';
import { GameMap } from '@/components/GameMap';
import { ResultScreen } from '@/components/ResultScreen';
import { AdminPanel } from '@/components/AdminPanel';

// Import hooks and utils
import { useGameState } from '@/hooks/useGameState';
import { useGameRecipes } from '@/hooks/useGameRecipes';
import { calculateDistance, calculateScore } from '@/utils/gameLogic';

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { gameState, updateGameState, resetGame } = useGameState();
  const { currentRecipe, hasNextRecipe, getNextRecipe, resetGame: resetRecipeGame, loading: recipesLoading } = useGameRecipes(gameState.selectedCountry);

  // Initialize auth
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCountrySelect = (country: string) => {
    updateGameState({
      selectedCountry: country,
      phase: 'loading'
    });

    // Simulate loading time
    setTimeout(() => {
      updateGameState({ phase: 'ingredients' });
    }, 2000);
  };

  const handleStartGame = () => {
    if (currentRecipe) {
      updateGameState({
        currentRecipe,
        phase: 'map',
        round: 1
      });
    }
  };

  const handleGuess = (lat: number, lng: number) => {
    if (!currentRecipe) return;

    const distance = calculateDistance(lat, lng, currentRecipe.latitude, currentRecipe.longitude);
    const roundScore = calculateScore(distance);

    updateGameState({
      userGuess: { lat, lng },
      distance,
      score: gameState.score + roundScore,
      phase: 'result'
    });
  };

  const handleNextRound = () => {
    const nextRecipe = getNextRecipe();
    if (nextRecipe && gameState.round < gameState.totalRounds) {
      updateGameState({
        currentRecipe: nextRecipe,
        phase: 'ingredients',
        round: gameState.round + 1,
        userGuess: null,
        distance: null
      });
    }
  };

  const handleRestart = () => {
    resetGame();
    resetRecipeGame();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  // Wait for recipes to load
  if (recipesLoading && gameState.selectedCountry) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={
            gameState.phase === 'country-selection' ? (
              <div>
                <GameHomeScreen 
                  onStartGame={() => updateGameState({ phase: 'country-selection' })} 
                  onSignOut={handleSignOut}
                  onOpenAdmin={() => setShowAdminPanel(true)}
                />
                {showAdminPanel && (
                  <AdminPanel onClose={() => setShowAdminPanel(false)} />
                )}
              </div>
            ) : gameState.phase === 'loading' ? (
              <LoadingScreen />
            ) : gameState.phase === 'ingredients' && currentRecipe ? (
              <IngredientsDisplay
                recipe={currentRecipe}
                onContinue={handleStartGame}
              />
            ) : gameState.phase === 'map' && currentRecipe && gameState.selectedCountry ? (
              <GameMap
                recipe={currentRecipe}
                onGuess={handleGuess}
                selectedCountry={gameState.selectedCountry}
              />
            ) : gameState.phase === 'result' && currentRecipe && gameState.distance !== null ? (
              <ResultScreen
                recipe={currentRecipe}
                distance={gameState.distance}
                score={calculateScore(gameState.distance)}
                onNextRound={handleNextRound}
                onRestart={handleRestart}
                isLastRound={!hasNextRecipe || gameState.round >= gameState.totalRounds}
                totalScore={gameState.score}
              />
            ) : (
              <CountrySelection onCountrySelect={handleCountrySelect} />
            )
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
