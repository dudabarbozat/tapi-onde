import { useRef, useState } from 'react';
import { CalendarDays, Github, Globe2, Play, User, Users } from 'lucide-react';
import { countriesData, GRUPOS, paisPorCodigo, porPais } from '@/data/countries';
import { arquivoPublico } from '@/data/pratos';
import { MapaEscolha } from '@/components/MapaEscolha';
import { Ranking } from '@/components/Ranking';
import { BONUS_MAXIMO } from '@/utils/gameLogic';
import { hoje, lerDesafio, lerSequencia, PRATOS_POR_VOLTA, type TipoVolta } from '@/utils/volta';
import { codigosDoDestino, nomesDosJogadores, paisesJogaveis, pratosDoDestino, PRATOS_SOZINHO, REGIOES, type Configuracao, type Regiao } from '@/utils/partida';

interface CountrySelectionProps {
  nomeInicial: string;
  onComecar: (config: Configuracao) => void;
  onVolta: (tipo: TipoVolta) => void;
}

/** Desafio do Dia e volta livre: o mapa inteiro, começando só pelos ingredientes. */
const CartaoVolta = ({ onVolta }: { onVolta: (tipo: TipoVolta) => void }) => {
  const data = hoje();
  const feitas = lerDesafio(data);
  const sequencia = lerSequencia(data);
  const completo = feitas.length >= PRATOS_POR_VOLTA;
  const pontos = feitas.reduce((s, r) => s + r.pontos, 0);

  return (
    <section aria-labelledby="titulo-volta" className="mb-8 rounded-3xl border-2 border-yellow-300 bg-yellow-50 p-5 text-green-950 sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex-1">
          <p className="etiqueta bg-green-900 text-white">Novo</p>
          <h2 id="titulo-volta" className="mt-2 text-2xl sm:text-3xl">
            🌎 Volta pela América Latina
          </h2>
          <p className="mt-1 text-lg text-stone-800">
            Sem escolher país: só os ingredientes, e o mapa inteiro. Descubra de onde vem cada prato pelo que vai nele. Dica e foto ajudam, mas valem
            menos pontos.
          </p>
          {sequencia.dias > 0 && (
            <p className="mt-2 font-semibold">
              🔥 {sequencia.dias} {sequencia.dias === 1 ? 'dia' : 'dias seguidos'} no Desafio do Dia
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 md:w-72">
          <button type="button" onClick={() => onVolta('dia')} className="botao-principal w-full">
            <CalendarDays size={20} aria-hidden="true" />
            {completo
              ? `Desafio de hoje: ${pontos.toLocaleString('pt-BR')} pts ✓`
              : feitas.length
                ? `Continuar o desafio (${feitas.length} de ${PRATOS_POR_VOLTA})`
                : 'Desafio do Dia'}
          </button>
          <button type="button" onClick={() => onVolta('livre')} className="botao-secundario w-full">
            <Globe2 size={20} aria-hidden="true" />
            Volta livre
          </button>
          <p className="text-center text-sm text-stone-700">Desafio do Dia: os mesmos 5 pratos para a turma toda.</p>
        </div>
      </div>
    </section>
  );
};

type Modo = 'sozinho' | 'grupo';

const PASSOS = [
  { icone: '🥘', titulo: 'Leia as pistas', texto: 'Veja os ingredientes do prato e uma dica sobre a sua história.' },
  { icone: '📍', titulo: 'Toque no estado', texto: 'Escolha no mapa o estado, a província ou a região onde o prato nasceu.' },
  { icone: '⏱️', titulo: 'Seja rápido', texto: `Acertou o lugar? Quanto mais rápido, maior o bônus: até ${BONUS_MAXIMO} pontos por prato.` },
];

const campo =
  'rounded-xl border-2 border-stone-300 px-4 py-2.5 text-lg text-green-950 placeholder:text-stone-500 focus:border-blue-600 focus:outline-none';

const Opcao = ({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    aria-pressed={ativo}
    onClick={onClick}
    className={`rounded-xl border-2 px-4 py-2 font-semibold transition ${ativo ? 'border-green-900 bg-green-100 text-green-950' : 'border-stone-200 hover:border-green-900'}`}
  >
    {children}
  </button>
);

export const CountrySelection = ({ nomeInicial, onComecar, onVolta }: CountrySelectionProps) => {
  const [modo, setModo] = useState<Modo>('sozinho');
  const [destaque, setDestaque] = useState<string | null>(null);
  const botaoComecar = useRef<HTMLButtonElement>(null);

  // Sozinho
  const [nome, setNome] = useState(nomeInicial);
  const [escolhido, setEscolhido] = useState<string | null>(null);
  const pais = escolhido ? paisPorCodigo(escolhido) : undefined;

  // Em grupo
  const [quantos, setQuantos] = useState(2);
  const [nomes, setNomes] = useState<string[]>(Array(6).fill(''));
  const [regiao, setRegiao] = useState<Regiao>('america-latina');
  const [rodadas, setRodadas] = useState(3);
  const disponiveis = pratosDoDestino({ tipo: 'regiao', regiao }).length;
  const cabe = quantos * rodadas <= disponiveis;

  const escolherPeloMapa = (codigo: string) => {
    if (modo === 'grupo') return;
    setEscolhido(codigo);
    // No celular o botão fica abaixo do mapa: leva a pessoa até ele.
    if (window.matchMedia('(max-width: 1023px)').matches) {
      setTimeout(() => botaoComecar.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }
  };

  const comecar = (e: React.FormEvent) => {
    e.preventDefault();
    if (modo === 'sozinho' && escolhido) {
      onComecar({ jogadores: [nome.trim()], destino: { tipo: 'pais', codigo: escolhido }, rodadas: PRATOS_SOZINHO });
    } else if (modo === 'grupo' && cabe) {
      onComecar({ jogadores: nomesDosJogadores(nomes.slice(0, quantos)), destino: { tipo: 'regiao', regiao }, rodadas });
    }
  };

  const escolhidos = modo === 'grupo' ? codigosDoDestino({ tipo: 'regiao', regiao }).filter((c) => paisesJogaveis.includes(c)) : escolhido ? [escolhido] : [];

  return (
    <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:pt-10">
      <header className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <h1 className="flex-none">
          <img src={arquivoPublico('img/logo.png')} alt="TapiOnde" className="h-32 w-32 sm:h-40 sm:w-40" />
        </h1>
        <div>
          <p className="font-titulo text-3xl font-bold leading-tight sm:text-4xl">De onde é este prato?</p>
          <p className="mt-2 max-w-2xl text-lg text-green-50">
            Um jogo de geografia pela comida da América Latina: leia as pistas, descubra o estado de origem e conheça pratos
            típicos de {paisesJogaveis.length} países. Jogue sozinho ou com a turma.
          </p>
        </div>
      </header>

      <CartaoVolta onVolta={onVolta} />

      <form onSubmit={comecar} aria-labelledby="titulo-escolha" className="painel grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.25fr_1fr]">
        <div className="h-[420px] sm:h-[600px] lg:h-auto lg:min-h-[720px]">
          <MapaEscolha destaque={destaque} escolhidos={escolhidos} onDestaque={setDestaque} onEscolher={escolherPeloMapa} />
        </div>

        <div className="flex flex-col">
          <h2 id="titulo-escolha" className="text-2xl sm:text-3xl">
            Prepare a sua viagem
          </h2>

          <div role="group" aria-label="Modo de jogo" className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-stone-100 p-1">
            {(
              [
                ['sozinho', 'Sozinho', User],
                ['grupo', 'Em grupo', Users],
              ] as const
            ).map(([valor, rotulo, Icone]) => (
              <button
                key={valor}
                type="button"
                aria-pressed={modo === valor}
                onClick={() => setModo(valor)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl py-2.5 font-titulo font-bold transition ${
                  modo === valor ? 'bg-white text-green-950 shadow' : 'text-stone-600 hover:text-green-950'
                }`}
              >
                <Icone size={18} aria-hidden="true" />
                {rotulo}
              </button>
            ))}
          </div>

          {modo === 'sozinho' ? (
            <>
              <label htmlFor="nome" className="mt-5 font-titulo text-lg font-bold">
                1. Qual é o seu nome?
              </label>
              <input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                maxLength={20}
                autoComplete="given-name"
                placeholder="Escreva aqui (opcional)"
                className={`mt-2 ${campo}`}
              />

              <fieldset className="mt-5">
                <legend className="font-titulo text-lg font-bold">2. Escolha um país no mapa ou na lista</legend>
                {GRUPOS.map((grupo) => (
                  <div key={grupo} className="mt-3">
                    <p className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-stone-600">{grupo}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {countriesData
                        .filter((c) => c.grupo === grupo)
                        .map((c) => {
                          const ativo = escolhido === c.codigo;
                          return (
                            <button
                              key={c.codigo}
                              type="button"
                              disabled={!paisesJogaveis.includes(c.codigo)}
                              title={paisesJogaveis.includes(c.codigo) ? undefined : 'Em breve'}
                              aria-pressed={ativo}
                              onClick={() => setEscolhido(c.codigo)}
                              onMouseEnter={() => setDestaque(c.codigo)}
                              onMouseLeave={() => setDestaque(null)}
                              onFocus={() => setDestaque(c.codigo)}
                              onBlur={() => setDestaque(null)}
                              style={{ borderLeftColor: c.cor }}
                              className={`flex w-full items-center gap-2 rounded-lg border-2 border-l-8 px-2 py-1.5 text-left text-sm font-semibold transition disabled:opacity-40 sm:text-base ${
                                ativo ? 'border-green-900 bg-green-100' : destaque === c.codigo ? 'border-green-900' : 'border-stone-200 hover:border-green-900'
                              }`}
                            >
                              <img src={c.bandeira} alt="" className="h-4 w-6 flex-none rounded-sm object-cover ring-1 ring-stone-300" />
                              <span className="leading-tight">{c.pais}</span>
                              {ativo && (
                                <span className="ml-auto text-green-800" aria-hidden="true">
                                  ✓
                                </span>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </fieldset>

              <button ref={botaoComecar} type="submit" disabled={!pais} className="botao-principal mt-6 w-full">
                {pais ? (
                  <>
                    <Play size={20} aria-hidden="true" fill="currentColor" />
                    Começar a viagem {porPais(pais.pais)}
                  </>
                ) : (
                  'Escolha um país para começar'
                )}
              </button>
            </>
          ) : (
            <>
              <p className="mt-4 text-stone-700">Para jogar com a turma no mesmo aparelho: cada um joga na sua vez, sem repetir prato.</p>

              <fieldset className="mt-4">
                <legend className="font-titulo text-lg font-bold">1. Quantos jogadores?</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[2, 3, 4, 5, 6].map((n) => (
                    <Opcao key={n} ativo={quantos === n} onClick={() => setQuantos(n)}>
                      {n}
                    </Opcao>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-5">
                <legend className="font-titulo text-lg font-bold">2. Nomes</legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {Array.from({ length: quantos }, (_, i) => (
                    <input
                      key={i}
                      aria-label={`Nome do jogador ${i + 1}`}
                      value={nomes[i]}
                      maxLength={16}
                      onChange={(e) => setNomes((atual) => atual.map((v, j) => (j === i ? e.target.value : v)))}
                      placeholder={`Jogador ${i + 1}`}
                      className={`min-w-0 ${campo} text-base`}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-5">
                <legend className="font-titulo text-lg font-bold">3. Destino</legend>
                <div className="mt-2 grid gap-2">
                  {(Object.keys(REGIOES) as Regiao[]).map((r) => (
                    <Opcao key={r} ativo={regiao === r} onClick={() => setRegiao(r)}>
                      <span className="flex justify-between gap-2">
                        {REGIOES[r].nome}
                        <span className="font-normal text-stone-600">{pratosDoDestino({ tipo: 'regiao', regiao: r }).length} pratos</span>
                      </span>
                    </Opcao>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-5">
                <legend className="font-titulo text-lg font-bold">4. Pratos por jogador</legend>
                <div className="mt-2 flex gap-2">
                  {[3, 5].map((n) => (
                    <Opcao key={n} ativo={rodadas === n} onClick={() => setRodadas(n)}>
                      {n}
                    </Opcao>
                  ))}
                </div>
              </fieldset>

              {!cabe && (
                <p className="mt-4 rounded-xl bg-amber-50 px-4 py-2 text-amber-900">
                  Esse destino tem só {disponiveis} pratos. Escolha menos jogadores, menos pratos ou um destino maior.
                </p>
              )}

              <button ref={botaoComecar} type="submit" disabled={!cabe} className="botao-principal mt-6 w-full">
                <Play size={20} aria-hidden="true" fill="currentColor" />
                Começar a partida
              </button>
            </>
          )}
        </div>
      </form>

      <Ranking />

      <section aria-labelledby="titulo-como-jogar" className="mt-12">
        <h2 id="titulo-como-jogar" className="mb-5 text-center text-2xl sm:text-3xl">
          Como jogar
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="painel flex gap-4 p-5">
              <span aria-hidden="true" className="grid h-10 w-10 flex-none place-items-center rounded-full bg-yellow-400 font-titulo text-lg font-bold text-green-950">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg">
                  <span aria-hidden="true">{p.icone} </span>
                  {p.titulo}
                </h3>
                <p className="mt-1 text-stone-700">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="titulo-escola" className="mt-12 rounded-3xl border-2 border-green-600 bg-green-950 p-6 sm:p-8">
        <h2 id="titulo-escola" className="text-2xl">
          Para usar na escola
        </h2>
        <ul className="mt-3 grid gap-2 text-green-50 sm:grid-cols-2">
          <li>✔ Funciona no navegador, no computador ou no celular.</li>
          <li>✔ Sem cadastro e sem anúncios. Nada sai do aparelho.</li>
          <li>✔ Modo em grupo: até 6 jogadores no mesmo computador ou projetor.</li>
          <li>✔ Ensina os estados e as províncias de {paisesJogaveis.length} países, e cada prato traz a fonte.</li>
        </ul>
        <a
          href="https://github.com/dudabarbozat/tapi-onde"
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 font-semibold text-yellow-300 underline underline-offset-4 hover:text-yellow-200"
        >
          <Github size={18} aria-hidden="true" />
          Código aberto no GitHub
        </a>
      </section>

      <footer className="mt-10 text-center text-sm text-green-100">Fotos: Wikimedia Commons · Mapas: Natural Earth</footer>
    </main>
  );
};
