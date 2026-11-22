import { useState } from 'react';
import { arquivoPublico, CATEGORIA } from '@/data/pratos';
import { paisPorCodigo } from '@/data/countries';
import { Progresso, type ProgressoProps } from '@/components/Progresso';
import { Placar, Podio } from '@/components/Placar';
import { montarPlacar } from '@/utils/partida';
import { MapaEstados } from '@/components/MapaEstados';
import { BarraInferior } from '@/components/BarraInferior';
import { formatDistance, formatTempoExtenso, PONTOS_MAXIMOS_POR_PRATO, type ResultadoRodada } from '@/utils/gameLogic';

interface ResultScreenProps {
  resultado: ResultadoRodada;
  historico: ResultadoRodada[];
  progresso: ProgressoProps;
  /** Um nome no modo sozinho (pode ser vazio); dois ou mais em grupo. */
  jogadores: string[];
  /** Quem joga a seguir, no modo em grupo. */
  proximo?: string;
  isLastRound: boolean;
  onNextRound: () => void;
  onRestart: () => void;
}

const desempenho = (r: ResultadoRodada, divisao: string) => {
  if (r.acertou) return { emoji: '🎯', texto: `Acertou ${divisao}!`, cor: 'text-green-800' };
  if (r.distancia <= 200) return { emoji: '👏', texto: 'Foi pertinho!', cor: 'text-blue-800' };
  if (r.distancia <= 500) return { emoji: '👍', texto: 'Bom palpite!', cor: 'text-blue-800' };
  if (r.distancia <= 1000) return { emoji: '🤔', texto: 'Quase lá', cor: 'text-amber-800' };
  return { emoji: '🧭', texto: 'Foi longe!', cor: 'text-red-800' };
};

