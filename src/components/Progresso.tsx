export interface ProgressoProps {
  /** "Prato" no modo sozinho, "Rodada" em grupo. */
  rotulo: string;
  atual: number;
  total: number;
}

export const Progresso = ({ rotulo, atual, total }: ProgressoProps) => (
  <div className="flex items-center gap-3">
    <span className="font-semibold text-stone-700">
      {rotulo} {atual} de {total}
    </span>
    <ol className="flex gap-1.5" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <li key={i} className={`h-2.5 w-6 rounded-full ${i < atual ? 'bg-green-700' : 'bg-stone-200'}`} />
      ))}
    </ol>
  </div>
);
