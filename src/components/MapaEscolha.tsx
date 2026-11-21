import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, Geometry } from 'geojson';
import fronteiras from '@/data/america-latina.json';
import { countriesData, paisPorCodigo } from '@/data/countries';

type Props = { codigo: string | null };

interface MapaEscolhaProps {
  destaque: string | null;
  onDestaque: (codigo: string | null) => void;
  onEscolher: (codigo: string) => void;
}

const VIZINHO: L.PathOptions = { fillColor: '#d6d3d1', fillOpacity: 1, color: '#ffffff', weight: 1 };

const estilo = (codigo: string, ativo: boolean): L.PathOptions => ({
  fillColor: paisPorCodigo(codigo)?.cor,
  fillOpacity: ativo ? 1 : 0.82,
  color: ativo ? '#052e16' : '#ffffff',
  weight: ativo ? 3 : 1.5,
});

/** Mapa da América Latina para escolher o país: cada país jogável com a cor da sua bandeira. */
export const MapaEscolha = ({ destaque, onDestaque, onEscolher }: MapaEscolhaProps) => {
  const container = useRef<HTMLDivElement>(null);
  const camadas = useRef(new Map<string, L.Path>());
  const callbacks = useRef({ onDestaque, onEscolher });
  callbacks.current = { onDestaque, onEscolher };

  useEffect(() => {
    if (!container.current) return;
    const mapa = L.map(container.current, {
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      zoomSnap: 0.1,
      attributionControl: false,
    });
    L.control.attribution({ prefix: false }).addAttribution('Fronteiras: Natural Earth').addTo(mapa);

    const geo = L.geoJSON(fronteiras as FeatureCollection<Geometry, Props>, {
      style: (f) => (f?.properties.codigo ? estilo(f.properties.codigo, false) : VIZINHO),
      onEachFeature: (f, camada) => {
        const codigo = (f.properties as Props).codigo;
        if (!codigo) return;
        const path = camada as L.Path;
        camadas.current.set(codigo, path);
        path.on({
          mouseover: () => callbacks.current.onDestaque(codigo),
          mouseout: () => callbacks.current.onDestaque(null),
          click: () => callbacks.current.onEscolher(codigo),
        });
      },
    }).addTo(mapa);

    for (const c of countriesData) {
      mapa.openTooltip(
        L.tooltip({ permanent: true, direction: c.direcaoRotulo ?? 'center', className: 'rotulo-pais' })
          .setLatLng(c.rotulo)
          .setContent(c.pais),
      );
    }

    const caixa = container.current;
    const enquadrar = () => {
      if (!caixa.clientWidth || !caixa.clientHeight) return;
      mapa.invalidateSize({ animate: false });
      mapa.fitBounds(geo.getBounds(), { padding: [8, 8], animate: false });
    };
    enquadrar();
    const observador = new ResizeObserver(enquadrar);
    observador.observe(caixa);

    const lista = camadas.current;
    return () => {
      observador.disconnect();
      lista.clear();
      mapa.remove();
    };
  }, []);

  useEffect(() => {
    camadas.current.forEach((camada, codigo) => {
      camada.setStyle(estilo(codigo, codigo === destaque));
      if (codigo === destaque) camada.bringToFront();
    });
  }, [destaque]);

  return (
    <div
      ref={container}
      role="img"
      aria-label="Mapa da América Latina com os 10 países do jogo coloridos. Toque em um país para começar, ou use a lista ao lado."
      className="h-full  w-full rounded-2xl bg-oceano"
    />
  );
};