const Resumo = ({ historico, nome }: { historico: ResultadoRodada[]; nome: string }) => {
  const pontos = historico.reduce((s, r) => s + r.total, 0);
  const tempo = historico.reduce((s, r) => s + r.ms, 0);
  const acertos = historico.filter((r) => r.acertou).length;

  return (
    <section className="mt-8 rounded-2xl bg-green-950 p-5 text-white sm:p-6" aria-labelledby="titulo-resumo">
      <h3 id="titulo-resumo" className="text-center text-2xl">
        🏆 {nome ? `Parabéns, ${nome}!` : 'Viagem completa!'}
      </h3>
      <p className="mt-2 text-center font-titulo text-4xl font-bold text-yellow-300">{pontos.toLocaleString('pt-BR')} pontos</p>
      <p className="mt-1 text-center text-green-100">
        de {(historico.length * PONTOS_MAXIMOS_POR_PRATO).toLocaleString('pt-BR')} possíveis · {acertos} de {historico.length} lugares certos · {formatTempoExtenso(tempo)}
      </p>
      <table className="mt-5 w-full text-left text-sm sm:text-base">
        <thead>
          <tr className="border-b border-green-700 text-green-200">
            <th className="py-2 font-semibold">Prato</th>
            <th className="py-2 font-semibold">Origem</th>
            <th className="py-2 text-right font-semibold">Pontos</th>
          </tr>
        </thead>
        <tbody>
          {historico.map((r) => (
            <tr key={r.prato.id} className="border-b border-green-800/70">
              <td className="py-2 pr-2 font-semibold">{r.prato.prato}</td>
              <td className="py-2 pr-2 text-green-100">
                {r.acertou ? '✓ ' : ''}
                {r.prato.estado}
              </td>
              <td className="py-2 text-right tabular-nums">{r.total.toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export const ResultScreen = ({ resultado, historico, progresso, jogadores, proximo, isLastRound, onNextRound, onRestart }: ResultScreenProps) => {
  const { prato, marcacao } = resultado;
  const divisao = paisPorCodigo(prato.codigoPais)?.divisao ?? { nome: 'estado', plural: 'estados', feminino: false };
  const unica = paisPorCodigo(prato.codigoPais)?.divisaoUnica;
  const d = desempenho(resultado, unica ? 'em cheio' : `${divisao.feminino ? 'a' : 'o'} ${divisao.nome}`);
  const [fotoOk, setFotoOk] = useState(true);
  const emGrupo = jogadores.length > 1;
  const placar = emGrupo ? montarPlacar(jogadores, historico) : [];

  return (
    <main className="com-barra mx-auto max-w-4xl px-3 py-4 sm:px-4">
      <article className="painel animate-fade-in p-4 sm:p-8">
        <Progresso {...progresso} />

        <header className="mt-5 flex items-center gap-4">
          <span aria-hidden="true" className="text-6xl">
            {d.emoji}
          </span>
          <div>
            {emGrupo && <p className="etiqueta mb-1 bg-blue-100 text-blue-900">👤 {jogadores[resultado.jogador]}</p>}
            <h2 className={`text-3xl sm:text-4xl ${d.cor}`}>{d.texto}</h2>
            <p className="mt-1 text-stone-700">
              {unica ? (
                <>
                  Seu palpite ficou a <b>{formatDistance(resultado.distancia)}</b> da origem.
                </>
              ) : resultado.acertou ? (
                <>
                  Você marcou <b>{marcacao.estado}</b>, o lugar certo.
                </>
              ) : (
                <>
                  Você marcou <b>{marcacao.estado}</b>. O lugar certo era <b>{prato.estado}</b>.
                </>
              )}
            </p>
          </div>
        </header>

        <dl className="mt-5 grid grid-cols-3 gap-2 text-center sm:gap-3">
          <div className="rounded-2xl bg-yellow-100 p-3 sm:p-4">
            <dt className="text-xs font-semibold text-green-950 sm:text-sm">Pontos</dt>
            <dd className="font-titulo text-xl font-bold text-green-950 sm:text-3xl">+{resultado.base}</dd>
          </div>
          <div className="rounded-2xl bg-green-100 p-3 sm:p-4">
            <dt className="text-xs font-semibold text-green-950 sm:text-sm">Rapidez ({formatTempoExtenso(resultado.ms)})</dt>
            <dd className="font-titulo text-xl font-bold text-green-950 sm:text-3xl">+{resultado.bonus}</dd>
          </div>
          {resultado.acertou ? (
            <div className="rounded-2xl bg-green-100 p-3 sm:p-4">
              <dt className="text-xs font-semibold text-green-950 sm:text-sm">Lugar</dt>
              <dd className="font-titulo text-base font-bold leading-tight text-green-900 sm:text-xl">✓ {prato.estado}</dd>
            </div>
          ) : (
            <div className="rounded-2xl bg-blue-50 p-3 sm:p-4">
              <dt className="text-xs font-semibold text-blue-900 sm:text-sm">Distância</dt>
              <dd className="font-titulo text-xl font-bold text-blue-900 sm:text-3xl">{formatDistance(resultado.distancia)}</dd>
            </div>
          )}
        </dl>

        <figure className="mt-6">
          <div className="h-72">
            <MapaEstados
              modo="resultado"
              codigoPais={prato.codigoPais}
              palpite={marcacao}
              origem={{ lat: prato.latitude, lng: prato.longitude, estado: prato.estado, local: prato.local }}
            />
          </div>
          <figcaption className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm font-medium text-stone-700">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-600" />
              Seu palpite
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-600" />
              Origem do prato
            </span>
            {!unica && (
              <span className="flex items-center gap-2">
                <span className="h-3 w-4 rounded-sm bg-green-600" />
                {divisao.nome[0].toUpperCase() + divisao.nome.slice(1)} {divisao.feminino ? 'certa' : 'certo'}
              </span>
            )}
          </figcaption>
        </figure>

        <div className="mt-8">
          <span className="etiqueta">{CATEGORIA[prato.categoria]}</span>
          <h3 className="mt-2 text-3xl sm:text-4xl">{prato.prato}</h3>
          <p className="mt-1 text-lg text-stone-700">
            📍 {prato.local.includes(prato.estado) ? prato.local : `${prato.local} · ${prato.estado}`} · {prato.pais}
          </p>
        </div>

        <div className={`mt-5 grid gap-6 ${fotoOk ? 'md:grid-cols-2' : ''}`}>
        {fotoOk && (
          <figure className="self-start overflow-hidden rounded-2xl border-2 border-stone-200">
            <img src={arquivoPublico(prato.imagem.arquivo)} alt={`Foto de ${prato.prato}`} className="max-h-[24rem] w-full object-cover" onError={() => setFotoOk(false)} />
            <figcaption className="bg-stone-50 px-4 py-2 text-xs text-stone-600">
              Foto: {prato.imagem.autor} ·{' '}
              <a href={prato.imagem.url} target="_blank" rel="noreferrer" className="underline hover:text-stone-900">
                {prato.imagem.licenca}, via Wikimedia Commons
              </a>
            </figcaption>
          </figure>
        )}

        <section className="space-y-5 text-lg leading-relaxed">
          <div>
            <h4 className="text-xl text-blue-900">🌎 Curiosidade</h4>
            <p className="mt-1 text-stone-800">{prato.curiosidade}</p>
          </div>
          <div>
            <h4 className="text-xl text-green-800">👩‍🍳 Como se faz</h4>
            <p className="mt-1 text-stone-800">{prato.comoSeFaz}</p>
          </div>
          <a href={prato.fonte} target="_blank" rel="noreferrer" className="inline-block text-base font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-900">
            Saiba mais sobre o prato ↗
          </a>
        </section>
        </div>

        {emGrupo && !isLastRound && <Placar linhas={placar} atual={jogadores[resultado.jogador]} />}
        {isLastRound && (emGrupo ? <Podio linhas={placar} /> : <Resumo historico={historico} nome={jogadores[0]} />)}

      </article>

      <BarraInferior info={<>{d.emoji} <b>+{resultado.total.toLocaleString('pt-BR')} pontos</b> · {prato.prato}</>}>
        {!isLastRound && (
          <button type="button" onClick={onNextRound} className="botao-principal">
            {proximo ? `Próxima vez: ${proximo} ▶` : 'Próximo prato 🍽️'}
          </button>
        )}
        <button type="button" onClick={onRestart} className={isLastRound ? 'botao-principal' : 'botao-secundario'}>
          {isLastRound ? 'Jogar de novo 🌎' : emGrupo ? 'Sair da partida' : 'Trocar de país 🌎'}
        </button>
      </BarraInferior>
    </main>
  );
};
