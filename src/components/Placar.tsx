import { formatTempoExtenso } from '@/utils/gameLogic';
import type { Linha } from '@/utils/partida';

const MEDALHAS = ['🥇', '🥈', '🥉'];

/** Placar durante a partida em grupo. */
export const Placar = ({ linhas, atual }: { linhas: Linha[]; atual?: string }) => (
  <section className="mt-8 rounded-2xl border-2 border-stone-200 p-4" aria-labelledby="titulo-placar">
    <h3 id="titulo-placar" className="text-lg">
      📊 Placar
    </h3>
    <ol className="mt-2 divide-y divide-stone-200">
      {linhas.map((l, i) => (
        <li key={l.nome + i} className={`flex items-center justify-between py-2 ${l.nome === atual ? 'font-bold text-green-900' : 'text-stone-800'}`}>
          <span>
            {i + 1}º {l.nome}
          </span>
          <span className="tabular-nums">{l.pontos.toLocaleString('pt-BR')}</span>
        </li>
      ))}
    </ol>
  </section>
);

/** Fim da partida em grupo. */
export const Podio = ({ linhas }: { linhas: Linha[] }) => (
  <section className="mt-8 rounded-2xl bg-green-950 p-5 text-white sm:p-6" aria-labelledby="titulo-podio">
    <h3 id="titulo-podio" className="text-center text-2xl">
      🏆 {linhas[0]?.nome} venceu!
    </h3>
    <ol className="mt-5 space-y-2">
      {linhas.map((l, i) => (
        <li key={l.nome + i} className={`flex items-center gap-3 rounded-xl px-4 py-3 ${i === 0 ? 'bg-yellow-300 text-green-950' : 'bg-green-900'}`}>
          <span className="w-8 text-2xl" aria-hidden="true">
            {MEDALHAS[i] ?? `${i + 1}º`}
          </span>
          <span className="flex-1">
            <span className="block font-titulo text-lg font-bold">{l.nome}</span>
            <span className={`block text-sm ${i === 0 ? 'text-green-900' : 'text-green-100'}`}>
              {l.acertos} de {l.pratos} lugares certos · {formatTempoExtenso(l.ms)}
            </span>
          </span>
          <span className="font-titulo text-xl font-bold tabular-nums">{l.pontos.toLocaleString('pt-BR')}</span>
        </li>
      ))}
    </ol>
  </section>
);
