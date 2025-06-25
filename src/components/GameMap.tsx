
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Recipe } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

interface GameMapProps {
  recipe: Recipe;
  onGuess: (lat: number, lng: number) => void;
  selectedCountry: string;
}

export const GameMap = ({ recipe, onGuess, selectedCountry }: GameMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [userMarker, setUserMarker] = useState<L.Marker | null>(null);
  const [guessCoords, setGuessCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapBounds: { [key: string]: [[number, number], [number, number]]; } = {
      'BR': [[-33.7, -73.9], [5.3, -28.8]],
      'PE': [[-18.4, -81.4], [-0.0, -68.7]],
      'MX': [[14.5, -118.4], [32.7, -86.7]],
      'CO': [[-4.2, -81.8], [13.4, -66.9]],
      'AR': [[-55.1, -73.6], [-21.8, -53.6]],
      'CL': [[-56.5, -75.6], [-17.5, -66.4]]
    };

    const bounds = mapBounds[selectedCountry] || [[-60, -120], [15, -30]];
    
    mapRef.current = L.map(mapContainer.current, {
      zoomControl: true,
      attributionControl: false
    }).fitBounds(bounds);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (userMarker) {
        mapRef.current?.removeLayer(userMarker);
      }

      const marker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(mapRef.current!);

      setUserMarker(marker);
      setGuessCoords({ lat, lng });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [selectedCountry]);

  const handleConfirmGuess = () => {
    if (guessCoords) {
      onGuess(guessCoords.lat, guessCoords.lng);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-leaf-600">      
      <div className="p-4 relative z-10 px-6 md:px-32 py-12">
        <Card className="cyber-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-heading font-bold mb-2 text-white">
                  <span className="text-purple-400">🎯</span> LOCALIZAR ORIGEM
                </h3>
                <p className="font-body text-green-200">
                  Clique no mapa para marcar sua hipótese
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="cyber-card p-3 text-xs max-w-48">
                  <span className="text-green-400 font-semibold">Ingredientes: </span>
                  <span className="text-white">
                    {recipe.ingredientes.slice(0, 2).join(', ')}...
                  </span>
                </div>
                {guessCoords && (
                  <Button onClick={handleConfirmGuess} className="cyber-button">
                    <span className="flex items-center gap-2">
                      CONFIRMAR
                      <span className="text-xl">✓</span>
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex-1 mb-4 relative z-10 mx-6 md:mx-32">
        <div 
          ref={mapContainer} 
          className="w-full h-full min-h-[500px] rounded-xl shadow-2xl border-2 border-green-700/50"
        />
      </div>
    </div>
  );
};
