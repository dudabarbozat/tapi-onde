import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Prato } from '@/data/pratos';
import { paisPorCodigo } from '@/data/countries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { camadaBase, estiloPalpite } from '@/utils/mapa';

interface GameMapProps {
  recipe: Prato;
  selectedCountry: string;
  onGuess: (lat: number, lng: number) => void;
}

export const GameMap = ({ recipe, selectedCountry, onGuess }: GameMapProps) => {
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
    <div className="min-h-screen flex flex-col bg-leaf-600">
      <div className="relative z-10 px-4 md:px-32 pt-6 pb-6">
        <Card className="cyber-card">
          <CardContent className="p-6 bg-green-800/90">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold mb-2 text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <span className="text-purple-400">🎯</span> LOCALIZAR ORIGEM
                </h3>
                <p className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  {palpite ? 'Pode mudar o ponto quantas vezes quiser antes de confirmar.' : 'Toque no mapa onde você acha que este prato nasceu.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="cyber-card p-3 text-xs max-w-64 bg-green-800/90" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  <span className="text-green-400 font-semibold">Ingredientes: </span>
                  <span className="text-white">{recipe.ingredientes.join(', ')}</span>
                </div>
                <Button onClick={() => palpite && onGuess(palpite.lat, palpite.lng)} disabled={!palpite} className="cyber-button">
                  CONFIRMAR ✓
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 mb-6 relative z-10 mx-4 md:mx-32">
        <div
          ref={container}
          role="application"
          aria-label="Mapa para marcar o palpite"
          className="w-full h-full min-h-[60vh] rounded-xl border-2 border-green-700/30"
          style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
        />
      </div>
    </div>
  );
};
