
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRecipes } from '@/hooks/useRecipes';
import { Recipe } from '@/data/recipes';

interface AddRecipeFormProps {
  onClose: () => void;
}

export const AddRecipeForm = ({ onClose }: AddRecipeFormProps) => {
  const [formData, setFormData] = useState({
    prato: '',
    ingredientes: '',
    estado: '',
    pais: '',
    latitude: '',
    longitude: '',
    dica: '',
    regiao: '',
    categoria: '',
    dificuldade: ''
  });
  const [loading, setLoading] = useState(false);
  const { addRecipe } = useRecipes();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recipe: Omit<Recipe, 'id'> = {
        prato: formData.prato,
        ingredientes: formData.ingredientes.split(',').map(ing => ing.trim()),
        estado: formData.estado || null,
        pais: formData.pais,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        dica: formData.dica,
        regiao: formData.regiao || null,
        categoria: formData.categoria as any,
        dificuldade: formData.dificuldade as any
      };

      const result = await addRecipe(recipe);
      
      if (result.success) {
        toast({
          title: "Receita adicionada!",
          description: "A nova receita foi adicionada com sucesso ao jogo.",
        });
        onClose();
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao adicionar receita",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao adicionar receita",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <Card className="cyber-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-green-800/90">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              🍽️ Adicionar Nova Receita
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
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prato" className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  Nome do Prato *
                </Label>
                <Input
                  id="prato"
                  value={formData.prato}
                  onChange={(e) => handleInputChange('prato', e.target.value)}
                  className="bg-green-700/40 border-green-600/30 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="pais" className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  País *
                </Label>
                <Input
                  id="pais"
                  value={formData.pais}
                  onChange={(e) => handleInputChange('pais', e.target.value)}
                  className="bg-green-700/40 border-green-600/30 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="ingredientes" className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                Ingredientes * (separados por vírgula)
              </Label>
              <Input
                id="ingredientes"
                value={formData.ingredientes}
                onChange={(e) => handleInputChange('ingredientes', e.target.value)}
                className="bg-green-700/40 border-green-600/30 text-white"
                placeholder="Ex: carne bovina, sal grosso, chimichurri"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estado" className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  Estado/Região
                </Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  className="bg-green-700/40 border-green-600/30 text-white"
                />
              </div>

              <div>
                <Label htmlFor="regiao" className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  Região
                </Label>
                <Input
                  id="regiao"
                  value={formData.regiao}
                  onChange={(e) => handleInputChange('regiao', e.target.value)}
                  className="bg-green-700/40 border-green-600/30 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude" className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  Latitude *
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  className="bg-green-700/40 border-green-600/30 text-white"
                  placeholder="-12.0464"
                  required
                />
              </div>

              <div>
                <Label htmlFor="longitude" className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  Longitude *
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  className="bg-green-700/40 border-green-600/30 text-white"
                  placeholder="-77.0428"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoria" className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  Categoria
                </Label>
                <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                  <SelectTrigger className="bg-green-700/40 border-green-600/30 text-white">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prato-principal">Prato Principal</SelectItem>
                    <SelectItem value="sobremesa">Sobremesa</SelectItem>
                    <SelectItem value="bebida">Bebida</SelectItem>
                    <SelectItem value="aperitivo">Aperitivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dificuldade" className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  Dificuldade
                </Label>
                <Select value={formData.dificuldade} onValueChange={(value) => handleInputChange('dificuldade', value)}>
                  <SelectTrigger className="bg-green-700/40 border-green-600/30 text-white">
                    <SelectValue placeholder="Selecione a dificuldade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="dica" className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                Dica Cultural *
              </Label>
              <Input
                id="dica"
                value={formData.dica}
                onChange={(e) => handleInputChange('dica', e.target.value)}
                className="bg-green-700/40 border-green-600/30 text-white"
                placeholder="Curiosidade sobre o prato e sua origem cultural"
                required
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={loading} className="flex-1 cyber-button">
                {loading ? 'Adicionando...' : 'Adicionar Receita'}
              </Button>
              <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
