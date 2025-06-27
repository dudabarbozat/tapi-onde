
import { Recipe } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IngredientsDisplayProps {
  recipe: Recipe;
  onContinue: () => void;
}

export const IngredientsDisplay = ({ recipe, onContinue }: IngredientsDisplayProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-leaf-600">      
      <Card className="cyber-card max-w-4xl w-full animate-fade-in relative z-10">
        <CardHeader className="text-center pb-8 bg-green-800/90">
          <div className="text-9xl mb-8 relative">
            🥘
            <div className="absolute -top-2 -right-2 text-4xl animate-pulse">🔍</div>
          </div>
          <CardTitle className="text-4xl text-white mb-6 font-light" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            MISSÃO: IDENTIFICAR
          </CardTitle>
          <div className="max-w-2xl mx-auto">
            <p className="text-green-200 mb-6 text-base font-light" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
              🎯 Analise os ingredientes e descubra o local de origem
            </p>
            <p className="text-green-300 leading-relaxed text-base font-normal" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
              Use suas habilidades de detetive gastronômico para identificar onde este prato é tradicionalmente preparado
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="pt-8 bg-green-800/90">
          <div className="mb-12">
            <h3 className="text-center mb-10 text-xl text-white font-light" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <span className="text-green-400">🌿</span> INGREDIENTES DETECTADOS:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
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
            <Button onClick={onContinue} className="cyber-button text-xl px-16 py-6">
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
