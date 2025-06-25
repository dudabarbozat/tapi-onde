import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
interface GameMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
const menuItems = [{
  id: 'how-to-play',
  icon: '❓',
  title: 'Como Jogar',
  description: 'Aprenda as regras do jogo'
}, {
  id: 'about',
  icon: '🧠',
  title: 'Sobre o Jogo',
  description: 'Conheça a história do TapiOnde'
}, {
  id: 'credits',
  icon: '🎨',
  title: 'Créditos',
  description: 'Equipe de desenvolvimento'
}, {
  id: 'language',
  icon: '🌐',
  title: 'Idioma',
  description: 'Alterar idioma do jogo'
}];
export const GameMenu = ({
  isOpen,
  onClose
}: GameMenuProps) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
      <Card className="cyber-menu-card w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-heading font-bold text-white ">
            ☰ MENU
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {menuItems.map((item, index) => <button key={item.id} className="w-full p-4 bg-cyber-purple/20 backdrop-blur-sm border-2 border-cyber-yellow/30 rounded-xl text-left hover:bg-cyber-purple/40 hover:border-cyber-yellow transition-all duration-300 group" style={{
          animationDelay: `${index * 100}ms`
        }}>
              <div className="flex items-center gap-4">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <div>
                  <h4 className="text-lg font-heading font-bold text-white pixel-glow">
                    {item.title}
                  </h4>
                  <p className="text-sm text-white/70 font-body">
                    {item.description}
                  </p>
                </div>
              </div>
            </button>)}
          
          <div className="pt-4 border-t border-cyber-yellow/30">
            <Button onClick={onClose} className="w-full cyber-neon-button font-heading">
              FECHAR MENU
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};