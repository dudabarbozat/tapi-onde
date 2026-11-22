import { useRef, useState } from 'react';
import { CalendarDays, Github, Globe2, Map as MapaIcone, Play, Search, Users } from 'lucide-react';
import { countriesData, GRUPOS, paisPorCodigo, porPais } from '@/data/countries';
import { arquivoPublico } from '@/data/pratos';
import { MapaEscolha } from '@/components/MapaEscolha';
import { Ranking } from '@/components/Ranking';
import { BONUS_MAXIMO } from '@/utils/gameLogic';
import { codigosDoDestino, nomesDosJogadores, paisesJogaveis, pratosDoDestino, PRATOS_SOZINHO, REGIOES, type Configuracao, type Regiao } from '@/utils/partida';
import { hoje, lerDesafio, lerSequencia, PRATOS_POR_VOLTA, TETO_POR_PISTAS, type TipoVolta } from '@/utils/volta';

interface CountrySelectionProps {
  nomeInicial: string;
  onComecar: (config: Configuracao) => void;
  onVolta: (tipo: TipoVolta) => void;
}

type Modo = 'sozinho' | 'grupo';

const PASSOS = [
  { icone: '🥘', titulo: 'Leia as pistas', texto: 'Comece pelos ingredientes: onde eles crescem, de onde vêm? A dica conta a história do prato.' },
  { icone: '📍', titulo: 'Toque no mapa', texto: 'No Desafio do Dia, em qualquer lugar da América Latina. Viajando por um país, no estado de origem.' },
  { icone: '🏆', titulo: 'Ganhe pontos', texto: `Quanto mais perto, mais pontos. Viajando por um país, a rapidez vale até ${BONUS_MAXIMO} de bônus.` },
];

const campo =
  'rounded-xl border-2 border-stone-300 px-4 py-2.5 text-lg text-green-950 placeholder:text-stone-500 focus:border-blue-600 focus:outline-none';

/** Ignora acentos e maiúsculas na busca ("sao" acha "São Vicente"). */
const normalizar = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

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

// ——— Os três jeitos de jogar ———

const CartaoModo = ({
  icone,
  titulo,
  texto,
  ativo,
  destaque,
  children,
}: {
  icone: React.ReactNode;
  titulo: string;
  texto: string;
  ativo?: boolean;
  destaque?: boolean;
  children: React.ReactNode;
}) => (
  <article
    className={`flex flex-col rounded-3xl border-2 p-5 text-green-950 shadow-xl shadow-green-950/20 transition ${
      destaque ? 'border-yellow-300 bg-yellow-50' : 'border-transparent bg-white'
    } ${ativo ? 'ring-4 ring-yellow-400' : ''}`}
  >
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-green-900 text-2xl text-white">
        {icone}
      </span>
      <h3 className="text-xl sm:text-2xl">{titulo}</h3>
    </div>
    <p className="mt-3 flex-1 text-stone-700">{texto}</p>
    <div className="mt-4 flex flex-col gap-2">{children}</div>
  </article>
);

