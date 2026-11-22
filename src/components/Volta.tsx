import { useEffect, useMemo, useState } from 'react';
import { Share2 } from 'lucide-react';
import { arquivoPublico, CATEGORIA, type Prato } from '@/data/pratos';
import { paisPorCodigo } from '@/data/countries';
import { BarraInferior } from '@/components/BarraInferior';
import { MapaContinente } from '@/components/MapaContinente';
import { Progresso } from '@/components/Progresso';
import { calculateDistance, formatDistance } from '@/utils/gameLogic';
import { salvarNoRanking } from '@/utils/ranking';
import {
  completarDesafio,
  guardarDesafio,
  hoje,
  lerDesafio,
  lerSequencia,
  nomeDoPais,
  paisNoPonto,
  PONTOS_MAXIMOS_VOLTA,
  pontuarVolta,
  pratosDoDia,
  pratosLivres,
  PRATOS_POR_VOLTA,
  TETO_POR_PISTAS,
  textoParaCompartilhar,
  type RodadaVolta,
  type Sequencia,
  type TipoVolta,
} from '@/utils/volta';

interface VoltaProps {
  tipo: TipoVolta;
  nome: string;
  onLivre: () => void;
  onSair: () => void;
}

type Ponto = { lat: number; lng: number };

const desempenho = (pontos: number) => {
  if (pontos >= 800) return { emoji: '🎯', texto: 'Na mosca!', cor: 'text-green-800' };
  if (pontos >= 500) return { emoji: '👏', texto: 'Foi pertinho!', cor: 'text-blue-800' };
  if (pontos >= 200) return { emoji: '🤔', texto: 'Mesma região do continente', cor: 'text-amber-800' };
  return { emoji: '🧭', texto: 'Foi longe!', cor: 'text-red-800' };
};

const Bandeira = ({ codigo }: { codigo: string }) => {
  const pais = paisPorCodigo(codigo);
  return pais ? <img src={pais.bandeira} alt="" className="inline h-4 w-6 rounded-sm object-cover ring-1 ring-stone-300" /> : null;
};

// ——— Uma rodada: pistas e mapa ———

