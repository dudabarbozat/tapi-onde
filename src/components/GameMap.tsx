import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Prato } from '@/data/pratos';
import { paisPorCodigo } from '@/data/countries';
import { Progresso } from '@/components/Progresso';
import { camadaBase, estiloPalpite } from '@/utils/mapa';

interface GameMapProps {
  recipe: Prato;
  selectedCountry: string;
  rodada: number;
  totalRodadas: number;
  onGuess: (lat: number, lng: number) => void;
}

export const GameMap = ({ recipe, selectedCountry, rodada, totalRodadas, onGuess }: GameMapProps) => {
  const container = useRef<HTMLDivElement>(null);
  const [palpite, setPalpite] = useState<L.LatLng | null>(null);

  useEffect(() => {
    if (!container.current) return;
    const limites = paisPorCodigo(selectedCountry)?.limites ?? [[-56, -118], [33, -34]];
    const mapa = L.map(container.current).fitBounds(limites);
    camadaBase().addTo(mapa);

    let marcador: L.CircleMarker | null = null;
    mapa.on('click', (e: L.LeafletMouseEvent) => {
      marcador?.remove();
      marcador = L.circleMarker(e.latlng, estiloPalpite).addTo(mapa);
      setPalpite(e.latlng);
    });

    return () => {
      mapa.remove();
    };
  }, [selectedCountry]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <section className="painel p-4 sm:p-6">
        <Progresso rodada={rodada} total={totalRodadas} />
        <h2 className="mt-4 text-2xl sm:text-3xl">📍 Onde este prato nasceu?</h2>
        <p className="mt-1 text-stone-700">
          {palpite ? 'Ponto marcado! Pode mudar quantas vezes quiser antes de confirmar.' : 'Toque no mapa para marcar o seu palpite. Use + e − para aproximar.'}
        </p>
        <p className="mt-3 rounded-xl bg-green-50 px-4 py-2 text-green-950">
          <b>Ingredientes:</b> {recipe.ingredientes.join(', ')}
        </p>

        <div
          ref={container}
          role="application"
          aria-label="Mapa para marcar o palpite"
          className="mt-4 h-[55vh] min-h-[320px] w-full rounded-2xl border-2 border-stone-200"
        />

        <div className="sticky bottom-3 z-[1000] mt-4 text-center">
          <button
            type="button"
            onClick={() => palpite && onGuess(palpite.lat, palpite.lng)}
            disabled={!palpite}
            className="botao-principal w-full shadow-lg sm:w-auto"
          >
            {palpite ? 'Confirmar palpite ✓' : 'Marque um ponto no mapa'}
          </button>
        </div>
      </section>
    </main>
  );
};
