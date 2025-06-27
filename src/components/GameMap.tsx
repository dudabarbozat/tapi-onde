
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Recipe } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { calculateDistance, formatDistance } from '@/utils/gameLogic';

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
  const [correctLocationMarker, setCorrectLocationMarker] = useState<L.Marker | null>(null);
  const [guessCoords, setGuessCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [showCorrectLocation, setShowCorrectLocation] = useState(false);

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

      // Remove previous user marker
      if (userMarker) {
        mapRef.current?.removeLayer(userMarker);
      }

      // Add user guess marker (blue)
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

      // Calculate and show distance immediately
      const calculatedDistance = calculateDistance(lat, lng, recipe.latitude, recipe.longitude);
      setDistance(calculatedDistance);

      // Show correct location marker (red)
      if (correctLocationMarker) {
        mapRef.current?.removeLayer(correctLocationMarker);
      }

      const correctMarker = L.marker([recipe.latitude, recipe.longitude], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(mapRef.current!);

      setCorrectLocationMarker(correctMarker);
      setShowCorrectLocation(true);

      // Draw a line between the guess and correct location
      L.polyline([[lat, lng], [recipe.latitude, recipe.longitude]], {
        color: '#ef4444',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
      }).addTo(mapRef.current!);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [selectedCountry, recipe]);

  const handleConfirmGuess = () => {
    if (guessCoords) {
      onGuess(guessCoords.lat, guessCoords.lng);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-leaf-600">      
      <div className="p-4 relative z-10 px-6 md:px-32 py-12">
        <Card className="cyber-card">
          <CardContent className="p-6 bg-green-800/90">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold mb-2 text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <span className="text-purple-400">🎯</span> LOCALIZAR ORIGEM
                </h3>
                <p className="text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  Clique no mapa para marcar sua hipótese
                </p>
                {distance !== null && (
                  <div className="mt-4 p-3 bg-green-700/50 rounded-lg">
                    <p className="text-green-200 text-sm" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                      Sua distância: <span className="text-white font-bold text-lg">{formatDistance(distance)}</span>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="cyber-card p-3 text-xs max-w-48 bg-green-800/90">
                  <span className="text-green-400 font-semibold" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>Ingredientes: </span>
                  <span className="text-white" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
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

            {showCorrectLocation && (
              <div className="mt-4 p-4 bg-green-700/30 rounded-lg border border-green-600/50">
                <div className="flex items-center gap-4 text-sm" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-green-200">Sua resposta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-green-200">Localização correta</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex-1 mb-4 relative z-10 mx-6 md:mx-32">
        <div 
          ref={mapContainer} 
          className="w-full h-full min-h-[500px] rounded-xl border-2 border-green-700/30"
          style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
        />
      </div>
    </div>
  );
};
