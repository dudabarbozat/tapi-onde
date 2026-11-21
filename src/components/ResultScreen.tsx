import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { arquivoPublico, type Prato } from '@/data/pratos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistance } from '@/utils/gameLogic';
import { camadaBase, estiloPalpite, estiloResposta } from '@/utils/mapa';

interface ResultScreenProps {
  recipe: Prato;
  guess: { lat: number; lng: number; distancia: number; pontos: number };
  totalScore: number;
  isLastRound: boolean;
  onNextRound: () => void;
  onRestart: () => void;
}

const desempenho = (distancia: number) => {
  if (distancia <= 50) return { emoji: '🎯', texto: 'PERFEITO!', cor: 'text-yellow-400' };
  if (distancia <= 100) return { emoji: '🌟', texto: 'EXCELENTE!', cor: 'text-green-400' };
  if (distancia <= 200) return { emoji: '👏', texto: 'MUITO BOM!', cor: 'text-blue-400' };
  if (distancia <= 500) return { emoji: '👍', texto: 'BOM!', cor: 'text-purple-400' };
  if (distancia <= 1000) return { emoji: '🤔', texto: 'PODE MELHORAR', cor: 'text-orange-400' };
  return { emoji: '😅', texto: 'FOI LONGE!', cor: 'text-red-400' };
};

const MapaResultado = ({ recipe, guess }: Pick<ResultScreenProps, 'recipe' | 'guess'>) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const mapa = L.map(container.current, { scrollWheelZoom: false });
    camadaBase().addTo(mapa);
    const resposta = L.latLng(recipe.latitude, recipe.longitude);
    const palpite = L.latLng(guess.lat, guess.lng);
    L.polyline([palpite, resposta], { color: '#dc2626', weight: 3, opacity: 0.8, dashArray: '8 8' }).addTo(mapa);
    L.circleMarker(palpite, estiloPalpite).bindTooltip('Seu palpite').addTo(mapa);
    L.circleMarker(resposta, estiloResposta).bindTooltip(recipe.local).addTo(mapa);
    mapa.fitBounds(L.latLngBounds([palpite, resposta]), { padding: [40, 40], maxZoom: 8 });
    return () => {
      mapa.remove();
    };
  }, [recipe, guess]);

  return (
    <div>
      <div ref={container} className="h-64 w-full rounded-lg border border-green-600/50" aria-label="Mapa com o palpite e a origem do prato" />
      <div className="flex justify-center gap-6 mt-3 text-sm text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600" />Seu palpite</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-600" />Origem</span>
      </div>
    </div>
  );
};

export const ResultScreen = ({ recipe, guess, totalScore, isLastRound, onNextRound, onRestart }: ResultScreenProps) => {
  const d = desempenho(guess.distancia);
  const fonte = { fontFamily: 'Poppins, system-ui, sans-serif' };
  const [fotoOk, setFotoOk] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-6 pb-6 bg-leaf-600">
      <Card className="cyber-card max-w-3xl w-full animate-fade-in relative z-10">
        <CardHeader className="text-center pb-4 bg-green-800/90">
          <div className="text-7xl mb-4 animate-bounce-gentle">{d.emoji}</div>
          <CardTitle className={`text-4xl md:text-5xl font-black ${d.cor}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {d.texto}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 bg-green-800/90">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="cyber-card p-5 bg-green-800/90">
              <div className="text-3xl font-black text-pink-400">{formatDistance(guess.distancia)}</div>
              <div className="text-sm text-green-200 font-semibold" style={fonte}>DISTÂNCIA</div>
            </div>
            <div className="cyber-card p-5 bg-green-800/90">
              <div className="text-3xl font-black text-green-400">+{guess.pontos}</div>
              <div className="text-sm text-green-200 font-semibold" style={fonte}>PONTOS</div>
            </div>
          </div>

          <MapaResultado recipe={recipe} guess={guess} />

          {fotoOk && (
          <figure className="overflow-hidden rounded-lg border border-green-600/50">
            <img
              src={arquivoPublico(recipe.imagem.arquivo)}
              alt={recipe.prato}
              className="w-full max-h-96 object-cover"
              onError={() => setFotoOk(false)}
            />
            <figcaption className="px-4 py-2 text-xs text-green-300 bg-green-900/60" style={fonte}>
              Foto: {recipe.imagem.autor} ·{' '}
              <a href={recipe.imagem.url} target="_blank" rel="noreferrer" className="underline hover:text-white">
                {recipe.imagem.licenca}, via Wikimedia Commons
              </a>
            </figcaption>
          </figure>
          )}

          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {recipe.prato}
            </h3>
            <p className="text-green-200 text-lg" style={fonte}>
              📍 {recipe.local} · {recipe.pais}
            </p>
          </div>

          <div className="cyber-card p-5 bg-green-800/90 space-y-4 text-left" style={fonte}>
            <div>
              <h4 className="font-bold text-blue-300 mb-1">🌎 Curiosidade</h4>
              <p className="text-green-100 leading-relaxed">{recipe.curiosidade}</p>
            </div>
            <div>
              <h4 className="font-bold text-yellow-300 mb-1">👩‍🍳 Como se faz</h4>
              <p className="text-green-100 leading-relaxed">{recipe.comoSeFaz}</p>
            </div>
            <a href={recipe.fonte} target="_blank" rel="noreferrer" className="inline-block text-sm text-green-300 underline hover:text-white">
              Saiba mais sobre o prato
            </a>
          </div>

          {isLastRound && (
            <div className="cyber-card p-6 border-2 border-yellow-500/50 bg-green-800/90 text-center">
              <h4 className="font-bold text-yellow-400 mb-2 text-2xl">🏆 JORNADA COMPLETA!</h4>
              <p className="text-3xl font-black text-white">{totalScore.toLocaleString('pt-BR')} PONTOS</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            {!isLastRound && (
              <Button onClick={onNextRound} className="flex-1 cyber-button text-lg py-6">
                PRÓXIMO PRATO 🍽️
              </Button>
            )}
            <Button
              onClick={onRestart}
              className="flex-1 bg-green-700/60 hover:bg-green-600/70 border-2 border-green-500/50 text-white font-bold text-lg py-6 rounded-lg"
            >
              {isLastRound ? 'JOGAR DE NOVO 🌎' : 'TROCAR DE PAÍS 🌎'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
