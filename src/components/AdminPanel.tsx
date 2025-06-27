
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddRecipeForm } from './AddRecipeForm';
import { useRecipes } from '@/hooks/useRecipes';
import { Recipe } from '@/data/recipes';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { recipes, loading, error } = useRecipes();

  const getRecipesByCountry = () => {
    const grouped: { [key: string]: Recipe[] } = {};
    recipes.forEach(recipe => {
      if (!grouped[recipe.pais]) {
        grouped[recipe.pais] = [];
      }
      grouped[recipe.pais].push(recipe);
    });
    return grouped;
  };

  const recipesByCountry = getRecipesByCountry();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <Card className="cyber-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-green-800/90">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              🔧 Painel Administrativo
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-white hover:bg-green-700/50"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="bg-green-800/90">
          <div className="space-y-6 mt-6">
            <div className="flex gap-4">
              <Button
                onClick={() => setShowAddForm(true)}
                className="cyber-button"
              >
                + Adicionar Nova Receita
              </Button>
            </div>

            {loading ? (
              <div className="text-center text-green-200">
                Carregando receitas...
              </div>
            ) : error ? (
              <div className="text-center text-red-400">
                Erro: {error}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Receitas por País ({recipes.length} total)
                </h3>
                
                {Object.entries(recipesByCountry).map(([country, countryRecipes]) => (
                  <Card key={country} className="cyber-card">
                    <CardHeader className="bg-green-700/50 py-3">
                      <CardTitle className="text-lg text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {country} ({countryRecipes.length} receitas)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="bg-green-700/30 py-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {countryRecipes.map(recipe => (
                          <div key={recipe.id} className="text-green-200 text-sm" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                            • {recipe.prato}
                            {recipe.estado && ` (${recipe.estado})`}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showAddForm && (
        <AddRecipeForm onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
};
