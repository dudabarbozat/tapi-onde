
import { Recipe } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IngredientsDisplayProps {
  recipe: Recipe;
  onContinue: () => void;
}

export const IngredientsDisplay = ({ recipe, onContinue }: IngredientsDisplayProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 cyber-grid-bg relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/5 via-transparent to-cyber-green/10 pointer-events-none" />
      
      <Card className="cyber-card max-w-3xl w-full animate-fade-in relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="text-8xl mb-6 relative">
            🥘
            <div className="absolute -top-2 -right-2 text-3xl animate-pulse">🔍</div>
          </div>
          <CardTitle className="text-5xl font-cyber font-black cyber-title mb-4">
            MISSÃO: IDENTIFICAR
          </CardTitle>
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-700 mb-4 font-heading font-semibold">
              🎯 Analise os ingredientes e descubra o local de origem
            </p>
            <p className="text-gray-600">
              Use suas habilidades de detetive gastronômico para identificar onde este prato é tradicionalmente preparado
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="mb-10">
            <h3 className="text-3xl font-heading font-bold text-center mb-8 text-gray-800">
              <span className="text-cyber-green">🌿</span> INGREDIENTES DETECTADOS:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {recipe.ingredientes.map((ingrediente, index) => (
                <div
                  key={index}
                  className="ingredient-tag text-center animate-fade-in hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {ingrediente}
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <Button
              onClick={onContinue}
              className="cyber-button text-xl px-12 py-6 animate-neon-pulse"
            >
              <span className="flex items-center gap-3">
                ACESSAR MAPA
                <span className="text-2xl">🗺️</span>
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
