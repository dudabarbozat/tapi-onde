import type { Prato } from '@/data/pratos';
import type { Marcacao } from '@/utils/estados';

/** Distância em km entre dois pontos (fórmula de haversine). */
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const pontosPorDistancia = (distancia: number): number => {
  if (distancia <= 50) return 1000;
  if (distancia <= 100) return 800;
  if (distancia <= 200) return 600;
  if (distancia <= 500) return 400;
  if (distancia <= 1000) return 200;
  return 100;
};

export const BONUS_MAXIMO = 300;
export const PONTOS_MAXIMOS_POR_PRATO = 1000 + BONUS_MAXIMO;

/**
 * Acertar o estado (ou chegar a até 50 km) vale 1000. Errando, vale a distância.
 * O bônus de rapidez é cheio até 20 s e some aos 90 s, proporcional ao acerto:
 * chutar rápido não compensa.
 */
export const pontuar = (acertouEstado: boolean, distancia: number, segundos: number) => {
  const base = acertouEstado ? 1000 : pontosPorDistancia(distancia);
  const rapidez = Math.min(1, Math.max(0, (90 - segundos) / 70));
  const bonus = Math.round((BONUS_MAXIMO * rapidez * base) / 1000 / 10) * 10;
  return { base, bonus, total: base + bonus };
};

export const formatTempo = (ms: number): string => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export const formatTempoExtenso = (ms: number): string => {
  const s = Math.round(ms / 1000);
  const min = Math.floor(s / 60);
  return min ? `${min} min ${s % 60} s` : `${s} s`;
};

export const formatDistance = (distance: number): string =>
  distance < 1 ? `${Math.round(distance * 1000)} m` : `${Math.round(distance).toLocaleString('pt-BR')} km`;

/** Embaralhamento de Fisher-Yates, sem alterar o array original. */
export const embaralhar = <T,>(itens: T[]): T[] => {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
};

export interface ResultadoRodada {
  prato: Prato;
  /** Índice do jogador (sempre 0 no modo sozinho). */
  jogador: number;
  marcacao: Marcacao;
  distancia: number;
  acertou: boolean;
  base: number;
  bonus: number;
  total: number;
  /** Tempo da rodada, das pistas até a confirmação. */
  ms: number;
}