const Rodada = ({ prato, numero, onConfirmar }: { prato: Prato; numero: number; onConfirmar: (p: Ponto, pistas: number) => void }) => {
  const [pistas, setPistas] = useState(0);
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const [ponto, setPonto] = useState<Ponto | null>(null);
  // Se a foto não carregar, a pista não conta.
  const pistasValendo = fotoFalhou ? Math.min(pistas, 1) : pistas;
  const teto = TETO_POR_PISTAS[pistasValendo];
  const nomeTocado = ponto ? nomeDoPais(paisNoPonto(ponto.lat, ponto.lng)) : null;

  return (
    <main className="com-barra mx-auto max-w-6xl px-3 py-4 sm:px-4">
      <div className="painel animate-fade-in grid gap-5 p-3 sm:p-5 lg:grid-cols-[1fr_1.4fr]">
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Progresso rotulo="Prato" atual={numero} total={PRATOS_POR_VOLTA} />
            <span className="etiqueta">{CATEGORIA[prato.categoria]}</span>
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl">De onde é este prato?</h2>
          <p className="mt-1 text-stone-700">Pense nos ingredientes: onde eles crescem, de onde vêm? Depois toque no mapa, em qualquer lugar.</p>

          <h3 className="mt-5 text-lg">🌿 Ingredientes</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {prato.ingredientes.map((ingrediente, i) => (
              <li
                key={ingrediente}
                className="animate-fade-in rounded-full border-2 border-green-200 bg-green-50 px-4 py-1.5 font-medium text-green-950"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {ingrediente}
              </li>
            ))}
          </ul>

          {pistas >= 1 && (
            <div className="mt-5 animate-fade-in rounded-2xl border-2 border-yellow-400 bg-yellow-50 p-4">
              <h3 className="text-lg">💡 Dica</h3>
              <p className="mt-1 text-lg leading-relaxed">{prato.dica}</p>
            </div>
          )}
          {pistas >= 2 && !fotoFalhou && (
            <figure className="mt-5 animate-fade-in overflow-hidden rounded-2xl border-2 border-stone-200">
              <img src={arquivoPublico(prato.imagem.arquivo)} alt="Foto do prato" className="max-h-64 w-full object-cover" onError={() => setFotoFalhou(true)} />
            </figure>
          )}
          {fotoFalhou && <p className="mt-3 rounded-xl bg-stone-100 px-4 py-2 text-stone-700">A foto deste prato ainda não está disponível. Essa pista não conta.</p>}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            {pistas === 0 && (
              <button type="button" onClick={() => setPistas(1)} className="botao-secundario flex-1">
                <span className="flex flex-col">
                  <span>💡 Ver dica</span>
                  <span className="text-sm font-normal">o prato passa a valer até {TETO_POR_PISTAS[1]}</span>
                </span>
              </button>
            )}
            {pistas === 1 && (
              <button type="button" onClick={() => setPistas(2)} className="botao-secundario flex-1">
                <span className="flex flex-col">
                  <span>📷 Ver foto do prato</span>
                  <span className="text-sm font-normal">o prato passa a valer até {TETO_POR_PISTAS[2]}</span>
                </span>
              </button>
            )}
          </div>
          <p className="mt-3 text-sm font-semibold text-stone-600">Este prato vale até {teto} pontos.</p>
        </section>

        {/* O mapa ocupa a altura da tela: é aqui que se joga. */}
        <section className="h-[70dvh] min-h-[340px] lg:h-[calc(100dvh-13rem)]">
          <MapaContinente modo="palpite" onMarcar={setPonto} />
        </section>
      </div>

      <BarraInferior
        info={
          ponto ? (
            <>
              Você tocou {nomeTocado ? <b className="text-blue-800">{nomeTocado}</b> : 'fora dos países do jogo'}. Pode trocar antes de confirmar.
            </>
          ) : (
            'Toque no mapa onde o prato nasceu. Use + e −, a rodinha do mouse ou o atalho do Caribe.'
          )
        }
      >
        <button type="button" disabled={!ponto} onClick={() => ponto && onConfirmar(ponto, pistasValendo)} className="botao-principal w-full sm:w-auto">
          Confirmar palpite ✓
        </button>
      </BarraInferior>
    </main>
  );
};

// ——— Resultado de uma rodada ———

const Revelacao = ({ prato, rodada, numero, ultima, onProximo }: { prato: Prato; rodada: RodadaVolta; numero: number; ultima: boolean; onProximo: () => void }) => {
  const [fotoOk, setFotoOk] = useState(true);
  const d = desempenho(rodada.pontos);
  const tocado = paisNoPonto(rodada.lat, rodada.lng);
  const nomeTocado = nomeDoPais(tocado);
  const mesmoPais = tocado?.toUpperCase() === prato.codigoPais;

  return (
    <main className="com-barra mx-auto max-w-4xl px-3 py-4 sm:px-4">
      <article className="painel animate-fade-in p-4 sm:p-8">
        <Progresso rotulo="Prato" atual={numero} total={PRATOS_POR_VOLTA} />

        <header className="mt-5 flex items-center gap-4">
          <span aria-hidden="true" className="text-6xl">
            {d.emoji}
          </span>
          <div>
            <h2 className={`text-3xl sm:text-4xl ${d.cor}`}>{d.texto}</h2>
            <p className="mt-1 text-stone-700">
              {nomeTocado ? (
                <>
                  Você tocou {mesmoPais ? 'no país certo' : 'em'} <b>{nomeTocado}</b>
                  {mesmoPais ? '' : '.'}
                </>
              ) : (
                'Você tocou fora dos países do jogo.'
              )}{' '}
              {!mesmoPais && (
                <>
                  O prato é de <b>{prato.pais}</b>.
                </>
              )}
            </p>
          </div>
        </header>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-2xl bg-yellow-100 p-3 sm:p-4">
            <dt className="text-sm font-semibold text-green-950">Pontos {rodada.pistas > 0 && `(${rodada.pistas === 1 ? 'com dica' : 'com dica e foto'})`}</dt>
            <dd className="font-titulo text-2xl font-bold text-green-950 sm:text-3xl">+{rodada.pontos}</dd>
          </div>
          <div className="rounded-2xl bg-blue-50 p-3 sm:p-4">
            <dt className="text-sm font-semibold text-blue-900">Distância</dt>
            <dd className="font-titulo text-2xl font-bold text-blue-900 sm:text-3xl">{formatDistance(rodada.distancia)}</dd>
          </div>
        </dl>

        <figure className="mt-6">
          <div className="h-72 sm:h-80">
            <MapaContinente modo="resultado" palpite={rodada} origem={{ lat: prato.latitude, lng: prato.longitude, local: prato.local }} />
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
          </figcaption>
        </figure>

        <div className="mt-8">
          <span className="etiqueta">{CATEGORIA[prato.categoria]}</span>
          <h3 className="mt-2 text-3xl sm:text-4xl">{prato.prato}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-lg text-stone-700">
            <Bandeira codigo={prato.codigoPais} /> {prato.local.includes(prato.estado) ? prato.local : `${prato.local} · ${prato.estado}`} · {prato.pais}
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
      </article>

      <BarraInferior info={<>{d.emoji} <b>+{rodada.pontos} pontos</b> · {prato.prato}</>}>
        <button type="button" onClick={onProximo} className="botao-principal">
          {ultima ? 'Ver o resultado da volta 🏆' : 'Próximo prato 🍽️'}
        </button>
      </BarraInferior>
    </main>
  );
};

