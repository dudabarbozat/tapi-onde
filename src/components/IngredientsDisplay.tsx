import type { Prato } from '@/data/pratos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IngredientsDisplayProps {
  recipe: Prato;
  rodada: number;
  totalRodadas: number;
  onContinue: () => void;
}

const CATEGORIA: Record<Prato['categoria'], string> = {
  'prato-principal': 'Prato principal',
  sobremesa: 'Sobremesa',
  bebida: 'Bebida',
  aperitivo: 'Petisco',
};

export const IngredientsDisplay = ({ recipe, rodada, totalRodadas, onContinue }: IngredientsDisplayProps) => (
  <div className="min-h-screen flex items-center justify-center px-4 pt-6 pb-6 bg-leaf-600">
    <Card className="cyber-card max-w-4xl w-full animate-fade-in relative z-10">
      <CardHeader className="text-center pb-6 bg-green-800/90">
        <p className="text-green-300 text-sm tracking-widest mb-4" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
          RODADA {rodada} DE {totalRodadas} · {CATEGORIA[recipe.categoria].toUpperCase()}
        </p>
        <div className="text-8xl mb-6 relative inline-block mx-auto">
          🥘
          <div className="absolute -top-2 -right-4 text-4xl animate-pulse">🔍</div>
        </div>
        <CardTitle className="text-3xl md:text-4xl text-white mb-4 font-light" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          DE ONDE É ESTE PRATO?
        </CardTitle>
        <p className="text-green-200 max-w-2xl mx-auto" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
          Analise os ingredientes e a dica, e depois marque no mapa onde ele é tradicionalmente preparado.
        </p>
      </CardHeader>

      <CardContent className="pt-6 bg-green-800/90">
        <h3 className="text-center mb-6 text-xl text-white font-light" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          <span className="text-green-400">🌿</span> INGREDIENTES
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          {recipe.ingredientes.map((ingrediente, index) => (
            <div key={ingrediente} className="ingredient-tag text-center animate-fade-in" style={{ animationDelay: `${index * 120}ms` }}>
              {ingrediente}
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mb-10 rounded-lg border border-green-600/50 bg-green-700/40 p-5">
          <p className="text-green-100 leading-relaxed" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
            <span className="font-semibold text-yellow-300">💡 Dica: </span>
            {recipe.dica}
          </p>
        </div>

        <div className="text-center">
          <Button onClick={onContinue} className="cyber-button text-xl px-12 py-6">
            ABRIR O MAPA 🗺️
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);
