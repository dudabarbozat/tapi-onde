
import { countries, Country } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CountrySelectionProps {
  onCountrySelect: (countryCode: string) => void;
}

export const CountrySelection = ({ onCountrySelect }: CountrySelectionProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-terra-50 to-spice-50">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-6xl font-heading font-bold text-terra-800 mb-4">
          🍽️ Sabores da Terra
        </h1>
        <p className="text-xl text-terra-600 max-w-2xl mx-auto leading-relaxed">
          Descubra os sabores únicos da América Latina! Veja os ingredientes e adivinhe 
          onde cada prato tradicional é preparado.
        </p>
      </div>

      <div className="max-w-6xl w-full">
        <h2 className="text-3xl font-heading font-semibold text-center text-terra-700 mb-8">
          Escolha um país para começar sua jornada gastronômica
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country: Country) => (
            <Card 
              key={country.code} 
              className="game-card hover:scale-105 transition-all duration-300 cursor-pointer group"
              onClick={() => onCountrySelect(country.code)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4 group-hover:animate-bounce-gentle">
                  {country.flag}
                </div>
                <h3 className="text-2xl font-heading font-semibold text-terra-800 mb-3">
                  {country.name}
                </h3>
                <p className="text-terra-600 text-sm mb-4 leading-relaxed">
                  {country.description}
                </p>
                <Button className="bg-terra-500 hover:bg-terra-600 text-white px-6 py-2 rounded-full transition-all duration-300 group-hover:animate-pulse-glow">
                  Explorar Sabores
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-terra-500 text-sm">
          💡 Dica: Cada país oferece pratos únicos com ingredientes típicos da região
        </p>
      </div>
    </div>
  );
};