export const CountrySelection = ({ nomeInicial, onComecar, onVolta }: CountrySelectionProps) => {
  // Nada aberto de início: a pessoa escolhe o jeito de jogar e só então vê o passo seguinte.
  const [modo, setModo] = useState<Modo | null>(null);
  const [destaque, setDestaque] = useState<string | null>(null);
  const preparo = useRef<HTMLFormElement>(null);
  const botaoComecar = useRef<HTMLButtonElement>(null);

  // Desafio do Dia
  const data = hoje();
  const feitas = lerDesafio(data);
  const sequencia = lerSequencia(data);
  const completo = feitas.length >= PRATOS_POR_VOLTA;
  const pontosHoje = feitas.reduce((s, r) => s + r.pontos, 0);

  // Sozinho
  const [nome, setNome] = useState(nomeInicial);
  const [escolhido, setEscolhido] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const pais = escolhido ? paisPorCodigo(escolhido) : undefined;

  // Em grupo
  const [quantos, setQuantos] = useState(2);
  const [nomes, setNomes] = useState<string[]>(Array(6).fill(''));
  const [regiao, setRegiao] = useState<Regiao>('america-latina');
  const [rodadas, setRodadas] = useState(3);
  const disponiveis = pratosDoDestino({ tipo: 'regiao', regiao }).length;
  const cabe = quantos * rodadas <= disponiveis;

  const abrir = (m: Modo) => {
    setModo(m);
    setTimeout(() => preparo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const escolher = (codigo: string) => {
    setEscolhido(codigo);
    // No celular o botão fica abaixo do mapa: leva a pessoa até ele.
    if (window.matchMedia('(max-width: 1023px)').matches) {
      setTimeout(() => botaoComecar.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }
  };

  const escolherPeloMapa = (codigo: string) => {
    if (modo === 'grupo') return;
    escolher(codigo);
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
  const termo = normalizar(busca.trim());
  const encontrados = countriesData.filter((c) => !termo || normalizar(c.pais).includes(termo));

  return (
    <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:pt-8">
      <header className="mb-6 flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-5 sm:text-left">
        <h1 className="flex-none">
          <img src={arquivoPublico('img/logo.png')} alt="TapiOnde" className="h-24 w-24 sm:h-32 sm:w-32" />
        </h1>
        <div>
          <p className="font-titulo text-3xl font-bold leading-tight sm:text-4xl">De onde é este prato?</p>
          <p className="mt-2 max-w-2xl text-lg text-green-50">
            Descubra a América Latina pela comida: leia os ingredientes, toque no mapa e conheça pratos típicos de {paisesJogaveis.length} países.
          </p>
        </div>
      </header>

      <h2 className="sr-only">Escolha como jogar</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <CartaoModo
          destaque
          icone="🌎"
          titulo="Desafio do Dia"
          texto={`5 pratos, o mapa inteiro e só os ingredientes. Dica e foto ajudam, mas o prato passa a valer até ${TETO_POR_PISTAS[1]} e ${TETO_POR_PISTAS[2]}. Hoje são os mesmos pratos para a turma toda.`}
        >
          {sequencia.dias > 0 && (
            <p className="font-semibold">
              🔥 {sequencia.dias} {sequencia.dias === 1 ? 'dia' : 'dias seguidos'}
            </p>
          )}
          <button type="button" onClick={() => onVolta('dia')} className="botao-principal w-full">
            <CalendarDays size={20} aria-hidden="true" />
            {completo
              ? `Hoje: ${pontosHoje.toLocaleString('pt-BR')} pts ✓`
              : feitas.length
                ? `Continuar (${feitas.length} de ${PRATOS_POR_VOLTA})`
                : 'Jogar o desafio'}
          </button>
          <button type="button" onClick={() => onVolta('livre')} className="botao-secundario w-full py-2 text-base">
            <Globe2 size={18} aria-hidden="true" />
            Volta livre (treino)
          </button>
        </CartaoModo>

        <CartaoModo
          ativo={modo === 'sozinho'}
          icone={<MapaIcone size={24} />}
          titulo="Viajar por um país"
          texto="Escolha um país e descubra em qual estado, província ou região nasceu cada prato. Com cronômetro e bônus de rapidez."
        >
          <button type="button" onClick={() => abrir('sozinho')} className="botao-secundario w-full">
            <Play size={18} aria-hidden="true" />
            Escolher o país
          </button>
        </CartaoModo>

        <CartaoModo
          ativo={modo === 'grupo'}
          icone={<Users size={24} />}
          titulo="Jogar com a turma"
          texto="De 2 a 6 jogadores no mesmo computador ou projetor, cada um na sua vez, sem repetir prato. Placar e pódio no final."
        >
          <button type="button" onClick={() => abrir('grupo')} className="botao-secundario w-full">
            <Users size={18} aria-hidden="true" />
            Montar a partida
          </button>
        </CartaoModo>
      </div>

      {modo && (
        <form
          ref={preparo}
          onSubmit={comecar}
          aria-labelledby="titulo-escolha"
          className="painel mt-6 grid scroll-mt-4 animate-fade-in gap-6 p-4 sm:p-6 lg:grid-cols-[1.25fr_1fr]"
        >
          <div className="h-[380px] sm:h-[560px] lg:h-auto lg:min-h-[640px]">
            <MapaEscolha destaque={destaque} escolhidos={escolhidos} onDestaque={setDestaque} onEscolher={escolherPeloMapa} />
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="titulo-escolha" className="text-2xl sm:text-3xl">
                {modo === 'sozinho' ? 'Viajar por um país' : 'Jogar com a turma'}
              </h2>
              <button type="button" onClick={() => setModo(modo === 'sozinho' ? 'grupo' : 'sozinho')} className="text-sm font-semibold text-blue-700 underline underline-offset-4">
                {modo === 'sozinho' ? 'Prefere jogar em grupo?' : 'Prefere jogar sozinho?'}
              </button>
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
                  <legend className="font-titulo text-lg font-bold">2. Toque num país no mapa ou procure aqui</legend>
                  <div className="relative mt-2">
                    <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                    <input
                      type="search"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      placeholder="Procurar país"
                      aria-label="Procurar país"
                      className={`w-full pl-10 ${campo}`}
                    />
                  </div>
                  <div className="mt-3 max-h-72 overflow-y-auto rounded-xl border-2 border-stone-100 p-2">
                    {GRUPOS.map((grupo) => {
                      const doGrupo = encontrados.filter((c) => c.grupo === grupo);
                      if (!doGrupo.length) return null;
                      return (
                        <div key={grupo} className="mb-2">
                          <p className="mb-1 px-1 text-xs font-semibold uppercase tracking-wide text-stone-600">{grupo}</p>
                          <div className="grid grid-cols-2 gap-1">
                            {doGrupo.map((c) => {
                              const ativo = escolhido === c.codigo;
                              const jogavel = paisesJogaveis.includes(c.codigo);
                              return (
                                <button
                                  key={c.codigo}
                                  type="button"
                                  disabled={!jogavel}
                                  title={jogavel ? undefined : 'Em breve'}
                                  aria-pressed={ativo}
                                  onClick={() => escolher(c.codigo)}
                                  onMouseEnter={() => setDestaque(c.codigo)}
                                  onMouseLeave={() => setDestaque(null)}
                                  onFocus={() => setDestaque(c.codigo)}
                                  onBlur={() => setDestaque(null)}
                                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-semibold transition disabled:opacity-40 ${
                                    ativo ? 'bg-green-900 text-white' : destaque === c.codigo ? 'bg-green-100' : 'hover:bg-green-50'
                                  }`}
                                >
                                  <img src={c.bandeira} alt="" className="h-4 w-6 flex-none rounded-sm object-cover ring-1 ring-stone-300" />
                                  <span className="leading-tight">{c.pais}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {!encontrados.length && <p className="p-2 text-stone-600">Nenhum país com esse nome.</p>}
                  </div>
                </fieldset>

                <button ref={botaoComecar} type="submit" disabled={!pais} className="botao-principal mt-5 w-full">
                  {pais ? (
                    <>
                      <img src={pais.bandeira} alt="" className="h-5 w-7 rounded-sm object-cover ring-1 ring-green-950/20" />
                      Começar a viagem {porPais(pais.pais)}
                    </>
                  ) : (
                    'Escolha um país para começar'
                  )}
                </button>
              </>
            ) : (
              <>
                <p className="mt-4 text-stone-700">Cada um joga na sua vez, sem repetir prato.</p>

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
      )}

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
          <li>✔ Desafio do Dia: a turma toda joga os mesmos 5 pratos e compara o resultado.</li>
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
