
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Recipe } from '@/data/recipes';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*');

      if (error) throw error;

      // Transform database records to Recipe format
      const transformedRecipes: Recipe[] = data.map(record => ({
        id: record.id,
        prato: record.prato,
        ingredientes: record.ingredientes,
        estado: record.estado,
        pais: record.pais,
        latitude: parseFloat(record.latitude.toString()),
        longitude: parseFloat(record.longitude.toString()),
        dica: record.dica,
        regiao: record.regiao,
        categoria: record.categoria as 'prato-principal' | 'sobremesa' | 'bebida' | 'aperitivo',
        dificuldade: record.dificuldade as 'facil' | 'medio' | 'dificil'
      }));

      setRecipes(transformedRecipes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addRecipe = async (recipe: Omit<Recipe, 'id'>) => {
    try {
      const newId = `${recipe.pais.toLowerCase().slice(0, 2)}-${Date.now()}`;
      const { error } = await supabase
        .from('recipes')
        .insert([{
          id: newId,
          ...recipe
        }]);

      if (error) throw error;
      
      await fetchRecipes(); // Refresh the list
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return {
    recipes,
    loading,
    error,
    addRecipe,
    refetch: fetchRecipes
  };
};
