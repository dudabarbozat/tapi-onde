
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
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/5 via-transparent to-cyber-green/8 pointer-events-none" />
      
      <Card className="cyber-card max-w-4xl w-full animate-fade-in relative z-10">
        <CardHeader className="text-center pb-8">
          <div className="text-9xl mb-8 relative">
            🥘
            <div className="absolute -top-2 -right-2 text-4xl animate-pulse">🔍</div>
          </div>
          <CardTitle className="text-5xl font-display font-black cyber-title mb-6">
            MISSÃO: IDENTIFICAR
          </CardTitle>
          <div className="max-w-2xl mx-auto">
            <p className="text-2xl text-high-contrast mb-6 font-heading font-semibold">
              🎯 Analise os ingredientes e descubra o local de origem
            </p>
            <p className="text-medium-contrast font-body leading-relaxed text-lg">
              Use suas habilidades de detetive gastronômico para identificar onde este prato é tradicionalmente preparado
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="pt-8">
          <div className="mb-12">
            <h3 className="text-3xl font-heading font-bold text-center mb-10 text-high-contrast">
              <span className="text-cyber-green">🌿</span> INGREDIENTES DETECTADOS:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {recipe.ingredientes.map((ingrediente, index) => (
                <div
                  key={index}
                  className="ingredient-tag text-center animate-fade-in hover:scale-105 transition-all duration-300 font-body"
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
              className="cyber-button text-xl px-16 py-6 animate-neon-pulse font-heading"
            >
              <span className="flex items-center gap-4">
                ACESSAR MAPA
                <span className="text-3xl">🗺️</span>
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
