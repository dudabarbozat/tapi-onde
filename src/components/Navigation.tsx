import { Home } from 'lucide-react';
import { arquivoPublico } from '@/data/pratos';

interface NavigationProps {
  onHome: () => void;
}

export const Navigation = ({ onHome }: NavigationProps) => (
  <header className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-4">
    <button type="button" onClick={onHome} className="flex items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
      <img src={arquivoPublico('img/logo.png')} alt="" className="h-12 w-12" />
      <span className="text-xl font-bold text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>TapiOnde</span>
    </button>
    <button
      type="button"
      onClick={onHome}
      className="inline-flex items-center gap-2 rounded-lg border border-green-600/50 bg-green-800/80 px-4 py-2 text-white hover:bg-green-700/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}
    >
      <Home size={18} aria-hidden="true" />
      Início
    </button>
  </header>
);
