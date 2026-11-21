import type { LatLngTuple } from 'leaflet';

export type Grupo = 'América do Sul' | 'América Central' | 'Caribe';

/** Como o país chama as suas divisões internas: "estado", "província"… */
export interface Divisao {
  nome: string;
  plural: string;
  feminino: boolean;
}

export interface CountryData {
  pais: string;
  codigo: string;
  grupo: Grupo;
  bandeira: string;
  /** Cor do país no mapa de escolha, tirada da bandeira. Vizinhos nunca repetem cor. */
  cor: string;
  /** Onde o nome aparece no mapa de escolha. */
  rotulo: LatLngTuple;
  /** Países pequenos só mostram o nome no mapa de escolha quando destacados. */
  pequeno?: boolean;
  divisao: Divisao;
}

const ESTADO: Divisao = { nome: 'estado', plural: 'estados', feminino: false };
const PROVINCIA: Divisao = { nome: 'província', plural: 'províncias', feminino: true };
const REGIAO: Divisao = { nome: 'região', plural: 'regiões', feminino: true };
const DEPARTAMENTO: Divisao = { nome: 'departamento', plural: 'departamentos', feminino: false };

const bandeira = (codigo: string) => `https://flagcdn.com/w160/${codigo}.png`;

const pais = (pais: string, codigo: string, grupo: Grupo, cor: string, rotulo: LatLngTuple, divisao: Divisao, pequeno = false): CountryData => ({
  pais,
  codigo,
  grupo,
  bandeira: bandeira(codigo),
  cor,
  rotulo,
  divisao,
  pequeno,
});

export const countriesData: CountryData[] = [
  pais('Argentina', 'ar', 'América do Sul', '#74acdf', [-36, -65.5], PROVINCIA),
  pais('Bolívia', 'bo', 'América do Sul', '#f2a900', [-17, -64.5], DEPARTAMENTO),
  pais('Brasil', 'br', 'América do Sul', '#009c3b', [-10, -52], ESTADO),
  pais('Chile', 'cl', 'América do Sul', '#0039a6', [-31, -74.5], REGIAO),
  pais('Colômbia', 'co', 'América do Sul', '#fcd116', [2.5, -73.5], DEPARTAMENTO),
  pais('Equador', 'ec', 'América do Sul', '#034ea2', [-1.5, -84], PROVINCIA),
  pais('Paraguai', 'py', 'América do Sul', '#d52b1e', [-23.3, -58.2], DEPARTAMENTO),
  pais('Peru', 'pe', 'América do Sul', '#d91023', [-9.5, -75], REGIAO),
  pais('Uruguai', 'uy', 'América do Sul', '#1e3a8a', [-32.8, -51.5], DEPARTAMENTO),
  pais('Venezuela', 've', 'América do Sul', '#cf142b', [8, -65], ESTADO),
  pais('Costa Rica', 'cr', 'América Central', '#ce1126', [8.4, -87.2], PROVINCIA, true),
  pais('El Salvador', 'sv', 'América Central', '#e8b100', [12.4, -91.5], DEPARTAMENTO, true),
  pais('Guatemala', 'gt', 'América Central', '#4997d0', [14.6, -94.6], DEPARTAMENTO, true),
  pais('Honduras', 'hn', 'América Central', '#0b3d91', [16.9, -85.6], DEPARTAMENTO, true),
  pais('México', 'mx', 'América Central', '#006847', [24, -103], ESTADO),
  pais('Nicarágua', 'ni', 'América Central', '#4aa3df', [13, -81.4], DEPARTAMENTO, true),
  pais('Panamá', 'pa', 'América Central', '#005293', [7, -78.6], PROVINCIA, true),
  pais('Cuba', 'cu', 'Caribe', '#002a8f', [23.6, -79.5], PROVINCIA),
  pais('Haiti', 'ht', 'Caribe', '#d21034', [17.4, -73], DEPARTAMENTO, true),
  pais('República Dominicana', 'do', 'Caribe', '#002d62', [17.3, -69.6], PROVINCIA, true),
];

export const GRUPOS: Grupo[] = ['América do Sul', 'América Central', 'Caribe'];

export const paisPorCodigo = (codigo: string) =>
  countriesData.find((c) => c.codigo.toUpperCase() === codigo.toUpperCase());

const FEMININOS = ['Argentina', 'Bolívia', 'Colômbia', 'Costa Rica', 'Guatemala', 'Nicarágua', 'Venezuela', 'República Dominicana'];
const SEM_ARTIGO = ['Cuba', 'El Salvador', 'Honduras', 'Haiti'];

/** "do Brasil", "da Argentina", "de Cuba"… */
export const comArtigo = (pais: string) =>
  `${SEM_ARTIGO.includes(pais) ? 'de' : FEMININOS.includes(pais) ? 'da' : 'do'} ${pais}`;

/** "no Brasil", "na Argentina", "em Cuba"… */
export const emPais = (pais: string) =>
  `${SEM_ARTIGO.includes(pais) ? 'em' : FEMININOS.includes(pais) ? 'na' : 'no'} ${pais}`;

/** "no estado", "na província"… */
export const naDivisao = (d: Divisao) => `${d.feminino ? 'na' : 'no'} ${d.nome}`;

/** "pelo Brasil", "pela Argentina", "por Cuba"… */
export const porPais = (pais: string) =>
  `${SEM_ARTIGO.includes(pais) ? 'por' : FEMININOS.includes(pais) ? 'pela' : 'pelo'} ${pais}`;
