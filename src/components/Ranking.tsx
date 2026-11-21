import { useState } from 'react';
import { limparRanking, lerRanking } from '@/utils/ranking';

/** Melhores partidas jogadas neste aparelho. */
export const Ranking = () => {
  const [recordes, setRecordes] = useState(lerRanking);
  if (!recordes.length) return null;

  const limpar = () => {
    if (!window.confirm('Apagar o ranking deste aparelho?')) return;
    limparRanking();
    setRecordes([]);
  };

  return (
    <section aria-labelledby="titulo-ranking" className="painel mt-12 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="titulo-ranking" className="text-2xl">
          🏅 Ranking deste aparelho
        </h2>
        <button type="button" onClick={limpar} className="text-sm font-semibold text-stone-600 underline underline-offset-4 hover:text-red-700">
          Limpar ranking
        </button>
      </div>
      <p className="mt-1 text-sm text-stone-600">Fica guardado só neste navegador. Ordenado pelo aproveitamento.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] text-left">
          <thead>
            <tr className="border-b-2 border-stone-200 text-sm text-stone-600">
              <th className="py-2 pr-2 font-semibold">#</th>
              <th className="py-2 pr-2 font-semibold">Nome</th>
              <th className="py-2 pr-2 font-semibold">Destino</th>
              <th className="py-2 pr-2 text-right font-semibold">Pontos</th>
              <th className="py-2 text-right font-semibold">Acertos</th>
            </tr>
          </thead>
          <tbody>
            {recordes.slice(0, 10).map((r, i) => (
              <tr key={r.data + r.nome} className="border-b border-stone-100">
                <td className="py-2 pr-2 font-bold">{i + 1}º</td>
                <td className="py-2 pr-2 font-semibold">{r.nome}</td>
                <td className="py-2 pr-2 text-stone-700">{r.destino}</td>
                <td className="py-2 pr-2 text-right tabular-nums">
                  {r.pontos.toLocaleString('pt-BR')} <span className="text-sm text-stone-500">({Math.round((100 * r.pontos) / r.maximo)}%)</span>
                </td>
                <td className="py-2 text-right tabular-nums">
                  {r.acertos}/{r.pratos}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
