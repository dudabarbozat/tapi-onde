import { useCallback, useEffect, useState } from 'react';
import { CountrySelection } from '@/components/CountrySelection';
import { Contagem } from '@/components/Contagem';
import { Cronometro } from '@/components/Cronometro';
import { FaixaProjeto } from '@/components/FaixaProjeto';
import { GameMap } from '@/components/GameMap';
import { IngredientsDisplay } from '@/components/IngredientsDisplay';
import { Navigation } from '@/components/Navigation';
import { ResultScreen } from '@/components/ResultScreen';
import { Vez } from '@/components/Vez';
import { Volta } from '@/components/Volta';
import { paisPorCodigo, porPais } from '@/data/countries';
import type { Marcacao } from '@/utils/estados';
import { calculateDistance, pontuar, PONTOS_MAXIMOS_POR_PRATO, type ResultadoRodada } from '@/utils/gameLogic';
import { montarFila, montarPlacar, nomeDestino, type Configuracao, type Vez as VezDaFila } from '@/utils/partida';
import { salvarNoRanking } from '@/utils/ranking';
import type { TipoVolta } from '@/utils/volta';

const CHAVE_NOME = 'tapionde-nome';

type Fase = 'inicio' | 'contagem' | 'vez' | 'ingredientes' | 'mapa' | 'resultado' | 'volta';

const lerNome = () => {
  try {
    return localStorage.getItem(CHAVE_NOME) ?? '';
  } catch {
    return '';
  }
};

const fraseDeInicio = (config: Configuracao) => {
  const [primeiro] = config.jogadores;
  if (config.destino.tipo === 'pais') {
    const pais = paisPorCodigo(config.destino.codigo)?.pais ?? '';
    return `${primeiro ? `${primeiro}, a sua viagem` : 'A sua viagem'} ${porPais(pais)} vai começar`;
  }
  return `${config.jogadores.length} jogadores · ${nomeDestino(config.destino)} · ${primeiro} começa`;
};

