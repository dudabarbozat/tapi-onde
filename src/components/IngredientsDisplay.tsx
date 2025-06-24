
import { Recipe } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IngredientsDisplayProps {
  recipe: Recipe;
  onContinue: () => void;
}

export const IngredientsDisplay = ({ recipe, onContinue }: IngredientsDisplayProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-terra-50 to-spice-50">
      <Card className="game-card max-w-2xl w-full animate-fade-in">
        <CardHeader className="text-center pb-4">
          <div className="text-6xl mb-4">🥘</div>
          <CardTitle className="text-3xl font-heading text-terra-800">
            Adivinhe o Prato!
          </CardTitle>
          <p className="text-terra-600 mt-2">
            Analise os ingredientes abaixo e depois clique no mapa onde você acha que este prato é preparado
          </p>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-terra-700 mb-4 text-center">
              🌿 Ingredientes:
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {recipe.ingredientes.map((ingrediente, index) => (
                <span
                  key={index}
                  className="ingredient-tag animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {ingrediente}
                </span>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <Button
              onClick={onContinue}
              className="bg-terra-500 hover:bg-terra-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Ir para o Mapa 🗺️
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
