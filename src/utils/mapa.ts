import L from 'leaflet';

export const camadaBase = () =>
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });

export const estiloPalpite: L.CircleMarkerOptions = {
  radius: 9,
  color: '#ffffff',
  weight: 3,
  fillColor: '#2563eb',
  fillOpacity: 1,
};

export const estiloResposta: L.CircleMarkerOptions = {
  radius: 9,
  color: '#ffffff',
  weight: 3,
  fillColor: '#dc2626',
  fillOpacity: 1,
};
