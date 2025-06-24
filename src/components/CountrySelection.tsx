
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { countriesData } from '@/data/countries';

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
        <div className="mb-8 relative">
          <div className="text-8xl mb-4 tapioca-pin">🥞</div>
          <div className="absolute -top-2 -right-2 text-5xl animate-bounce-gentle">📍</div>
        </div>
        
        <h1 className="text-7xl cyber-title mb-8 tracking-wide">
          TAPiONDE
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-2xl text-high-contrast mb-6 font-heading font-semibold">
            🎮 Descubra os Sabores da América Latina
          </p>
          <p className="text-lg text-medium-contrast leading-relaxed font-body">
            Veja os ingredientes, adivinhe o local! Um jogo que mistura 
            <span className="text-cyber-green font-semibold"> geolocalização </span>
            e <span className="text-cyber-blue font-semibold">cultura gastronômica</span> 
            em uma aventura cyberpunk pelos sabores latinos.
          </p>
        </div>
      </div>

      {/* Country Carousel */}
      <div className="w-full max-w-7xl mb-12 relative z-10">
        <h2 className="text-4xl font-heading font-bold text-center mb-10 text-high-contrast">
          <span className="text-cyber-purple">🌎</span> Escolha Sua Jornada Gastronômica
        </h2>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {countriesData.map((country, index) => (
              <CarouselItem key={country.codigo} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card 
                  className="country-card cursor-pointer group h-full"
                  onClick={() => onCountrySelect(country.codigo.toUpperCase())}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                    <div className="flex-grow">
                      <div className="mb-6 overflow-hidden rounded-xl">
                        <img 
                          src={country.bandeira} 
                          alt={`Bandeira ${country.pais}`}
                          className="country-flag group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="text-2xl font-heading font-bold mb-4 text-high-contrast">
                        {country.pais}
                      </h3>
                      <p className="text-medium-contrast text-sm mb-6 leading-relaxed font-body">
                        Explore os sabores únicos e tradições culinárias de {country.pais}
                      </p>
                    </div>
                    
                    <Button className="cyber-button w-full group-hover:animate-neon-pulse font-heading">
                      EXPLORAR
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-2 border-cyber-yellow bg-white/95 hover:bg-cyber-yellow/10 text-cyber-blue shadow-lg" />
          <CarouselNext className="border-2 border-cyber-yellow bg-white/95 hover:bg-cyber-yellow/10 text-cyber-blue shadow-lg" />
        </Carousel>
      </div>

      {/* Footer */}
      <div className="text-center relative z-10">
        <div className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full border-2 border-cyber-green/20 shadow-lg">
          <span className="text-cyber-green text-2xl">💡</span>
          <p className="text-medium-contrast text-base font-medium font-body">
            Cada país oferece pratos únicos com ingredientes típicos da região
          </p>
        </div>
      </div>
    </div>
  );
};
