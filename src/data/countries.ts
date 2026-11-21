import type { LatLngTuple } from 'leaflet';

export type Grupo = 'América do Sul' | 'América Central' | 'Caribe';

/** Como o país chama as suas divisões internas: "estado", "província"… */
export interface Divisao {
  nome: string;
  plural: string;
  feminino: boolean;
}

/** Artigo do nome do país: "o Brasil", "a Jamaica", "as Bahamas", "Cuba". */
type Artigo = 'o' | 'a' | 'as' | '';

export interface CountryData {
  pais: string;
  codigo: string;
  grupo: Grupo;
  artigo: Artigo;
  bandeira: string;
  /** Cor do país no mapa de escolha, tirada da bandeira. Vizinhos nunca repetem cor. */
  cor: string;
  /** Onde o nome aparece no mapa de escolha. */
  rotulo: LatLngTuple;
  /** Países pequenos só mostram o nome no mapa de escolha quando destacados. */
  pequeno?: boolean;
  /** Ilhas pequenas demais para tocar: ganham um ponto clicável no mapa de escolha. */
  ilha?: boolean;
  /**
   * Sem divisões internas no mapa (Porto Rico, Guiana Francesa):
   * o acerto é chegar a até 50 km da origem.
   */
  divisaoUnica?: boolean;
  divisao: Divisao;
}

const ESTADO: Divisao = { nome: 'estado', plural: 'estados', feminino: false };
const PROVINCIA: Divisao = { nome: 'província', plural: 'províncias', feminino: true };
const REGIAO: Divisao = { nome: 'região', plural: 'regiões', feminino: true };
const DEPARTAMENTO: Divisao = { nome: 'departamento', plural: 'departamentos', feminino: false };
const DISTRITO: Divisao = { nome: 'distrito', plural: 'distritos', feminino: false };
const PAROQUIA: Divisao = { nome: 'paróquia', plural: 'paróquias', feminino: true };
const TERRITORIO: Divisao = { nome: 'lugar', plural: 'lugares', feminino: false };

const bandeira = (codigo: string) => `https://flagcdn.com/w160/${codigo}.png`;

type Extras = Pick<CountryData, 'pequeno' | 'ilha' | 'divisaoUnica'>;

const pais = (
  pais: string,
  codigo: string,
  grupo: Grupo,
  artigo: Artigo,
  cor: string,
  rotulo: LatLngTuple,
  divisao: Divisao,
  extras: Extras = {},
): CountryData => ({ pais, codigo, grupo, artigo, bandeira: bandeira(codigo), cor, rotulo, divisao, ...extras });

const PEQUENO: Extras = { pequeno: true };
const ILHA: Extras = { pequeno: true, ilha: true };

