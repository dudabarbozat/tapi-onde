
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
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

    // Map bounds for different countries/regions
    const mapBounds: { [key: string]: [[number, number], [number, number]] } = {
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

    // Add click handler
    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Remove previous marker
      if (userMarker) {
        mapRef.current?.removeLayer(userMarker);
      }

      // Add new marker
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-terra-50 to-spice-50">
      <div className="p-4">
        <Card className="game-card">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-heading font-semibold text-terra-800">
                  🎯 Onde este prato é preparado?
                </h3>
                <p className="text-terra-600 text-sm mt-1">
                  Clique no mapa para fazer seu palpite
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="ingredient-tag text-xs">
                  {recipe.ingredientes.slice(0, 2).join(', ')}...
                </div>
                {guessCoords && (
                  <Button
                    onClick={handleConfirmGuess}
                    className="bg-leaf-500 hover:bg-leaf-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300"
                  >
                    Confirmar Palpite ✓
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex-1 mx-4 mb-4">
        <div
          ref={mapContainer}
          className="w-full h-full min-h-[500px] rounded-xl shadow-lg border border-border/50"
        />
      </div>
    </div>
  );
};
