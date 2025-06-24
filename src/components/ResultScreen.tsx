
import { Recipe } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistance } from '@/utils/gameLogic';

interface ResultScreenProps {
  recipe: Recipe;
  distance: number;
  score: number;
  onNextRound: () => void;
  onRestart: () => void;
  isLastRound: boolean;
  totalScore: number;
}

export const ResultScreen = ({ 
  recipe, 
  distance, 
  score, 
  onNextRound, 
  onRestart, 
  isLastRound,
  totalScore 
}: ResultScreenProps) => {
  const getPerformanceMessage = (distance: number) => {
    if (distance <= 50) return { emoji: '🎯', message: 'PERFEITO!', color: 'text-cyber-green', glow: 'text-cyber-green' };
    if (distance <= 100) return { emoji: '🌟', message: 'EXCELENTE!', color: 'text-cyber-yellow', glow: 'text-cyber-yellow' };
    if (distance <= 200) return { emoji: '👏', message: 'MUITO BOM!', color: 'text-cyber-blue', glow: 'text-cyber-blue' };
    if (distance <= 500) return { emoji: '👍', message: 'BOM!', color: 'text-cyber-purple', glow: 'text-cyber-purple' };
    if (distance <= 1000) return { emoji: '🤔', message: 'PODE MELHORAR', color: 'text-orange-500', glow: 'text-orange-500' };
    return { emoji: '😅', message: 'TENTE NOVAMENTE!', color: 'text-red-500', glow: 'text-red-500' };
  };

  const performance = getPerformanceMessage(distance);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 cyber-grid-bg relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-green/10 via-transparent to-cyber-purple/10 pointer-events-none" />
      
      <Card className="cyber-card max-w-3xl w-full animate-fade-in relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="text-8xl mb-6 animate-bounce-gentle">{performance.emoji}</div>
          <CardTitle className={`text-5xl font-cyber font-black ${performance.color} mb-4`}>
            {performance.message}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="text-center space-y-6">
            <div className="cyber-card p-6 bg-gradient-to-r from-cyber-yellow/10 to-cyber-green/10">
              <h3 className="text-4xl font-heading font-bold text-gray-800 mb-3">
                🍽️ {recipe.prato}
              </h3>
              <div className="space-y-2 text-lg">
                <p className="text-gray-700">
                  <span className="text-cyber-blue font-bold">🏠 Origem:</span> {recipe.estado ? `${recipe.estado}, ${recipe.pais}` : recipe.pais}
                </p>
                {recipe.regiao && (
                  <p className="text-gray-700">
                    <span className="text-cyber-green font-bold">🌍 Região:</span> {recipe.regiao}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="cyber-card p-6 bg-gradient-to-br from-cyber-pink/10 to-cyber-purple/10">
                <div className="text-4xl font-cyber font-black text-cyber-pink">
                  {formatDistance(distance)}
                </div>
                <div className="text-sm text-gray-600 font-heading font-semibold">DISTÂNCIA</div>
              </div>
              <div className="cyber-card p-6 bg-gradient-to-br from-cyber-green/10 to-cyber-lime/10">
                <div className="text-4xl font-cyber font-black text-cyber-green">
                  {score} pts
                </div>
                <div className="text-sm text-gray-600 font-heading font-semibold">PONTUAÇÃO</div>
              </div>
            </div>

            <div className="cyber-card p-6 bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border-2 border-cyber-blue/30">
              <h4 className="font-cyber font-bold text-cyber-blue mb-3 text-xl">💡 CURIOSIDADE CULTURAL:</h4>
              <p className="text-gray-700 leading-relaxed">
                {recipe.dica}
              </p>
            </div>

            {isLastRound && (
              <div className="cyber-card p-6 bg-gradient-to-r from-cyber-yellow/20 to-cyber-green/20 border-2 border-cyber-yellow/50 animate-neon-pulse">
                <h4 className="font-cyber font-bold text-cyber-yellow mb-3 text-2xl">🏆 MISSÃO COMPLETA!</h4>
                <p className="text-3xl font-cyber font-black text-gray-800">
                  {totalScore} PONTOS TOTAIS
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            {!isLastRound ? (
              <Button
                onClick={onNextRound}
                className="flex-1 cyber-button text-xl py-6"
              >
                <span className="flex items-center gap-3">
                  PRÓXIMA MISSÃO
                  <span className="text-2xl">🍽️</span>
                </span>
              </Button>
            ) : (
              <Button
                onClick={onRestart}
                className="flex-1 cyber-button text-xl py-6"
              >
                <span className="flex items-center gap-3">
                  NOVA JORNADA
                  <span className="text-2xl">🔄</span>
                </span>
              </Button>
            )}
            
            <Button
              onClick={onRestart}
              className="flex-1 bg-white/90 hover:bg-cyber-yellow/20 border-2 border-cyber-yellow text-cyber-blue font-cyber font-bold text-xl py-6 rounded-lg transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                EXPLORAR OUTROS PAÍSES
                <span className="text-2xl">🌎</span>
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
