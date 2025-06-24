
interface LoadingScreenProps {
  country: string;
}

export const LoadingScreen = ({ country }: LoadingScreenProps) => {
  const countryNames: { [key: string]: string } = {
    'BR': 'Brasil',
    'PE': 'Peru',
    'MX': 'México',
    'CO': 'Colômbia',
    'AR': 'Argentina',
    'CL': 'Chile'
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center cyber-grid-bg relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-yellow/10 via-cyber-green/5 to-cyber-purple/10 pointer-events-none" />
      
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
            <div className="w-24 h-24 mx-auto mt-8 border-4 border-cyber-green/30 rounded-full"></div>
          </div>
        </div>
        
        <h2 className="text-6xl font-cyber font-black mb-6 cyber-title">
          CARREGANDO...
        </h2>
        
        <div className="cyber-card max-w-md mx-auto p-6 mb-8">
          <p className="text-2xl text-gray-800 mb-4 font-heading font-semibold">
            🎯 Preparando Sabores
          </p>
          <p className="text-lg text-gray-600">
            Selecionando um prato típico do{' '}
            <span className="text-cyber-green font-bold">
              {countryNames[country] || country}
            </span>
          </p>
        </div>
        
        {/* Animated loading dots */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div 
            className="w-4 h-4 bg-cyber-yellow rounded-full animate-bounce" 
            style={{ animationDelay: '0ms' }}
          ></div>
          <div 
            className="w-4 h-4 bg-cyber-green rounded-full animate-bounce" 
            style={{ animationDelay: '150ms' }}
          ></div>
          <div 
            className="w-4 h-4 bg-cyber-blue rounded-full animate-bounce" 
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>

        {/* Cyber progress bar */}
        <div className="w-64 mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyber-yellow via-cyber-green to-cyber-blue animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
