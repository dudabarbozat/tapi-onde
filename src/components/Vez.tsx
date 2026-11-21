import { Play } from 'lucide-react';

interface VezProps {
  jogador: string;
  rodada: number;
  totalRodadas: number;
  onComecar: () => void;
}

/** Entre um jogador e outro: hora de passar o aparelho. */
export const Vez = ({ jogador, rodada, totalRodadas, onComecar }: VezProps) => (
  <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
    <p className="font-semibold text-green-100">
      Rodada {rodada} de {totalRodadas}
    </p>
    <h2 className="mt-2 text-5xl sm:text-6xl">
      Vez de <span className="text-yellow-300">{jogador}</span>!
    </h2>
    <p className="mt-3 max-w-md text-lg text-green-50">Passe o aparelho para {jogador}. O cronômetro só começa quando você tocar no botão.</p>
    <button type="button" onClick={onComecar} className="botao-principal mt-8">
      <Play size={20} aria-hidden="true" fill="currentColor" />
      Começar a minha vez
    </button>
  </main>
);
