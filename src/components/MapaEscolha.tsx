import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, Geometry } from 'geojson';
import fronteiras from '@/data/america-latina.json';
import { countriesData, paisPorCodigo } from '@/data/countries';
import { paisesJogaveis } from '@/utils/partida';
import { adicionarControles, LIMITES_CARIBE } from '@/utils/controlesMapa';

type Props = { codigo: string | null };

interface MapaEscolhaProps {
  /** País sob o mouse ou o foco do teclado. */
  destaque: string | null;
  /** Países escolhidos para a partida: um no modo sozinho, uma região inteira em grupo. */
  escolhidos: string[];
  onDestaque: (codigo: string | null) => void;
  onEscolher: (codigo: string) => void;
}

const VIZINHO: L.PathOptions = { fillColor: '#d6d3d1', fillOpacity: 1, color: '#ffffff', weight: 1 };

const estilo = (codigo: string, nivel: 'normal' | 'destaque' | 'escolhido'): L.PathOptions => ({
  fillColor: paisPorCodigo(codigo)?.cor,
  fillOpacity: nivel === 'normal' ? 0.82 : 1,
  color: nivel === 'normal' ? '#ffffff' : '#052e16',
  weight: nivel === 'escolhido' ? 4 : nivel === 'destaque' ? 3 : 1.5,
});

/** Mapa da América Latina para escolher o país: cada país com a cor da sua bandeira. */
export const MapaEscolha = ({ destaque, escolhidos, onDestaque, onEscolher }: MapaEscolhaProps) => {
  const container = useRef<HTMLDivElement>(null);
  // Um país pode ter mais de uma camada: o desenho e, nas ilhas pequenas, o ponto clicável.
  const camadas = useRef(new Map<string, L.Path[]>());
  const rotulos = useRef(new Map<string, L.Tooltip>());
  const callbacks = useRef({ onDestaque, onEscolher });
  callbacks.current = { onDestaque, onEscolher };

  useEffect(() => {
    if (!container.current) return;
    const caixa = container.current;
    const mapa = L.map(caixa, {
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      zoomSnap: 0.1,
      attributionControl: false,
      // Sem vista inicial, os pontos das ilhas quebram o Leaflet ao entrar no mapa (o enquadramento vem depois).
    }).setView([-10, -70], 3);
    L.control.attribution({ prefix: false }).addAttribution('Fronteiras: Natural Earth').addTo(mapa);

    const registrar = (codigo: string, path: L.Path) => {
      camadas.current.set(codigo, [...(camadas.current.get(codigo) ?? []), path]);
      path.on({
        mouseover: () => callbacks.current.onDestaque(codigo),
        mouseout: () => callbacks.current.onDestaque(null),
        click: () => callbacks.current.onEscolher(codigo),
      });
    };

    const geo = L.geoJSON(fronteiras as FeatureCollection<Geometry, Props>, {
      style: (f) => (f?.properties.codigo && paisesJogaveis.includes(f.properties.codigo) ? estilo(f.properties.codigo, 'normal') : VIZINHO),
      onEachFeature: (f, camada) => {
        const codigo = (f.properties as Props).codigo;
        if (!codigo || !paisesJogaveis.includes(codigo)) return;
        registrar(codigo, camada as L.Path);
      },
    }).addTo(mapa);

    // Ilhas pequenas demais para tocar ganham um ponto na cor do país.
    for (const c of countriesData.filter((p) => p.ilha && paisesJogaveis.includes(p.codigo))) {
      registrar(c.codigo, L.circleMarker(c.rotulo, { ...estilo(c.codigo, 'normal'), radius: 7 }).addTo(mapa));
    }

    for (const c of countriesData.filter((p) => paisesJogaveis.includes(p.codigo))) {
      const rotulo = L.tooltip({
        permanent: true,
        // Nas ilhas, o nome fica ao lado do ponto para não cobri-lo.
        direction: c.ilha ? 'right' : 'center',
        offset: c.ilha ? [8, 0] : [0, 0],
        className: `rotulo-pais${c.pequeno ? ' rotulo-pequeno' : ''}`,
      }).setLatLng(c.rotulo).setContent(c.pais);
      rotulos.current.set(c.codigo, rotulo);
      mapa.openTooltip(rotulo);
    }

    const enquadrar = () => {
      if (!caixa.clientWidth || !caixa.clientHeight) return;
      mapa.invalidateSize({ animate: false });
      mapa.fitBounds(geo.getBounds(), { padding: [8, 8], animate: false });
    };
    enquadrar();
    // O mapa fica parado (a página rola por cima dele); os atalhos aproximam o Caribe, onde as ilhas são pequenas.
    adicionarControles(
      mapa,
      [
        { rotulo: '⤢ Ver tudo', titulo: 'Ver a América Latina inteira', limites: () => geo.getBounds() },
        { rotulo: '🔍 Caribe', titulo: 'Aproximar o Caribe', limites: () => LIMITES_CARIBE },
      ],
      { zoom: false },
    );
    const observador = new ResizeObserver(enquadrar);
    observador.observe(caixa);

    const lista = camadas.current;
    const nomes = rotulos.current;
    return () => {
      observador.disconnect();
      lista.clear();
      nomes.clear();
      mapa.remove();
    };
  }, []);

  useEffect(() => {
    camadas.current.forEach((partes, codigo) => {
      // Um país escolhido ganha contorno forte; uma região inteira (modo em grupo) fica colorida e o resto em cinza.
      const regiao = escolhidos.length > 1;
      if (regiao && !escolhidos.includes(codigo)) {
        partes.forEach((p) => p.setStyle(VIZINHO));
        return;
      }
      const nivel = !regiao && escolhidos.includes(codigo) ? 'escolhido' : codigo === destaque ? 'destaque' : 'normal';
      partes.forEach((p) => {
        p.setStyle(estilo(codigo, nivel));
        if (nivel !== 'normal') p.bringToFront();
      });
      // Nome dos países pequenos: só no destaque ou quando é o único escolhido (evita sobreposição).
      const visivel = codigo === destaque || (escolhidos.length === 1 && escolhidos[0] === codigo);
      rotulos.current.get(codigo)?.getElement()?.classList.toggle('rotulo-visivel', visivel);
    });
  }, [destaque, escolhidos]);

  return (
    <div
      ref={container}
      role="img"
      aria-label="Mapa da América Latina com os países do jogo coloridos. Toque em um país para escolher, ou use a lista."
      className="h-full w-full rounded-2xl bg-oceano"
    />
  );
};
