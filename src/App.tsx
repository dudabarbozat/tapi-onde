import { useEffect, useState } from 'react';
import { CountrySelection } from '@/components/CountrySelection';
import { FaixaProjeto } from '@/components/FaixaProjeto';
import { GameMap } from '@/components/GameMap';
import { IngredientsDisplay } from '@/components/IngredientsDisplay';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Navigation } from '@/components/Navigation';
import { ResultScreen } from '@/components/ResultScreen';
import { pratosDoPais, type Prato } from '@/data/pratos';
import { calculateDistance, calculateScore, embaralhar } from '@/utils/gameLogic';

const RODADAS = 5;

type Fase = 'inicio' | 'carregando' | 'ingredientes' | 'mapa' | 'resultado';

interface Palpite {
  lat: number;
  lng: number;
  distancia: number;
  pontos: number;
}

const App = () => {
  const [fase, setFase] = useState<Fase>('inicio');
  const [pais, setPais] = useState<string | null>(null);
  const [fila, setFila] = useState<Prato[]>([]);
  const [rodada, setRodada] = useState(0);
  const [total, setTotal] = useState(0);
  const [palpite, setPalpite] = useState<Palpite | null>(null);

  const prato = fila[rodada];
  const ultimaRodada = rodada >= fila.length - 1;

  useEffect(() => {
    if (fase !== 'carregando') return;
    const t = setTimeout(() => setFase('ingredientes'), 1200);
    return () => clearTimeout(t);
  }, [fase]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [fase]);

  const escolherPais = (codigo: string) => {
    setPais(codigo);
    setFila(embaralhar(pratosDoPais(codigo)).slice(0, RODADAS));
    setRodada(0);
    setTotal(0);
    setPalpite(null);
    setFase('carregando');
  };

  const confirmarPalpite = (lat: number, lng: number) => {
    const distancia = calculateDistance(lat, lng, prato.latitude, prato.longitude);
    const pontos = calculateScore(distancia);
    setPalpite({ lat, lng, distancia, pontos });
    setTotal((t) => t + pontos);
    setFase('resultado');
  };

  const proximaRodada = () => {
    setRodada((r) => r + 1);
    setPalpite(null);
    setFase('ingredientes');
  };

  const voltarAoInicio = () => {
    setFase('inicio');
    setPais(null);
    setFila([]);
  };

  return (
    <div className="min-h-screen">
      <FaixaProjeto />
      {fase !== 'inicio' && <Navigation pais={pais} onHome={voltarAoInicio} />}

      {fase === 'inicio' && <CountrySelection onCountrySelect={escolherPais} />}
      {fase === 'carregando' && pais && <LoadingScreen country={pais} />}
      {fase === 'ingredientes' && prato && (
        <IngredientsDisplay recipe={prato} rodada={rodada + 1} totalRodadas={fila.length} onContinue={() => setFase('mapa')} />
      )}
      {fase === 'mapa' && prato && pais && <GameMap key={prato.id} recipe={prato} selectedCountry={pais} rodada={rodada + 1} totalRodadas={fila.length} onGuess={confirmarPalpite} />}
      {fase === 'resultado' && prato && palpite && (
        <ResultScreen
          recipe={prato}
          guess={palpite}
          rodada={rodada + 1}
          totalRodadas={fila.length}
          totalScore={total}
          isLastRound={ultimaRodada}
          onNextRound={proximaRodada}
          onRestart={voltarAoInicio}
        />
      )}
    </div>
  );
};

export default App;
