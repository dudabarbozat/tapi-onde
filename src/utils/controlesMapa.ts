import L from 'leaflet';

/** Caribe: as ilhas pequenas ficam tocáveis com um clique. */
export const LIMITES_CARIBE = L.latLngBounds([9.5, -86], [27, -59]);

export interface Atalho {
  rotulo: string;
  titulo: string;
  limites: () => L.LatLngBounds;
}

/**
 * Botões grandes (bons para o dedo e para o projetor): aproximar, afastar e atalhos de enquadramento,
 * como "ver tudo" ou "Caribe". Substituem o + e − pequenos do Leaflet.
 */
export const adicionarControles = (mapa: L.Map, atalhos: Atalho[], opcoes: { zoom?: boolean } = {}) => {
  const Controle = L.Control.extend({
    onAdd: () => {
      const caixa = L.DomUtil.create('div', 'controles-mapa');
      L.DomEvent.disableClickPropagation(caixa);
      L.DomEvent.disableScrollPropagation(caixa);

      const botao = (texto: string, titulo: string, acao: () => void, classe = '') => {
        const b = L.DomUtil.create('button', `controle-mapa ${classe}`, caixa);
        b.type = 'button';
        b.textContent = texto;
        b.title = titulo;
        b.setAttribute('aria-label', titulo);
        L.DomEvent.on(b, 'click', (e) => {
          L.DomEvent.stop(e);
          acao();
        });
      };

      if (opcoes.zoom !== false) {
        botao('+', 'Aproximar', () => mapa.zoomIn());
        botao('−', 'Afastar', () => mapa.zoomOut());
      }
      for (const a of atalhos) botao(a.rotulo, a.titulo, () => mapa.flyToBounds(a.limites(), { padding: [12, 12], duration: 0.6 }), 'controle-texto');
      return caixa;
    },
  });
  new Controle({ position: 'topright' }).addTo(mapa);
};
