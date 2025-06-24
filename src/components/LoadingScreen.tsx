
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-terra-100 to-spice-100">
      <div className="text-center animate-fade-in">
        <div className="text-8xl mb-8 animate-bounce-gentle">
          🍲
        </div>
        
        <h2 className="text-4xl font-heading font-bold text-terra-800 mb-4">
          Preparando os Sabores...
        </h2>
        
        <p className="text-xl text-terra-600 mb-8">
          Selecionando um prato típico do {countryNames[country] || country}
        </p>
        
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-terra-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-spice-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-leaf-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
