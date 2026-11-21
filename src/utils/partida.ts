import { countriesData, paisPorCodigo, type Grupo } from '@/data/countries';
import { pratos, pratosDoPais, type Prato } from '@/data/pratos';
import { embaralhar, type ResultadoRodada } from '@/utils/gameLogic';

export type Regiao = 'america-latina' | 'america-do-sul' | 'central-caribe';

export const REGIOES: Record<Regiao, { nome: string; grupos: Grupo[] }> = {
  'america-latina': { nome: 'Toda a América Latina', grupos: ['América do Sul', 'América Central', 'Caribe'] },
  'america-do-sul': { nome: 'América do Sul', grupos: ['América do Sul'] },
  'central-caribe': { nome: 'América Central e Caribe', grupos: ['América Central', 'Caribe'] },
};

/** De onde saem os pratos: um país (modo sozinho) ou uma região (modo em grupo). */
export type Destino = { tipo: 'pais'; codigo: string } | { tipo: 'regiao'; regiao: Regiao };

export const codigosDoDestino = (d: Destino): string[] =>
  d.tipo === 'pais' ? [d.codigo] : countriesData.filter((c) => REGIOES[d.regiao].grupos.includes(c.grupo)).map((c) => c.codigo);

export const pratosDoDestino = (d: Destino): Prato[] => {
  if (d.tipo === 'pais') return pratosDoPais(d.codigo);
  const codigos = codigosDoDestino(d).map((c) => c.toUpperCase());
  return pratos.filter((p) => codigos.includes(p.codigoPais));
};

export const nomeDestino = (d: Destino) => (d.tipo === 'pais' ? (paisPorCodigo(d.codigo)?.pais ?? d.codigo) : REGIOES[d.regiao].nome);

export interface Vez {
  prato: Prato;
  /** Índice do jogador na lista de jogadores. */
  jogador: number;
}

/**
 * Sorteia os pratos sem repetir e reveza os jogadores:
 * rodada 1 → Ana, Bruno, Caio; rodada 2 → Ana, Bruno, Caio…
 */
export const montarFila = (destino: Destino, jogadores: number, rodadas: number): Vez[] =>
  embaralhar(pratosDoDestino(destino))
    .slice(0, jogadores * rodadas)
    .map((prato, i) => ({ prato, jogador: i % jogadores }));

/** Uma linha do placar: total de cada jogador, do maior para o menor. */
export interface Linha {
  nome: string;
  pontos: number;
  acertos: number;
  pratos: number;
  ms: number;
}

export const montarPlacar = (jogadores: string[], historico: ResultadoRodada[]): Linha[] =>
  jogadores
    .map((nome, i) => {
      const meus = historico.filter((r) => r.jogador === i);
      return {
        nome,
        pontos: meus.reduce((s, r) => s + r.total, 0),
        acertos: meus.filter((r) => r.acertou).length,
        pratos: meus.length,
        ms: meus.reduce((s, r) => s + r.ms, 0),
      };
    })
    .sort((a, b) => b.pontos - a.pontos || a.ms - b.ms);

export interface Configuracao {
  /** Um nome no modo sozinho (pode ser vazio); de 2 a 6 em grupo. */
  jogadores: string[];
  destino: Destino;
  /** Pratos por jogador. */
  rodadas: number;
}

/** Nomes vazios viram "Jogador 2"; nomes repetidos ganham número. */
export const nomesDosJogadores = (digitados: string[]): string[] => {
  const vistos = new Map<string, number>();
  return digitados.map((n, i) => {
    const base = n.trim() || `Jogador ${i + 1}`;
    const vezes = (vistos.get(base) ?? 0) + 1;
    vistos.set(base, vezes);
    return vezes > 1 ? `${base} ${vezes}` : base;
  });
};

/** Pratos de cada partida no modo sozinho. */
export const PRATOS_SOZINHO = 5;

/** Países com pratos suficientes para uma partida; os outros aparecem em cinza. */
export const paisesJogaveis = countriesData.filter((c) => pratosDoPais(c.codigo).length >= PRATOS_SOZINHO).map((c) => c.codigo);
