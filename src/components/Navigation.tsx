import { Home } from 'lucide-react';
import { arquivoPublico } from '@/data/pratos';
import { paisPorCodigo } from '@/data/countries';

interface NavigationProps {
  pais: string | null;
  onHome: () => void;
}

export const Navigation = ({ pais, onHome }: NavigationProps) => {
  const dados = pais ? paisPorCodigo(pais) : undefined;

  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 pt-4">
      <button type="button" onClick={onHome} className="flex items-center gap-2 rounded-xl">
        <img src={arquivoPublico('img/logo.png')} alt="" className="h-12 w-12" />
        <span className="font-titulo text-xl font-bold">TapiOnde</span>
      </button>

      {dados && (
        <span className="hidden items-center gap-2 rounded-full bg-green-950/60 px-3 py-1.5 font-semibold sm:inline-flex">
          <img src={dados.bandeira} alt="" className="h-4 w-6 rounded-sm object-cover" />
          {dados.pais}
        </span>
      )}

      <button
        type="button"
        onClick={onHome}
        className="inline-flex items-center gap-2 rounded-xl border-2 border-white/70 px-4 py-2 font-semibold hover:bg-white hover:text-green-900"
      >
        <Home size={18} aria-hidden="true" />
        Início
      </button>
    </header>
  );
};
