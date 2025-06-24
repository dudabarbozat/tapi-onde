
import { countriesData } from '@/data/countries';

interface LoadingScreenProps {
  country: string;
}

export const LoadingScreen = ({ country }: LoadingScreenProps) => {
  const getCountryName = (countryCode: string): string => {
    const countryData = countriesData.find(c => c.codigo.toUpperCase() === countryCode.toUpperCase());
    return countryData?.pais || countryCode;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center cyber-grid-bg relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-yellow/8 via-cyber-green/4 to-cyber-purple/8 pointer-events-none" />
      
      <div className="text-center animate-fade-in relative z-10">
        {/* Animated tapioca with location pin */}
        <div className="relative mb-12">
          <div className="text-9xl animate-bounce-gentle">
            🥞
          </div>
          <div className="absolute -top-4 -right-4 text-5xl animate-pulse text-cyber-blue">
            📍
          </div>
          <div className="absolute inset-0 animate-ping">
            <div className="w-28 h-28 mx-auto mt-8 border-4 border-cyber-green/20 rounded-full"></div>
          </div>
        </div>
        
        <h2 className="text-6xl font-display font-black mb-8 cyber-title">
          CARREGANDO...
        </h2>
        
        <div className="cyber-card max-w-lg mx-auto p-8 mb-10">
          <p className="text-2xl text-high-contrast mb-6 font-heading font-semibold">
            🎯 Preparando Sabores
          </p>
          <p className="text-lg text-medium-contrast font-body leading-relaxed">
            Selecionando um prato típico{' '}
            {getCountryName(country) !== 'Brasil' ? 'do' : 'do'}{' '}
            <span className="text-cyber-green font-bold font-heading">
              {getCountryName(country)}
            </span>
          </p>
        </div>
        
        {/* Animated loading dots */}
        <div className="flex items-center justify-center space-x-4 mb-10">
          <div 
            className="w-5 h-5 bg-cyber-yellow rounded-full animate-bounce" 
            style={{ animationDelay: '0ms' }}
          ></div>
          <div 
            className="w-5 h-5 bg-cyber-green rounded-full animate-bounce" 
            style={{ animationDelay: '150ms' }}
          ></div>
          <div 
            className="w-5 h-5 bg-cyber-blue rounded-full animate-bounce" 
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>

        {/* Cyber progress bar */}
        <div className="w-80 mx-auto h-3 bg-white/80 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-cyber-yellow via-cyber-green to-cyber-blue animate-pulse rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
