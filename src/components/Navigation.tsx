import type { ReactNode } from 'react';
import { Home } from 'lucide-react';
import { arquivoPublico } from '@/data/pratos';
import { paisPorCodigo } from '@/data/countries';

interface NavigationProps {
  pais: string | null;
  /** Quem está jogando, no modo em grupo. */
  jogador?: string;
  cronometro?: ReactNode;
  onHome: () => void;
}

export const Navigation = ({ pais, jogador, cronometro, onHome }: NavigationProps) => {
  const dados = pais ? paisPorCodigo(pais) : undefined;

  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 pt-4">
      <button type="button" onClick={onHome} className="flex flex-none items-center gap-2 rounded-xl" aria-label="TapiOnde: voltar ao início">
        <img src={arquivoPublico('img/logo.png')} alt="" className="h-11 w-11" />
        <span className="hidden font-titulo text-xl font-bold sm:inline">TapiOnde</span>
      </button>

      <div className="flex min-w-0 items-center gap-2">
        {dados && (
          <span className={`min-w-0 items-center gap-2 rounded-full bg-green-950/70 px-3 py-1.5 font-semibold ${jogador ? 'hidden sm:inline-flex' : 'inline-flex'}`}>
            <img src={dados.bandeira} alt="" className="h-4 w-6 flex-none rounded-sm object-cover" />
            <span className="truncate">{dados.pais}</span>
          </span>
        )}
        {jogador && (
          <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-yellow-300 px-3 py-1.5 font-semibold text-green-950">
            <span aria-hidden="true">👤</span>
            <span className="truncate">{jogador}</span>
          </span>
        )}
        {cronometro}
      </div>

      <button
        type="button"
        onClick={onHome}
        aria-label="Início"
        className="inline-flex flex-none items-center gap-2 rounded-xl border-2 border-white/70 px-3 py-2 font-semibold hover:bg-white hover:text-green-900 sm:px-4"
      >
        <Home size={18} aria-hidden="true" />
        <span className="hidden sm:inline">Início</span>
      </button>
    </header>
  );
};
