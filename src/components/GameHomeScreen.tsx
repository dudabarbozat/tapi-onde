
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { countriesData } from '@/data/countries';
import { GameModeSelector } from '@/components/GameModeSelector';
import { GameMenu } from '@/components/GameMenu';

interface GameHomeScreenProps {
  onStartGame: (countryCode: string, gameMode: string) => void;
}

export const GameHomeScreen = ({
  onStartGame
}: GameHomeScreenProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setShowModeSelector(true);
    setSelectedMode(null);
  };

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode);
  };

  const handleStartGame = () => {
    if (selectedCountry && selectedMode) {
      onStartGame(selectedCountry, selectedMode);
    }
  };

  const handleReset = () => {
    setSelectedCountry(null);
    setSelectedMode(null);
    setShowModeSelector(false);
  };

  return (
    <div className="min-h-screen bg-leaf-600">
      {/* Menu Hambuguer */}
      <button 
        onClick={() => setShowMenu(true)} 
        className="fixed top-6 left-6 z-50 w-12 h-12 bg-green-800/80 backdrop-blur-sm border-2 border-green-600/50 rounded-xl flex items-center justify-center text-green-200 text-xl hover:bg-green-700/80 transition-all duration-300"
      >
        ☰
      </button>

      {/* Botão Voltar (quando modo selecionado) */}
      {showModeSelector && (
        <button 
          onClick={handleReset} 
          className="fixed top-6 right-6 z-50 w-12 h-12 bg-green-800/80 backdrop-blur-sm border-2 border-green-600/50 rounded-xl flex items-center justify-center text-green-200 text-xl hover:bg-green-700/80 transition-all duration-300"
        >
          🏠
        </button>
      )}

      <div className="flex flex-col items-center justify-center min-h-screen p-6 relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-8 relative">
            <img 
              src="/lovable-uploads/8bfc5af9-403d-4df4-8dea-debdb93da4e5.png" 
              alt="TapiOnde Logo" 
              className="w-32 h-32 mx-auto object-contain animate-bounce-gentle" 
            />
          </div>
          
          <p className="text-3xl text-white mb-2 py-8" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
            🎮 Descubra os Sabores da América Latina
          </p>
        </div>

        {/* Country Selector */}
        {!showModeSelector ? (
          <div className="w-full max-w-6xl mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              🎌 Escolha Seu País
            </h2>
            
            <Carousel className="w-full">
              <CarouselContent className="-ml-4">
                {countriesData.map((country, index) => (
                  <CarouselItem key={country.codigo} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card 
                      className={`cyber-country-card cursor-pointer group h-full transition-all duration-300 ${
                        selectedCountry === country.codigo.toUpperCase() ? 'ring-4 ring-yellow-400 shadow-2xl scale-105' : ''
                      }`} 
                      onClick={() => handleCountrySelect(country.codigo.toUpperCase())}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-6 text-center h-full flex flex-col justify-between bg-green-800/90">
                        <div className="flex-grow">
                          <div className="mb-6 overflow-hidden rounded-xl relative">
                            <img 
                              src={country.bandeira} 
                              alt={`Bandeira ${country.pais}`} 
                              className="w-full h-32 object-cover rounded-xl border-2 border-green-600/30 group-hover:scale-105 transition-transform duration-300" 
                              loading="lazy" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent rounded-xl" />
                          </div>
                          <h3 className="text-2xl font-bold mb-4 text-green-100" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                            {country.pais}
                          </h3>
                        </div>
                        
                        <Button className="cyber-neon-button w-full group-hover:animate-neon-pulse">
                          SELECIONAR
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="border-2 border-green-600/50 bg-green-800/60 hover:bg-green-700/70 text-green-200 backdrop-blur-sm" />
              <CarouselNext className="border-2 border-green-600/50 bg-green-800/60 hover:bg-green-700/70 text-green-200 backdrop-blur-sm" />
            </Carousel>
          </div>
        ) : (
          <GameModeSelector 
            selectedCountry={selectedCountry!} 
            selectedMode={selectedMode} 
            onModeSelect={handleModeSelect} 
            onStartGame={handleStartGame} 
          />
        )}
      </div>

      {/* Game Menu Modal */}
      <GameMenu isOpen={showMenu} onClose={() => setShowMenu(false)} />
    </div>
  );
};
