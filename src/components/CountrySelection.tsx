
import { countries, Country } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface CountrySelectionProps {
  onCountrySelect: (countryCode: string) => void;
}

export const CountrySelection = ({ onCountrySelect }: CountrySelectionProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 cyber-grid-bg relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-yellow/5 via-transparent to-cyber-purple/5 pointer-events-none" />
      
      {/* Logo Section */}
      <div className="text-center mb-16 animate-fade-in relative z-10">
        <div className="mb-6 relative">
          <div className="text-8xl mb-4 tapioca-pin">🥞</div>
          <div className="absolute -top-2 -right-2 text-4xl animate-bounce-gentle">📍</div>
        </div>
        
        <h1 className="text-7xl cyber-title mb-6 tracking-wider">
          TAPiONDE
        </h1>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-2xl text-gray-700 mb-4 font-heading font-medium">
            🎮 Descubra os Sabores da América Latina
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Veja os ingredientes, adivinhe o local! Um jogo que mistura 
            <span className="text-cyber-green font-semibold"> geolocalização </span>
            e <span className="text-cyber-blue font-semibold">cultura gastronômica</span> 
            em uma aventura cyberpunk pelos sabores latinos.
          </p>
        </div>
      </div>

      {/* Country Carousel */}
      <div className="w-full max-w-6xl mb-12 relative z-10">
        <h2 className="text-4xl font-heading font-bold text-center mb-8 text-gray-800">
          <span className="text-cyber-purple">🌎</span> Escolha Sua Jornada Gastronômica
        </h2>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {countries.map((country: Country, index) => (
              <CarouselItem key={country.code} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card 
                  className="country-card cursor-pointer group h-full"
                  onClick={() => onCountrySelect(country.code)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                    <div>
                      <div className="text-7xl mb-6 group-hover:animate-bounce-gentle transition-all duration-300">
                        {country.flag}
                      </div>
                      <h3 className="text-3xl font-heading font-bold mb-4 text-gray-800">
                        {country.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">
                        {country.description}
                      </p>
                    </div>
                    
                    <Button className="cyber-button w-full group-hover:animate-neon-pulse">
                      EXPLORAR
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-2 border-cyber-yellow bg-white/90 hover:bg-cyber-yellow/20 text-cyber-blue" />
          <CarouselNext className="border-2 border-cyber-yellow bg-white/90 hover:bg-cyber-yellow/20 text-cyber-blue" />
        </Carousel>
      </div>

      {/* Footer */}
      <div className="text-center relative z-10">
        <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-cyber-green/30">
          <span className="text-cyber-green text-xl">💡</span>
          <p className="text-gray-700 text-sm font-medium">
            Cada país oferece pratos únicos com ingredientes típicos da região
          </p>
        </div>
      </div>
    </div>
  );
};
