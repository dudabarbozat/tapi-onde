
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, User, LogOut, Menu, X } from 'lucide-react';

interface NavigationProps {
  onHome?: () => void;
  onProfile?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

export const Navigation = ({ 
  onHome, 
  onProfile, 
  onLogout, 
  isAuthenticated = false 
}: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 w-12 h-12 bg-green-800/90 backdrop-blur-sm border border-green-700/50 rounded-xl flex items-center justify-center text-white hover:bg-green-700/90 transition-all duration-300 shadow-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Navigation Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-green-800/95 backdrop-blur-sm border-r border-green-700/50 transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 pt-20">
          {/* Logo */}
          <div className="mb-8 text-center">
            <img 
              src="/lovable-uploads/8bfc5af9-403d-4df4-8dea-debdb93da4e5.png" 
              alt="TapiOnde Logo" 
              className="w-16 h-16 mx-auto mb-2" 
            />
            <h2 className="text-xl font-heading font-bold text-white">TapiOnde</h2>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-3">
            {isAuthenticated && (
              <>
                <Button
                  onClick={() => {
                    onHome?.();
                    setIsOpen(false);
                  }}
                  className="w-full justify-start bg-green-700/50 hover:bg-green-600/70 text-white border-green-600/50"
                  variant="outline"
                >
                  <Home className="mr-3" size={18} />
                  Início
                </Button>
                
                <Button
                  onClick={() => {
                    onProfile?.();
                    setIsOpen(false);
                  }}
                  className="w-full justify-start bg-green-700/50 hover:bg-green-600/70 text-white border-green-600/50"
                  variant="outline"
                >
                  <User className="mr-3" size={18} />
                  Perfil
                </Button>
                
                <Button
                  onClick={() => {
                    onLogout?.();
                    setIsOpen(false);
                  }}
                  className="w-full justify-start bg-red-600/70 hover:bg-red-500/80 text-white border-red-500/50"
                  variant="outline"
                >
                  <LogOut className="mr-3" size={18} />
                  Sair
                </Button>
              </>
            )}
          </nav>

          {/* Creator Info */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-center text-sm text-green-200">
              <p className="mb-1">Criado por</p>
              <p className="font-semibold text-white">Eduarda Barboza</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
};