export const countriesData: CountryData[] = [
  pais('Argentina', 'ar', 'América do Sul', 'a', '#74acdf', [-36, -65.5], PROVINCIA),
  pais('Bolívia', 'bo', 'América do Sul', 'a', '#f2a900', [-17, -64.5], DEPARTAMENTO),
  pais('Brasil', 'br', 'América do Sul', 'o', '#009c3b', [-10, -52], ESTADO),
  pais('Chile', 'cl', 'América do Sul', 'o', '#0039a6', [-31, -74.5], REGIAO),
  pais('Colômbia', 'co', 'América do Sul', 'a', '#fcd116', [2.5, -73.5], DEPARTAMENTO),
  pais('Equador', 'ec', 'América do Sul', 'o', '#034ea2', [-1.5, -84], PROVINCIA),
  pais('Guiana', 'gy', 'América do Sul', 'a', '#f7d917', [5, -58.9], REGIAO, PEQUENO),
  pais('Guiana Francesa', 'gf', 'América do Sul', 'a', '#002395', [4, -53.2], TERRITORIO, { pequeno: true, divisaoUnica: true }),
  pais('Paraguai', 'py', 'América do Sul', 'o', '#d52b1e', [-23.3, -58.2], DEPARTAMENTO),
  pais('Peru', 'pe', 'América do Sul', 'o', '#d91023', [-9.5, -75], REGIAO),
  pais('Suriname', 'sr', 'América do Sul', 'o', '#b40a2d', [4, -55.9], DISTRITO, PEQUENO),
  pais('Uruguai', 'uy', 'América do Sul', 'o', '#1e3a8a', [-32.8, -51.5], DEPARTAMENTO),
  pais('Venezuela', 've', 'América do Sul', 'a', '#cf142b', [8, -65], ESTADO),
  pais('Belize', 'bz', 'América Central', '', '#ce1126', [17.2, -88.7], DISTRITO, PEQUENO),
  pais('Costa Rica', 'cr', 'América Central', 'a', '#ce1126', [8.4, -87.2], PROVINCIA, PEQUENO),
  pais('El Salvador', 'sv', 'América Central', '', '#e8b100', [12.4, -91.5], DEPARTAMENTO, PEQUENO),
  pais('Guatemala', 'gt', 'América Central', 'a', '#4997d0', [14.6, -94.6], DEPARTAMENTO, PEQUENO),
  pais('Honduras', 'hn', 'América Central', '', '#0b3d91', [16.9, -85.6], DEPARTAMENTO, PEQUENO),
  pais('México', 'mx', 'América Central', 'o', '#006847', [24, -103], ESTADO),
  pais('Nicarágua', 'ni', 'América Central', 'a', '#4aa3df', [13, -81.4], DEPARTAMENTO, PEQUENO),
  pais('Panamá', 'pa', 'América Central', 'o', '#005293', [7, -78.6], PROVINCIA, PEQUENO),
  pais('Antígua e Barbuda', 'ag', 'Caribe', '', '#0072c6', [17.3, -61.8], PAROQUIA, ILHA),
  pais('Bahamas', 'bs', 'Caribe', 'as', '#00abc9', [24.3, -76.4], DISTRITO, PEQUENO),
  pais('Barbados', 'bb', 'Caribe', '', '#ffc726', [13.17, -59.55], PAROQUIA, ILHA),
  pais('Cuba', 'cu', 'Caribe', '', '#002a8f', [23.6, -79.5], PROVINCIA),
  pais('Dominica', 'dm', 'Caribe', 'a', '#006b3f', [15.42, -61.35], PAROQUIA, ILHA),
  pais('Granada', 'gd', 'Caribe', '', '#ce1126', [12.12, -61.68], PAROQUIA, ILHA),
  pais('Haiti', 'ht', 'Caribe', 'o', '#d21034', [17.4, -73], DEPARTAMENTO, PEQUENO),
  pais('Jamaica', 'jm', 'Caribe', 'a', '#fed100', [18.1, -77.3], PAROQUIA, PEQUENO),
  pais('Porto Rico', 'pr', 'Caribe', '', '#e4002b', [18.22, -66.5], TERRITORIO, { pequeno: true, divisaoUnica: true }),
  pais('República Dominicana', 'do', 'Caribe', 'a', '#002d62', [17.3, -69.6], PROVINCIA, PEQUENO),
  pais('Santa Lúcia', 'lc', 'Caribe', '', '#65cfff', [13.9, -60.97], DISTRITO, ILHA),
  pais('São Cristóvão e Névis', 'kn', 'Caribe', '', '#009e49', [17.3, -62.73], PAROQUIA, ILHA),
  pais('São Vicente e Granadinas', 'vc', 'Caribe', '', '#fcd116', [13.25, -61.2], PAROQUIA, ILHA),
  pais('Trinidad e Tobago', 'tt', 'Caribe', '', '#7f1d1d', [10.45, -61.25], REGIAO, PEQUENO),
];

export const GRUPOS: Grupo[] = ['América do Sul', 'América Central', 'Caribe'];

export const paisPorCodigo = (codigo: string) =>
  countriesData.find((c) => c.codigo.toUpperCase() === codigo.toUpperCase());

const artigoDe = (nome: string): Artigo => countriesData.find((c) => c.pais === nome)?.artigo ?? 'o';

const CONTRACOES: Record<'de' | 'em' | 'por', Record<Artigo, string>> = {
  de: { o: 'do', a: 'da', as: 'das', '': 'de' },
  em: { o: 'no', a: 'na', as: 'nas', '': 'em' },
  por: { o: 'pelo', a: 'pela', as: 'pelas', '': 'por' },
};

/** "do Brasil", "da Argentina", "das Bahamas", "de Cuba"… */
export const comArtigo = (pais: string) => `${CONTRACOES.de[artigoDe(pais)]} ${pais}`;

/** "no Brasil", "na Argentina", "nas Bahamas", "em Cuba"… */
export const emPais = (pais: string) => `${CONTRACOES.em[artigoDe(pais)]} ${pais}`;

/** "pelo Brasil", "pela Argentina", "pelas Bahamas", "por Cuba"… */
export const porPais = (pais: string) => `${CONTRACOES.por[artigoDe(pais)]} ${pais}`;

/** "no estado", "na província"… */
export const naDivisao = (d: Divisao) => `${d.feminino ? 'na' : 'no'} ${d.nome}`;
