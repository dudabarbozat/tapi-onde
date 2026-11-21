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

export const calculateScore = (distance: number): number => {
  if (distance <= 50) return 1000;
  if (distance <= 100) return 800;
  if (distance <= 200) return 600;
  if (distance <= 500) return 400;
  if (distance <= 1000) return 200;
  return 100;
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
