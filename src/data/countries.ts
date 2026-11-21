import type { LatLngBoundsExpression } from 'leaflet';

export interface CountryData {
  pais: string;
  codigo: string;
  bandeira: string;
  /** Recorte inicial do mapa: [[sul, oeste], [norte, leste]]. */
  limites: LatLngBoundsExpression;
}

const bandeira = (codigo: string) => `https://flagcdn.com/w320/${codigo}.png`;

export const countriesData: CountryData[] = [
  { pais: 'Brasil', codigo: 'br', bandeira: bandeira('br'), limites: [[-33.8, -74], [5.3, -34.7]] },
  { pais: 'Argentina', codigo: 'ar', bandeira: bandeira('ar'), limites: [[-55.1, -73.6], [-21.8, -53.6]] },
  { pais: 'México', codigo: 'mx', bandeira: bandeira('mx'), limites: [[14.5, -118.4], [32.7, -86.7]] },
  { pais: 'Colômbia', codigo: 'co', bandeira: bandeira('co'), limites: [[-4.2, -79.1], [12.5, -66.9]] },
  { pais: 'Peru', codigo: 'pe', bandeira: bandeira('pe'), limites: [[-18.4, -81.4], [0, -68.7]] },
  { pais: 'Chile', codigo: 'cl', bandeira: bandeira('cl'), limites: [[-56, -75.7], [-17.5, -66.4]] },
  { pais: 'Equador', codigo: 'ec', bandeira: bandeira('ec'), limites: [[-5, -81.1], [1.5, -75.2]] },
  { pais: 'Venezuela', codigo: 've', bandeira: bandeira('ve'), limites: [[0.6, -73.4], [12.2, -59.8]] },
  { pais: 'Bolívia', codigo: 'bo', bandeira: bandeira('bo'), limites: [[-22.9, -69.7], [-9.7, -57.5]] },
  { pais: 'Uruguai', codigo: 'uy', bandeira: bandeira('uy'), limites: [[-35, -58.5], [-30.1, -53.1]] },
];

export const paisPorCodigo = (codigo: string) =>
  countriesData.find((c) => c.codigo.toUpperCase() === codigo.toUpperCase());
