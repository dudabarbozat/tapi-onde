/** Ranking guardado só neste navegador: nada sai do aparelho. */

export interface Recorde {
  nome: string;
  destino: string;
  pontos: number;
  maximo: number;
  acertos: number;
  pratos: number;
  ms: number;
  /** ISO 8601 */
  data: string;
}

const CHAVE = 'tapionde-ranking';
const LIMITE = 50;

/** Ordena pelo aproveitamento, para comparar partidas de tamanhos diferentes. */
const ordenar = (a: Recorde, b: Recorde) => b.pontos / b.maximo - a.pontos / a.maximo || a.ms / a.pratos - b.ms / b.pratos;

export const lerRanking = (): Recorde[] => {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE) ?? '[]');
    return Array.isArray(bruto) ? (bruto as Recorde[]).sort(ordenar) : [];
  } catch {
    return [];
  }
};

export const salvarNoRanking = (novos: Recorde[]) => {
  try {
    const todos = [...lerRanking(), ...novos].sort(ordenar).slice(0, LIMITE);
    localStorage.setItem(CHAVE, JSON.stringify(todos));
  } catch {
    /* armazenamento indisponível: a partida só não entra no ranking */
  }
};

export const limparRanking = () => {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    /* nada a fazer */
  }
};