const App = () => {
  const [fase, setFase] = useState<Fase>('inicio');
  const [nomeSozinho, setNomeSozinho] = useState(lerNome);
  const [config, setConfig] = useState<Configuracao | null>(null);
  // Volta pela América Latina: Desafio do Dia ou volta livre. A chave reinicia o modo ao trocar.
  const [volta, setVolta] = useState<{ tipo: TipoVolta; chave: number }>({ tipo: 'dia', chave: 0 });
  const [fila, setFila] = useState<VezDaFila[]>([]);
  const [indice, setIndice] = useState(0);
  const [historico, setHistorico] = useState<ResultadoRodada[]>([]);
  // Cronômetro: corre das pistas até a confirmação de cada prato.
  const [inicioRodada, setInicioRodada] = useState<number | null>(null);
  const [tempoAcumulado, setTempoAcumulado] = useState(0);

  const jogadores = config?.jogadores ?? [];
  const emGrupo = jogadores.length > 1;
  const vez = fila[indice];
  const resultado = historico[indice];
  const ultima = indice >= fila.length - 1;
  const progresso = emGrupo
    ? { rotulo: 'Rodada', atual: Math.floor(indice / jogadores.length) + 1, total: config?.rodadas ?? 1 }
    : { rotulo: 'Prato', atual: indice + 1, total: fila.length };
  const jogadorDaVez = emGrupo && vez ? jogadores[vez.jogador] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [fase, indice]);

  const comecar = (nova: Configuracao) => {
    if (nova.jogadores.length === 1) {
      setNomeSozinho(nova.jogadores[0]);
      try {
        localStorage.setItem(CHAVE_NOME, nova.jogadores[0]);
      } catch {
        /* armazenamento indisponível: o nome vale só nesta visita */
      }
    }
    setConfig(nova);
    setFila(montarFila(nova.destino, nova.jogadores.length, nova.rodadas));
    setIndice(0);
    setHistorico([]);
    setTempoAcumulado(0);
    setInicioRodada(null);
    setFase('contagem');
  };

  const iniciarRodada = useCallback(() => {
    setInicioRodada(Date.now());
    setFase('ingredientes');
  }, []);

  const confirmarPalpite = (m: Marcacao) => {
    if (!vez || !config) return;
    const { prato } = vez;
    const ms = inicioRodada === null ? 0 : Date.now() - inicioRodada;
    const distancia = calculateDistance(m.lat, m.lng, prato.latitude, prato.longitude);
    // Sem divisões internas (Porto Rico, Guiana Francesa), só vale a distância.
    const unica = paisPorCodigo(prato.codigoPais)?.divisaoUnica;
    const acertou = distancia <= 50 || (!unica && m.estado === prato.estado);
    const novo: ResultadoRodada = { prato, jogador: vez.jogador, marcacao: m, distancia, acertou, ...pontuar(acertou, distancia, ms / 1000), ms };
    const completo = [...historico, novo];
    setHistorico(completo);
    setTempoAcumulado((t) => t + ms);
    setInicioRodada(null);
    setFase('resultado');

    if (ultima) {
      const destino = nomeDestino(config.destino);
      const data = new Date().toISOString();
      salvarNoRanking(
        montarPlacar(config.jogadores.map((n) => n || 'Sem nome'), completo).map((l) => ({
          nome: l.nome,
          destino,
          pontos: l.pontos,
          maximo: l.pratos * PONTOS_MAXIMOS_POR_PRATO,
          acertos: l.acertos,
          pratos: l.pratos,
          ms: l.ms,
          data,
        })),
      );
    }
  };

  const proximaRodada = () => {
    setIndice((i) => i + 1);
    if (emGrupo) {
      setFase('vez');
    } else {
      iniciarRodada();
    }
  };

  const comecarVolta = (tipo: TipoVolta) => {
    setVolta((v) => ({ tipo, chave: v.chave + 1 }));
    setFase('volta');
  };

  const voltarAoInicio = () => {
    setFase('inicio');
    setConfig(null);
    setFila([]);
    setInicioRodada(null);
  };

  const emPartida = fase === 'ingredientes' || fase === 'mapa' || fase === 'resultado';
  const paisDaVez = vez?.prato.codigoPais ?? (config?.destino.tipo === 'pais' ? config.destino.codigo : null);
  const bandeira = config?.destino.tipo === 'pais' ? paisPorCodigo(config.destino.codigo)?.bandeira : undefined;
  // Em grupo, o tempo exibido é o da vez atual; sozinho, o da partida inteira.
  const acumuladoExibido = emGrupo ? 0 : tempoAcumulado;

  return (
    <div className="min-h-screen">
      {/* A apresentação do projeto só na página inicial: durante o jogo, a tela é do mapa. */}
      {fase === 'inicio' && <FaixaProjeto />}
      {fase !== 'inicio' && (
        <Navigation
          pais={paisDaVez}
          jogador={jogadorDaVez}
          onHome={voltarAoInicio}
          cronometro={emPartida ? <Cronometro acumulado={fase === 'resultado' && emGrupo ? (resultado?.ms ?? 0) : acumuladoExibido} inicio={inicioRodada} /> : undefined}
        />
      )}

      {fase === 'inicio' && <CountrySelection nomeInicial={nomeSozinho} onComecar={comecar} onVolta={comecarVolta} />}
      {fase === 'volta' && <Volta key={volta.chave} tipo={volta.tipo} nome={nomeSozinho} onLivre={() => comecarVolta('livre')} onSair={voltarAoInicio} />}
      {fase === 'contagem' && config && <Contagem bandeira={bandeira} frase={fraseDeInicio(config)} onFim={iniciarRodada} />}
      {fase === 'vez' && jogadorDaVez && (
        <Vez jogador={jogadorDaVez} rodada={progresso.atual} totalRodadas={progresso.total} onComecar={iniciarRodada} />
      )}
      {fase === 'ingredientes' && vez && (
        <IngredientsDisplay recipe={vez.prato} progresso={progresso} jogador={jogadorDaVez} onContinue={() => setFase('mapa')} />
      )}
      {fase === 'mapa' && vez && <GameMap key={vez.prato.id} recipe={vez.prato} progresso={progresso} onGuess={confirmarPalpite} />}
      {fase === 'resultado' && resultado && (
        <ResultScreen
          key={resultado.prato.id}
          resultado={resultado}
          historico={historico}
          progresso={progresso}
          jogadores={jogadores}
          proximo={emGrupo && !ultima ? jogadores[fila[indice + 1].jogador] : undefined}
          isLastRound={ultima}
          onNextRound={proximaRodada}
          onRestart={voltarAoInicio}
        />
      )}
    </div>
  );
};

export default App;
