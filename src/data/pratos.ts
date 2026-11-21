import dados from './pratos.json';

export type Categoria = 'prato-principal' | 'sobremesa' | 'bebida' | 'aperitivo';

export interface Prato {
  id: string;
  prato: string;
  pais: string;
  codigoPais: string;
  local: string;
  regiao: string;
  latitude: number;
  longitude: number;
  categoria: Categoria;
  dificuldade: 'facil' | 'medio' | 'dificil';
  ingredientes: string[];
  dica: string;
  curiosidade: string;
  comoSeFaz: string;
  fonte: string;
  imagem: { arquivo: string; autor: string; licenca: string; url: string };
}

export const pratos = dados as Prato[];

export const pratosDoPais = (codigoPais: string) => pratos.filter((p) => p.codigoPais === codigoPais.toUpperCase());

/** Caminho de um arquivo de public/ respeitando o base path do GitHub Pages. */
export const arquivoPublico = (caminho: string) => `${import.meta.env.BASE_URL}${caminho}`;
