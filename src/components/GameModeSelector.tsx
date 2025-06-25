import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { countriesData } from '@/data/countries';
interface GameModeSelectorProps {
  selectedCountry: string;
  selectedMode: string | null;
  onModeSelect: (mode: string) => void;
  onStartGame: () => void;
}
const gameModes = [{
  id: 'random',
  icon: '🌍',
  title: 'Aleatório',
  description: 'O jogo escolhe qualquer região do país'
}, {
  id: 'regions',
  icon: '🗺️',
  title: 'Regiões',
  description: 'Jogador escolhe uma macroregião'
}, {
  id: 'capitals',
  icon: '🏙️',
  title: 'Capitais',
  description: 'Baseado nas capitais do país'
}, {
  id: 'traditions',
  icon: '🎭',
  title: 'Tradições Locais',
  description: 'Baseado em festas, ingredientes ou lendas'
}];
export const GameModeSelector = ({
  selectedCountry,
  selectedMode,
  onModeSelect,
  onStartGame
}: GameModeSelectorProps) => {
  const getCountryName = (countryCode: string): string => {
    const countryData = countriesData.find(c => c.codigo.toUpperCase() === countryCode.toUpperCase());
    return countryData?.pais || countryCode;
  };
  return <div className="w-full max-w-4xl animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-heading font-bold text-white  mb-4">
          🗂️ Modo de Jogo
        </h2>
        <p className="text-xl text-white/90 font-body">
          País selecionado: <span className="text-cyber-yellow font-bold">{getCountryName(selectedCountry)}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {gameModes.map((mode, index) => <Card key={mode.id} className={`cyber-mode-card cursor-pointer group transition-all duration-300 ${selectedMode === mode.id ? 'ring-4 ring-cyber-green shadow-2xl scale-105' : ''}`} onClick={() => onModeSelect(mode.id)} style={{
        animationDelay: `${index * 150}ms`
      }}>
            <CardContent className="p-6 text-center bg-cyber-purple">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {mode.icon}
              </div>
              <h3 className="text-2xl font-heading font-bold text-white  mb-3">
                {mode.title}
              </h3>
              <p className="text-white/80 font-body leading-relaxed">
                {mode.description}
              </p>
            </CardContent>
          </Card>)}
      </div>

      {selectedMode && <div className="text-center animate-fade-in">
          <Button onClick={onStartGame} className="cyber-start-button text-2xl px-12 py-6 font-heading font-black animate-neon-pulse">
            <span className="flex items-center gap-4">
              ▶️ COMEÇAR JOGO
            </span>
          </Button>
        </div>}
    </div>;
};