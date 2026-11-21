import dados from './pratos.json';

export type Categoria = 'prato-principal' | 'sobremesa' | 'bebida' | 'aperitivo';

export interface Prato {
  id: string;
  prato: string;
  pais: string;
  codigoPais: string;
  local: string;
  regiao: string;
  /** Cidade de origem, quando a fonte documenta uma cidade específica (base dos níveis futuros). */
  cidade: string | null;
  /** Estado, província ou departamento onde fica a origem (calculado a partir das coordenadas). */
  estado: string;
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

export const CATEGORIA: Record<Categoria, string> = {
  'prato-principal': 'Prato principal',
  sobremesa: 'Sobremesa',
  bebida: 'Bebida',
  aperitivo: 'Petisco',
};
