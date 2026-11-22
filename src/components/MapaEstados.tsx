import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, Geometry } from 'geojson';
import fronteiras from '@/data/america-latina.json';
import { paisPorCodigo } from '@/data/countries';
import { carregarEstados, type Estado, type Marcacao } from '@/utils/estados';
import { estiloPalpite, estiloResposta } from '@/utils/mapa';
import { adicionarControles } from '@/utils/controlesMapa';

type Props =
  | { modo: 'palpite'; codigoPais: string; onMarcar: (m: Marcacao) => void; /** Toque fora do país. */ onFora: () => void }
  | { modo: 'resultado'; codigoPais: string; palpite: Marcacao; origem: { lat: number; lng: number; estado: string; local: string } };

const AZUL = '#2563eb';
const VERDE = '#16a34a';

const contexto = () =>
  L.geoJSON(fronteiras as FeatureCollection<Geometry>, {
    interactive: false,
    style: { fillColor: '#e7e5e4', fillOpacity: 1, color: '#ffffff', weight: 1 },
  });

/** Mapa do país dividido em estados (ou províncias, regiões, departamentos). */
export const MapaEstados = (props: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const propsAtuais = useRef(props);
  propsAtuais.current = props;
  const [situacao, setSituacao] = useState<'carregando' | 'pronto' | 'erro'>('carregando');
  const { codigoPais, modo } = props;

  useEffect(() => {
    if (!container.current) return;
    const cor = paisPorCodigo(codigoPais)?.cor ?? '#16a34a';
    const palpite = modo === 'palpite';
    // A vista inicial faz o Leaflet desenhar cada camada assim que ela entra no mapa;
    // sem ela, mudar o estilo de uma área antes do enquadramento quebra.
    // No palpite, a rodinha do mouse aproxima: o mapa é o centro da tela.
    const mapa = L.map(container.current, { scrollWheelZoom: palpite, zoomControl: false, zoomSnap: 0.25, attributionControl: false }).setView([-10, -70], 3);
    L.control.attribution({ prefix: false }).addAttribution('Fronteiras: Natural Earth').addTo(mapa);
    contexto().addTo(mapa);
    let cancelado = false;

    // No resultado o país fica neutro, para o azul (palpite) e o verde (lugar certo) se destacarem.
    const normal: L.PathOptions = { fillColor: palpite ? cor : '#f5f5f4', fillOpacity: palpite ? 0.3 : 1, color: '#292524', weight: 1, opacity: 0.6 };

    carregarEstados(codigoPais)
      .then((estados: Estado[]) => {
        if (cancelado) return;
        let escolhido: L.Path | null = null;
        let marcador: L.CircleMarker | null = null;
        let rotulo: L.Tooltip | null = null;
        const camadas = new Map<string, L.Path>();

        const camada = L.geoJSON(estados, {
          interactive: palpite,
          style: () => normal,
          onEachFeature: (f: Estado, l) => {
            const path = l as L.Path;
            camadas.set(f.properties.nome, path);
            if (!palpite) return;
            path.bindTooltip(f.properties.nome, { sticky: true, className: 'rotulo-estado', direction: 'top' });
            path.on({
              mouseover: () => path !== escolhido && path.setStyle({ fillOpacity: 0.55 }),
              mouseout: () => path !== escolhido && path.setStyle(normal),
              click: (e: L.LeafletMouseEvent) => {
                L.DomEvent.stopPropagation(e);
                escolhido?.setStyle(normal);
                escolhido = path;
                path.setStyle({ fillColor: AZUL, fillOpacity: 0.6, color: '#1e3a8a', weight: 2.5, opacity: 1 });
                path.bringToFront();
                marcador?.remove();
                marcador = L.circleMarker(e.latlng, { ...estiloPalpite, interactive: false }).addTo(mapa);
                // O nome do lugar escolhido fica fixo no mapa, para conferir antes de confirmar.
                rotulo?.remove();
                rotulo = L.tooltip({ permanent: true, direction: 'top', offset: [0, -10], className: 'rotulo-escolhido' })
                  .setLatLng(e.latlng)
                  .setContent(f.properties.nome)
                  .addTo(mapa);
                const atual = propsAtuais.current;
                if (atual.modo === 'palpite') atual.onMarcar({ lat: e.latlng.lat, lng: e.latlng.lng, estado: f.properties.nome });
              },
            });
          },
        }).addTo(mapa);

        if (palpite) {
          adicionarControles(mapa, [{ rotulo: '⤢ Ver tudo', titulo: 'Ver o país inteiro', limites: () => camada.getBounds() }]);
          mapa.fitBounds(camada.getBounds(), { padding: [12, 12], animate: false });
          mapa.on('click', () => {
            const atual = propsAtuais.current;
            if (atual.modo === 'palpite') atual.onFora();
          });
        } else {
          const atual = propsAtuais.current;
          if (atual.modo !== 'resultado') return;
          const { palpite: p, origem: o } = atual;
          // Sem divisões internas, pintar o território inteiro não diz nada: ficam só os pontos e a linha.
          const unica = paisPorCodigo(codigoPais)?.divisaoUnica;
          const certo = unica ? undefined : camadas.get(o.estado);
          const marcado = unica ? undefined : camadas.get(p.estado);
          if (marcado && marcado !== certo) marcado.setStyle({ fillColor: AZUL, fillOpacity: 0.45, color: '#1e3a8a', weight: 2 });
          certo?.setStyle({ fillColor: VERDE, fillOpacity: 0.6, color: '#14532d', weight: 2.5, opacity: 1 });
          certo?.bringToFront();
          const a = L.latLng(p.lat, p.lng);
          const b = L.latLng(o.lat, o.lng);
          L.polyline([a, b], { color: '#052e16', weight: 3, opacity: 0.8, dashArray: '8 8', interactive: false }).addTo(mapa);
          L.circleMarker(a, estiloPalpite).bindTooltip('Seu palpite').addTo(mapa);
          L.circleMarker(b, estiloResposta).bindTooltip(o.local).addTo(mapa);
          const limites = L.latLngBounds([a, b]);
          if (certo && 'getBounds' in certo) limites.extend((certo as L.Polygon).getBounds());
          mapa.fitBounds(limites, { padding: [30, 30], maxZoom: 7, animate: false });
          adicionarControles(mapa, [{ rotulo: '⤢ Ver tudo', titulo: 'Ver o palpite e a origem', limites: () => limites.pad(0.1) }]);
        }
        setSituacao('pronto');
      })
      .catch(() => !cancelado && setSituacao('erro'));

    return () => {
      cancelado = true;
      mapa.remove();
    };
  }, [codigoPais, modo]);

  return (
    <div className="relative h-full w-full">
      <div
        ref={container}
        role="application"
        aria-label={modo === 'palpite' ? 'Mapa para marcar o palpite' : 'Mapa com o seu palpite e a origem do prato'}
        className="h-full w-full rounded-2xl border-2 border-stone-200 bg-oceano"
      />
      {situacao !== 'pronto' && (
        <p className="absolute inset-0 z-[500] grid place-items-center rounded-2xl bg-white/80 font-semibold text-stone-700">
          {situacao === 'carregando' ? 'Carregando o mapa…' : 'Não foi possível carregar o mapa. Recarregue a página.'}
        </p>
      )}
    </div>
  );
};
