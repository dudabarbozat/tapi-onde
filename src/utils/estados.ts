import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';

export type Estado = Feature<Polygon | MultiPolygon, { pais: string; nome: string }>;

const cache = new Map<string, Promise<Estado[]>>();

/** Estados, províncias ou departamentos de um país (public/estados/<código>.json). */
export const carregarEstados = (codigo: string): Promise<Estado[]> => {
  const chave = codigo.toLowerCase();
  if (!cache.has(chave)) {
    const pedido = fetch(`${import.meta.env.BASE_URL}estados/${chave}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Mapa de ${chave} indisponível`);
        return r.json() as Promise<FeatureCollection<Polygon | MultiPolygon, { pais: string; nome: string }>>;
      })
      .then((fc) => fc.features);
    pedido.catch(() => cache.delete(chave));
    cache.set(chave, pedido);
  }
  return cache.get(chave)!;
};

/** Onde a pessoa tocou no mapa do palpite. */
export interface Marcacao {
  lat: number;
  lng: number;
  estado: string;
}