// ——— Fim da volta ———

const Compartilhar = ({ texto }: { texto: string }) => {
  const [aviso, setAviso] = useState('');

  const compartilhar = async () => {
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ text: texto });
        return;
      }
      await navigator.clipboard.writeText(texto);
      setAviso('Copiado! Cole no grupo da turma.');
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setAviso('Não deu para copiar. Selecione o texto abaixo e copie.');
    }
  };

  return (
    <div className="mt-5">
      <pre className="whitespace-pre-wrap rounded-2xl bg-green-900 p-4 text-left font-sans text-green-50">{texto}</pre>
      <button type="button" onClick={compartilhar} className="botao-principal mt-3 w-full">
        <Share2 size={20} aria-hidden="true" />
        Compartilhar resultado
      </button>
      {aviso && (
        <p role="status" className="mt-2 text-center font-semibold text-yellow-200">
          {aviso}
        </p>
      )}
    </div>
  );
};

const Fim = ({
  tipo,
  data,
  lista,
  rodadas,
  sequencia,
  nome,
  onLivre,
  onSair,
}: {
  tipo: TipoVolta;
  data: string;
  lista: Prato[];
  rodadas: RodadaVolta[];
  sequencia?: Sequencia;
  nome: string;
  onLivre: () => void;
  onSair: () => void;
}) => {
  const total = rodadas.reduce((s, r) => s + r.pontos, 0);
  const texto = textoParaCompartilhar(tipo, data, rodadas, sequencia);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <article className="animate-fade-in rounded-3xl bg-green-950 p-5 text-white sm:p-8">
        <h2 className="text-center text-2xl sm:text-3xl">{tipo === 'dia' ? '🌎 Desafio do Dia completo!' : `🏆 ${nome ? `Parabéns, ${nome}!` : 'Volta completa!'}`}</h2>
        <p className="mt-2 text-center font-titulo text-4xl font-bold text-yellow-300">{total.toLocaleString('pt-BR')} pontos</p>
        <p className="mt-1 text-center text-green-100">de {(rodadas.length * PONTOS_MAXIMOS_VOLTA).toLocaleString('pt-BR')} possíveis</p>
        {sequencia && sequencia.dias > 0 && (
          <p className="mt-3 text-center text-lg font-semibold">
            🔥 {sequencia.dias} {sequencia.dias === 1 ? 'dia' : 'dias seguidos'} · recorde: {sequencia.melhor}
          </p>
        )}

        <table className="mt-5 w-full text-left text-sm sm:text-base">
          <thead>
            <tr className="border-b border-green-700 text-green-200">
              <th className="py-2 font-semibold">Prato</th>
              <th className="py-2 font-semibold">Origem</th>
              <th className="py-2 text-right font-semibold">Pontos</th>
            </tr>
          </thead>
          <tbody>
            {rodadas.map((r) => {
              const prato = lista.find((p) => p.id === r.id);
              return (
                <tr key={r.id} className="border-b border-green-800/70">
                  <td className="py-2 pr-2 font-semibold">{prato?.prato}</td>
                  <td className="py-2 pr-2 text-green-100">
                    {prato && <Bandeira codigo={prato.codigoPais} />} {prato?.pais}
                  </td>
                  <td className="py-2 text-right tabular-nums">{r.pontos.toLocaleString('pt-BR')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Compartilhar texto={texto} />

        {tipo === 'dia' && <p className="mt-5 text-center text-green-100">Amanhã tem 5 pratos novos. Até lá, dá para treinar numa volta livre.</p>}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onLivre} className="botao-secundario flex-1">
            {tipo === 'dia' ? 'Treinar numa volta livre 🌎' : 'Outra volta 🌎'}
          </button>
          <button type="button" onClick={onSair} className="botao-secundario flex-1">
            Voltar ao início
          </button>
        </div>
      </article>
    </main>
  );
};

// ——— O modo inteiro ———

export const Volta = ({ tipo, nome, onLivre, onSair }: VoltaProps) => {
  const data = useMemo(() => hoje(), []);
  const lista = useMemo(() => (tipo === 'dia' ? pratosDoDia(data) : pratosLivres()), [tipo, data]);
  // No Desafio do Dia, continua de onde parou: o progresso fica guardado no aparelho.
  const [rodadas, setRodadas] = useState<RodadaVolta[]>(() => (tipo === 'dia' ? lerDesafio(data) : []));
  const [revelando, setRevelando] = useState(false);
  const [sequencia, setSequencia] = useState<Sequencia | undefined>(() => (tipo === 'dia' ? lerSequencia(data) : undefined));
  // Tempo da volta inteira, para desempatar no ranking.
  const [inicio] = useState(() => Date.now());

  const terminou = rodadas.length >= lista.length && !revelando;
  const indice = revelando ? rodadas.length - 1 : rodadas.length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [indice, revelando]);

  const confirmar = (p: Ponto, pistas: number) => {
    const prato = lista[rodadas.length];
    const distancia = calculateDistance(p.lat, p.lng, prato.latitude, prato.longitude);
    const nova: RodadaVolta = { id: prato.id, lat: p.lat, lng: p.lng, distancia, pistas, pontos: pontuarVolta(distancia, pistas) };
    const todas = [...rodadas, nova];
    const ms = Date.now() - inicio;
    setRodadas(todas);
    setRevelando(true);
    if (tipo === 'dia') guardarDesafio(data, todas);

    if (todas.length === lista.length) {
      if (tipo === 'dia') setSequencia(completarDesafio(data));
      const [, m, d] = data.split('-');
      salvarNoRanking([
        {
          nome: nome || 'Sem nome',
          destino: tipo === 'dia' ? `Desafio do Dia ${d}/${m}` : 'Volta pela América Latina',
          pontos: todas.reduce((s, r) => s + r.pontos, 0),
          maximo: todas.length * PONTOS_MAXIMOS_VOLTA,
          acertos: todas.filter((r) => r.pontos >= 800).length,
          pratos: todas.length,
          ms,
          data: new Date().toISOString(),
        },
      ]);
    }
  };

  const proximo = () => setRevelando(false);

  if (terminou) {
    return <Fim tipo={tipo} data={data} lista={lista} rodadas={rodadas} sequencia={sequencia} nome={nome} onLivre={onLivre} onSair={onSair} />;
  }

  const prato = lista[indice];
  if (revelando) {
    return <Revelacao key={prato.id} prato={prato} rodada={rodadas[indice]} numero={indice + 1} ultima={indice === lista.length - 1} onProximo={proximo} />;
  }
  return <Rodada key={prato.id} prato={prato} numero={indice + 1} onConfirmar={confirmar} />;
};
