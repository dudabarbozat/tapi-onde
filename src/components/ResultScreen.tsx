
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
    if (distance <= 50) return {
      emoji: '🎯',
      message: 'PERFEITO!',
      color: 'text-yellow-400'
    };
    if (distance <= 100) return {
      emoji: '🌟',
      message: 'EXCELENTE!',
      color: 'text-green-400'
    };
    if (distance <= 200) return {
      emoji: '👏',
      message: 'MUITO BOM!',
      color: 'text-blue-400'
    };
    if (distance <= 500) return {
      emoji: '👍',
      message: 'BOM!',
      color: 'text-purple-400'
    };
    if (distance <= 1000) return {
      emoji: '🤔',
      message: 'PODE MELHORAR',
      color: 'text-orange-400'
    };
    return {
      emoji: '😅',
      message: 'TENTE NOVAMENTE!',
      color: 'text-red-400'
    };
  };

  const performance = getPerformanceMessage(distance);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-leaf-600">      
      <Card className="cyber-card max-w-3xl w-full animate-fade-in relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="text-8xl mb-6 animate-bounce-gentle">{performance.emoji}</div>
          <CardTitle className={`text-5xl font-heading font-black ${performance.color} mb-4`}>
            {performance.message}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="text-center space-y-6">
            <div className="cyber-card p-6">
              <h3 className="text-4xl font-heading font-bold text-white mb-3">
                🍽️ {recipe.prato}
              </h3>
              <div className="space-y-2 text-lg">
                <p className="text-green-200">
                  <span className="text-blue-400 font-bold">🏠 Origem:</span> {recipe.estado ? `${recipe.estado}, ${recipe.pais}` : recipe.pais}
                </p>
                {recipe.regiao && (
                  <p className="text-green-200">
                    <span className="text-green-400 font-bold">🌍 Região:</span> {recipe.regiao}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="cyber-card p-6">
                <div className="text-4xl font-heading font-black text-pink-400">
                  {formatDistance(distance)}
                </div>
                <div className="text-sm text-green-200 font-heading font-semibold">DISTÂNCIA</div>
              </div>
              <div className="cyber-card p-6">
                <div className="text-4xl font-heading font-black text-green-400">
                  {score} pts
                </div>
                <div className="text-sm text-green-200 font-heading font-semibold">PONTUAÇÃO</div>
              </div>
            </div>

            <div className="cyber-card p-6">
              <h4 className="font-heading font-bold text-blue-400 mb-3 text-xl">💡 CURIOSIDADE CULTURAL:</h4>
              <p className="text-green-200 leading-relaxed">
                {recipe.dica}
              </p>
            </div>

            {isLastRound && (
              <div className="cyber-card p-6 border-2 border-yellow-500/50">
                <h4 className="font-heading font-bold text-yellow-400 mb-3 text-2xl">🏆 MISSÃO COMPLETA!</h4>
                <p className="text-3xl font-heading font-black text-white">
                  {totalScore} PONTOS TOTAIS
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            {!isLastRound ? (
              <Button onClick={onNextRound} className="flex-1 cyber-button text-xl py-6">
                <span className="flex items-center gap-3">
                  PRÓXIMA MISSÃO
                  <span className="text-2xl">🍽️</span>
                </span>
              </Button>
            ) : (
              <Button onClick={onRestart} className="flex-1 cyber-button text-xl py-6">
                <span className="flex items-center gap-3">
                  NOVA JORNADA
                  <span className="text-2xl">🔄</span>
                </span>
              </Button>
            )}
            
            <Button 
              onClick={onRestart} 
              className="flex-1 bg-green-700/80 hover:bg-green-600/90 border-2 border-green-500 text-white font-heading font-bold text-xl py-6 rounded-lg transition-all duration-300"
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
