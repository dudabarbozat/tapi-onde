import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon, Position } from 'geojson';
import fronteiras from '@/data/america-latina.json';
import { paisPorCodigo, type Grupo } from '@/data/countries';
import { pratos, type Prato } from '@/data/pratos';
import { embaralhar } from '@/utils/gameLogic';

/**
 * Volta pela América Latina: o mapa inteiro, sem escolher país antes.
 * Começa só com os ingredientes; dica e foto ajudam, mas baixam o máximo do prato.
 */

export type TipoVolta = 'dia' | 'livre';

export const PRATOS_POR_VOLTA = 5;

/** Quanto o prato vale no máximo, conforme as pistas abertas (0 = só ingredientes). */
export const TETO_POR_PISTAS = [1000, 800, 600] as const;
export const PONTOS_MAXIMOS_VOLTA = TETO_POR_PISTAS[0];

export interface RodadaVolta {
  id: string;
  lat: number;
  lng: number;
  distancia: number;
  /** Pistas abertas além dos ingredientes: 0, 1 (dica) ou 2 (dica e foto). */
  pistas: number;
  pontos: number;
}

/** Até 25 km vale tudo; depois cai devagar: ~670 a 300 km, ~280 a 1.000 km, quase nada a 3.000 km. */
export const pontuarVolta = (distancia: number, pistas: number) => {
  const fator = distancia <= 25 ? 1 : Math.exp(-(distancia - 25) / 750);
  return Math.round((TETO_POR_PISTAS[pistas] * fator) / 10) * 10;
};

// ——— Sorteio ———

