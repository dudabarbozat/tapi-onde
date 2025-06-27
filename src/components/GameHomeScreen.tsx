
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GameHomeScreenProps {
  onStartGame: () => void;
  onSignOut: () => void;
  onOpenAdmin: () => void;
}

export const GameHomeScreen = ({ onStartGame, onSignOut, onOpenAdmin }: GameHomeScreenProps) => {
  return (
    <div className="min-h-screen bg-leaf-600 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        {/* Header with Sign Out */}
        <div className="flex justify-end mb-8">
          <div className="flex gap-4">
            <Button
              onClick={onOpenAdmin}
              className="bg-purple-600/80 hover:bg-purple-700/80 text-white border border-purple-500/50"
              style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}
            >
              🔧 Admin
            </Button>
            <Button
              onClick={onSignOut}
              variant="outline"
              className="border-green-600/50 text-green-200 hover:bg-green-700/30"
              style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}
            >
              Sair
            </Button>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mb-16">
          <img 
            src="/lovable-uploads/8bfc5af9-403d-4df4-8dea-debdb93da4e5.png" 
            alt="TapiOnde Logo" 
            className="w-32 h-32 mx-auto mb-8" 
          />
          <h1 className="text-7xl font-bold text-white mb-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            TapiOnde
          </h1>
          <p className="text-2xl text-green-200 mb-4" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
            Descubra os Sabores da América Latina
          </p>
          <p className="text-lg text-green-300" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
            Um jogo gastronômico que desafia seus conhecimentos culinários
          </p>
        </div>

        {/* Game Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="cyber-card text-center transform hover:scale-105 transition-transform duration-300">
            <CardContent className="p-8 bg-green-800/90">
              <div className="text-6xl mb-6">🍽️</div>
              <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Explore Receitas
              </h3>
              <p className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                Descubra pratos tradicionais únicos de cada país da América Latina e aprenda sobre suas origens culturais.
              </p>
            </CardContent>
          </Card>

          <Card className="cyber-card text-center transform hover:scale-105 transition-transform duration-300">
            <CardContent className="p-8 bg-green-800/90">
              <div className="text-6xl mb-6">🗺️</div>
              <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Desafie-se no Mapa
              </h3>
              <p className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                Use suas habilidades de detetive gastronômico para identificar onde cada prato é tradicionalmente preparado.
              </p>
            </CardContent>
          </Card>

          <Card className="cyber-card text-center transform hover:scale-105 transition-transform duration-300">
            <CardContent className="p-8 bg-green-800/90">
              <div className="text-6xl mb-6">🏆</div>
              <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Acumule Pontos
              </h3>
              <p className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                Ganhe pontos baseados na precisão de suas respostas e torne-se um verdadeiro expert em culinária latina.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Start Game Button */}
        <div className="text-center">
          <Button 
            onClick={onStartGame} 
            className="cyber-start-button text-3xl px-16 py-8 transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-4">
              INICIAR JORNADA
              <span className="text-4xl">🚀</span>
            </span>
          </Button>
        </div>

        {/* Creator Info */}
        <div className="text-center mt-16 text-green-200">
          <p className="text-lg" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
            Criado por <span className="font-semibold text-white text-xl">Eduarda Barboza</span>
          </p>
        </div>
      </div>
    </div>
  );
};
