import type { LatLngBoundsExpression, LatLngTuple, Direction } from 'leaflet';

export interface CountryData {
  pais: string;
  codigo: string;
  bandeira: string;
  /** Cor do país no mapa de escolha, tirada da bandeira. Vizinhos nunca repetem cor. */
  cor: string;
  /** Onde o nome aparece no mapa de escolha. */
  rotulo: LatLngTuple;
  direcaoRotulo?: Direction;
  /** Recorte inicial do mapa do palpite: [[sul, oeste], [norte, leste]]. */
  limites: LatLngBoundsExpression;
}

const bandeira = (codigo: string) => `https://flagcdn.com/w160/${codigo}.png`;

export const countriesData: CountryData[] = [
  { pais: 'México', codigo: 'mx', bandeira: bandeira('mx'), cor: '#006847', rotulo: [24, -103], limites: [[14.5, -118.4], [32.7, -86.7]] },
  { pais: 'Colômbia', codigo: 'co', bandeira: bandeira('co'), cor: '#fcd116', rotulo: [2.5, -73.5], limites: [[-4.2, -79.1], [12.5, -66.9]] },
  { pais: 'Venezuela', codigo: 've', bandeira: bandeira('ve'), cor: '#cf142b', rotulo: [8, -65], limites: [[0.6, -73.4], [12.2, -59.8]] },
  { pais: 'Equador', codigo: 'ec', bandeira: bandeira('ec'), cor: '#034ea2', rotulo: [-1.5, -81], direcaoRotulo: 'left', limites: [[-5, -81.1], [1.5, -75.2]] },
  { pais: 'Peru', codigo: 'pe', bandeira: bandeira('pe'), cor: '#d91023', rotulo: [-9.5, -75], limites: [[-18.4, -81.4], [0, -68.7]] },
  { pais: 'Brasil', codigo: 'br', bandeira: bandeira('br'), cor: '#009c3b', rotulo: [-10, -52], limites: [[-33.8, -74], [5.3, -34.7]] },
  { pais: 'Bolívia', codigo: 'bo', bandeira: bandeira('bo'), cor: '#f2a900', rotulo: [-17, -64.5], limites: [[-22.9, -69.7], [-9.7, -57.5]] },
  { pais: 'Chile', codigo: 'cl', bandeira: bandeira('cl'), cor: '#0039a6', rotulo: [-31, -72], direcaoRotulo: 'left', limites: [[-56, -75.7], [-17.5, -66.4]] },
  { pais: 'Argentina', codigo: 'ar', bandeira: bandeira('ar'), cor: '#74acdf', rotulo: [-36, -65.5], limites: [[-55.1, -73.6], [-21.8, -53.6]] },
  { pais: 'Uruguai', codigo: 'uy', bandeira: bandeira('uy'), cor: '#1e3a8a', rotulo: [-32.8, -54], direcaoRotulo: 'right', limites: [[-35, -58.5], [-30.1, -53.1]] },
];

export const paisPorCodigo = (codigo: string) =>
  countriesData.find((c) => c.codigo.toUpperCase() === codigo.toUpperCase());

/** "do Brasil", "da Argentina"… */
export const comArtigo = (pais: string) =>
  `${['Argentina', 'Colômbia', 'Venezuela', 'Bolívia'].includes(pais) ? 'da' : 'do'} ${pais}`;
