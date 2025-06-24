
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
    if (distance <= 50) return { emoji: '🎯', message: 'Perfeito!', color: 'text-leaf-600' };
    if (distance <= 100) return { emoji: '🌟', message: 'Excelente!', color: 'text-leaf-500' };
    if (distance <= 200) return { emoji: '👏', message: 'Muito Bom!', color: 'text-terra-500' };
    if (distance <= 500) return { emoji: '👍', message: 'Bom!', color: 'text-spice-500' };
    if (distance <= 1000) return { emoji: '🤔', message: 'Pode Melhorar', color: 'text-orange-500' };
    return { emoji: '😅', message: 'Tente Novamente!', color: 'text-red-500' };
  };

  const performance = getPerformanceMessage(distance);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-terra-50 to-spice-50">
      <Card className="game-card max-w-2xl w-full animate-fade-in">
        <CardHeader className="text-center pb-4">
          <div className="text-6xl mb-4">{performance.emoji}</div>
          <CardTitle className={`text-3xl font-heading ${performance.color}`}>
            {performance.message}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="bg-terra-100 rounded-xl p-4">
              <h3 className="text-2xl font-heading font-bold text-terra-800 mb-2">
                🍽️ {recipe.prato}
              </h3>
              <p className="text-terra-600">
                <strong>Origem:</strong> {recipe.estado ? `${recipe.estado}, ${recipe.pais}` : recipe.pais}
              </p>
              {recipe.regiao && (
                <p className="text-terra-600">
                  <strong>Região:</strong> {recipe.regiao}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-spice-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-spice-700">
                  {formatDistance(distance)}
                </div>
                <div className="text-sm text-spice-600">Distância</div>
              </div>
              <div className="bg-leaf-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-leaf-700">
                  {score} pts
                </div>
                <div className="text-sm text-leaf-600">Pontuação</div>
              </div>
            </div>

            <div className="bg-terra-50 rounded-xl p-4 border border-terra-200">
              <h4 className="font-semibold text-terra-800 mb-2">💡 Curiosidade:</h4>
              <p className="text-terra-700 text-sm leading-relaxed">
                {recipe.dica}
              </p>
            </div>

            {isLastRound && (
              <div className="bg-gradient-to-r from-terra-100 to-spice-100 rounded-xl p-4 border border-terra-200">
                <h4 className="font-semibold text-terra-800 mb-2">🏆 Pontuação Final:</h4>
                <p className="text-2xl font-bold text-terra-700">
                  {totalScore} pontos
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {!isLastRound ? (
              <Button
                onClick={onNextRound}
                className="flex-1 bg-leaf-500 hover:bg-leaf-600 text-white py-3 rounded-full font-semibold transition-all duration-300"
              >
                Próximo Prato 🍽️
              </Button>
            ) : (
              <Button
                onClick={onRestart}
                className="flex-1 bg-terra-500 hover:bg-terra-600 text-white py-3 rounded-full font-semibold transition-all duration-300"
              >
                Jogar Novamente 🔄
              </Button>
            )}
            
            <Button
              onClick={onRestart}
              variant="outline"
              className="flex-1 border-terra-300 text-terra-700 hover:bg-terra-50 py-3 rounded-full font-semibold transition-all duration-300"
            >
              Escolher Outro País 🌎
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
