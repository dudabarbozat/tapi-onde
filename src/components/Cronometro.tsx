import { useEffect, useState } from 'react';
import { formatTempo } from '@/utils/gameLogic';

interface CronometroProps {
  /** Tempo das rodadas já terminadas. */
  acumulado: number;
  /** Quando a rodada atual começou; null com o relógio parado. */
  inicio: number | null;
}

export const Cronometro = ({ acumulado, inicio }: CronometroProps) => {
  const [agora, setAgora] = useState(() => Date.now());

  useEffect(() => {
    if (inicio === null) return;
    const t = setInterval(() => setAgora(Date.now()), 250);
    return () => clearInterval(t);
  }, [inicio]);

  const total = acumulado + (inicio === null ? 0 : Math.max(0, agora - inicio));

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-950/70 px-3 py-1.5 font-titulo font-bold tabular-nums" aria-label={`Tempo: ${formatTempo(total)}`}>
      <span aria-hidden="true">⏱️</span>
      {formatTempo(total)}
    </span>
  );
};
