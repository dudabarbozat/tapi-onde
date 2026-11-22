import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, Geometry } from 'geojson';
import fronteiras from '@/data/america-latina.json';
import { paisPorCodigo } from '@/data/countries';
import { estiloPalpite, estiloResposta } from '@/utils/mapa';
import { adicionarControles, LIMITES_CARIBE } from '@/utils/controlesMapa';
import { paisNoPonto } from '@/utils/volta';

type Ponto = { lat: number; lng: number };

type Props =
  | { modo: 'palpite'; onMarcar: (p: Ponto) => void }
  | { modo: 'resultado'; palpite: Ponto; origem: Ponto & { local: string } };

const PAIS: L.PathOptions = { fillColor: '#fef9c3', fillOpacity: 1, color: '#57534e', weight: 1 };
const PAIS_DESTAQUE: L.PathOptions = { fillColor: '#fde047', fillOpacity: 1, color: '#052e16', weight: 2 };
const PAIS_ESCOLHIDO: L.PathOptions = { fillColor: '#93c5fd', fillOpacity: 1, color: '#1e3a8a', weight: 2.5 };
const VIZINHO: L.PathOptions = { fillColor: '#e7e5e4', fillOpacity: 1, color: '#ffffff', weight: 1 };

/** América Latina inteira: no palpite, toca-se em qualquer ponto; no resultado, palpite, origem e a linha entre eles. */
export const MapaContinente = (props: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const propsAtuais = useRef(props);
  propsAtuais.current = props;
  const { modo } = props;

  useEffect(() => {
    if (!container.current) return;
    const palpite = modo === 'palpite';
    // A vista inicial vem antes de qualquer camada: sem ela, os pontos quebram o Leaflet.
    const mapa = L.map(container.current, { scrollWheelZoom: palpite, zoomControl: false, zoomSnap: 0.25, attributionControl: false, minZoom: 2 }).setView(
      [-10, -70],
      3,
    );
    L.control.attribution({ prefix: false }).addAttribution('Fronteiras: Natural Earth').addTo(mapa);

    const camadas = new Map<string, L.Path>();
    let escolhido: string | null = null;

    const camada = L.geoJSON(fronteiras as FeatureCollection<Geometry, { codigo: string | null }>, {
      style: (f) => (f?.properties.codigo ? PAIS : VIZINHO),
      onEachFeature: (f, l) => {
        const codigo = f.properties.codigo as string | null;
        const nome = codigo ? paisPorCodigo(codigo)?.pais : undefined;
        if (!codigo || !nome || !palpite) return;
        // O nome do país aparece ao passar o mouse: ajuda a aprender o mapa sem entregar a resposta.
        const path = l as L.Path;
        camadas.set(codigo, path);
        path.bindTooltip(nome, { sticky: true, direction: 'top', className: 'rotulo-estado' });
        path.on({
          mouseover: () => codigo !== escolhido && path.setStyle(PAIS_DESTAQUE),
          mouseout: () => codigo !== escolhido && path.setStyle(PAIS),
        });
      },
    }).addTo(mapa);

    const tudo = camada.getBounds();

    if (palpite) {
      adicionarControles(mapa, [
        { rotulo: '⤢ Ver tudo', titulo: 'Ver a América Latina inteira', limites: () => tudo },
        { rotulo: '🔍 Caribe', titulo: 'Aproximar o Caribe', limites: () => LIMITES_CARIBE },
      ]);
      mapa.fitBounds(tudo, { padding: [8, 8], animate: false });
      let marcador: L.CircleMarker | null = null;
      let rotulo: L.Tooltip | null = null;
      mapa.on('click', (e: L.LeafletMouseEvent) => {
        // Pinta o país tocado (se for um país do jogo) e escreve o nome dele junto do ponto.
        const codigo = paisNoPonto(e.latlng.lat, e.latlng.lng);
        if (escolhido) {
          const anterior = camadas.get(escolhido);
          anterior?.setStyle(PAIS);
          anterior?.bindTooltip(paisPorCodigo(escolhido)?.pais ?? '', { sticky: true, direction: 'top', className: 'rotulo-estado' });
        }
        escolhido = codigo && camadas.has(codigo) ? codigo : null;
        if (escolhido) {
          // O país escolhido já tem o nome fixo junto do ponto: o rótulo de passar o mouse sairia repetido.
          const atual = camadas.get(escolhido);
          atual?.setStyle(PAIS_ESCOLHIDO);
          atual?.unbindTooltip();
        }

        marcador?.remove();
        marcador = L.circleMarker(e.latlng, { ...estiloPalpite, interactive: false }).addTo(mapa);
        rotulo?.remove();
        rotulo = L.tooltip({ permanent: true, direction: 'top', offset: [0, -10], className: 'rotulo-escolhido' })
          .setLatLng(e.latlng)
          .setContent(escolhido ? (paisPorCodigo(escolhido)?.pais ?? '') : 'Fora dos países do jogo')
          .addTo(mapa);

        const atual = propsAtuais.current;
        if (atual.modo === 'palpite') atual.onMarcar({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    } else {
      const atual = propsAtuais.current;
      if (atual.modo === 'resultado') {
        const a = L.latLng(atual.palpite.lat, atual.palpite.lng);
        const b = L.latLng(atual.origem.lat, atual.origem.lng);
        L.polyline([a, b], { color: '#052e16', weight: 3, opacity: 0.8, dashArray: '8 8', interactive: false }).addTo(mapa);
        L.circleMarker(a, estiloPalpite).bindTooltip('Seu palpite').addTo(mapa);
        L.circleMarker(b, estiloResposta).bindTooltip(atual.origem.local, { permanent: true, direction: 'top', offset: [0, -8] }).addTo(mapa);
        const limites = L.latLngBounds([a, b]);
        mapa.fitBounds(limites, { padding: [40, 40], maxZoom: 6, animate: false });
        adicionarControles(mapa, [{ rotulo: '⤢ Ver tudo', titulo: 'Ver o palpite e a origem', limites: () => limites.pad(0.15) }]);
      }
    }

    return () => {
      mapa.remove();
    };
  }, [modo]);

  return (
    <div
      ref={container}
      role="application"
      aria-label={modo === 'palpite' ? 'Mapa da América Latina para marcar o palpite' : 'Mapa com o seu palpite e a origem do prato'}
      className={`h-full w-full rounded-2xl border-2 border-stone-200 bg-oceano ${modo === 'palpite' ? 'cursor-crosshair' : ''}`}
    />
  );
};