/** Gerador pseudoaleatório com semente: a mesma data sorteia os mesmos pratos em qualquer aparelho. */
const gerador = (texto: string) => {
  let h = 1779033703 ^ texto.length;
  for (let i = 0; i < texto.length; i++) {
    h = Math.imul(h ^ texto.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const embaralharCom = <T,>(itens: T[], aleatorio: () => number): T[] => {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
};

const ORDEM = { facil: 0, medio: 1, dificil: 2 } as const;

/**
 * 5 pratos de 5 países diferentes: 2 fáceis, 2 médios e 1 difícil, do mais fácil ao mais difícil.
 * O Caribe tem muitos países pequenos (e muitos pratos): no máximo 2 pratos de lá e 1 de ilha pequena,
 * para a volta passar pelo continente todo.
 */
const escolher = (embaralhados: Prato[]): Prato[] => {
  const cotas = { facil: 2, medio: 2, dificil: 1 };
  const porGrupo: Partial<Record<Grupo, number>> = { Caribe: 2 };
  let ilhas = 1;
  const paises = new Set<string>();
  // O mesmo prato existe em mais de um país (rice and beans, aloo pie…): não repete no mesmo dia.
  const nomes = new Set<string>();
  const escolhidos: Prato[] = [];
  for (const p of embaralhados) {
    const pais = paisPorCodigo(p.codigoPais);
    const nome = p.prato.toLowerCase().split(' (')[0];
    if (!pais || paises.has(p.codigoPais) || nomes.has(nome) || cotas[p.dificuldade] === 0) continue;
    if (porGrupo[pais.grupo] === 0 || (pais.ilha && ilhas === 0)) continue;
    cotas[p.dificuldade]--;
    if (porGrupo[pais.grupo] !== undefined) porGrupo[pais.grupo]!--;
    if (pais.ilha) ilhas--;
    paises.add(p.codigoPais);
    nomes.add(nome);
    escolhidos.push(p);
    if (escolhidos.length === PRATOS_POR_VOLTA) break;
  }
  return escolhidos.sort((a, b) => ORDEM[a.dificuldade] - ORDEM[b.dificuldade]);
};

/** Data local no formato 2026-11-22. */
export const hoje = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const pratosDoDia = (data: string) => escolher(embaralharCom(pratos, gerador(`tapionde-${data}`)));

export const pratosLivres = () => escolher(embaralhar(pratos));

// ——— Onde a pessoa tocou ———

type Pais = Feature<Polygon | MultiPolygon, { codigo: string | null }>;
const paises = (fronteiras as FeatureCollection<Geometry, { codigo: string | null }>).features.filter(
  (f): f is Pais => !!f.properties.codigo && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'),
);

const noAnel = (x: number, y: number, anel: Position[]) => {
  let dentro = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const [xi, yi] = anel[i];
    const [xj, yj] = anel[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
};

const noPoligono = (x: number, y: number, p: Position[][]) => noAnel(x, y, p[0]) && !p.slice(1).some((b) => noAnel(x, y, b));

/** Código do país (em minúsculas) onde fica o ponto, ou null se for mar ou país fora do jogo. */
export const paisNoPonto = (lat: number, lng: number): string | null => {
  const f = paises.find((p) =>
    p.geometry.type === 'Polygon' ? noPoligono(lng, lat, p.geometry.coordinates) : p.geometry.coordinates.some((c) => noPoligono(lng, lat, c)),
  );
  return f?.properties.codigo ?? null;
};

export const nomeDoPais = (codigo: string | null) => (codigo ? (paisPorCodigo(codigo)?.pais ?? null) : null);

// ——— Desafio do Dia guardado no aparelho ———

const CHAVE_DIA = 'tapionde-desafio-dia';
const CHAVE_SEQUENCIA = 'tapionde-sequencia';

const ler = <T,>(chave: string): T | null => {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : null;
  } catch {
    return null;
  }
};

const gravar = (chave: string, valor: unknown) => {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* armazenamento indisponível: vale só nesta visita */
  }
};

interface DesafioGuardado {
  data: string;
  rodadas: RodadaVolta[];
}

/** Rodadas já jogadas hoje (para continuar de onde parou ou mostrar o resultado). */
export const lerDesafio = (data: string): RodadaVolta[] => {
  const d = ler<DesafioGuardado>(CHAVE_DIA);
  return d?.data === data && Array.isArray(d.rodadas) ? d.rodadas : [];
};

export const guardarDesafio = (data: string, rodadas: RodadaVolta[]) => gravar(CHAVE_DIA, { data, rodadas });

export interface Sequencia {
  /** Último dia em que o desafio foi completado. */
  ultimo: string;
  dias: number;
  melhor: number;
}

const ontem = (data: string) => {
  const [a, m, d] = data.split('-').map(Number);
  return hoje(new Date(a, m - 1, d - 1));
};

/** Dias seguidos com o desafio completo; zera se pulou um dia. */
export const lerSequencia = (data: string): Sequencia => {
  const s = ler<Sequencia>(CHAVE_SEQUENCIA);
  if (!s) return { ultimo: '', dias: 0, melhor: 0 };
  const viva = s.ultimo === data || s.ultimo === ontem(data);
  return { ...s, dias: viva ? s.dias : 0 };
};

export const completarDesafio = (data: string): Sequencia => {
  const atual = lerSequencia(data);
  if (atual.ultimo === data) return atual;
  const dias = atual.dias + 1;
  const nova = { ultimo: data, dias, melhor: Math.max(atual.melhor, dias) };
  gravar(CHAVE_SEQUENCIA, nova);
  return nova;
};

// ——— Compartilhar ———

const quadrado = (pontos: number) => (pontos >= 800 ? '🟩' : pontos >= 500 ? '🟨' : pontos >= 200 ? '🟧' : '🟥');

export const textoParaCompartilhar = (tipo: TipoVolta, data: string, rodadas: RodadaVolta[], sequencia?: Sequencia) => {
  const total = rodadas.reduce((s, r) => s + r.pontos, 0);
  const [a, m, d] = data.split('-');
  const linhas = [
    tipo === 'dia' ? `TapiOnde 🌎 Desafio do Dia ${d}/${m}/${a}` : 'TapiOnde 🌎 Volta pela América Latina',
    `${rodadas.map((r) => quadrado(r.pontos)).join('')} ${total.toLocaleString('pt-BR')} de ${(rodadas.length * PONTOS_MAXIMOS_VOLTA).toLocaleString('pt-BR')} pontos`,
  ];
  if (sequencia && sequencia.dias > 1) linhas.push(`🔥 ${sequencia.dias} dias seguidos`);
  linhas.push(`${window.location.origin}${import.meta.env.BASE_URL}`);
  return linhas.join('\n');
};
