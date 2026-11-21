import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { arquivoPublico, CATEGORIA, type Prato } from '@/data/pratos';
import { Progresso } from '@/components/Progresso';
import { formatDistance } from '@/utils/gameLogic';
import { camadaBase, estiloPalpite, estiloResposta } from '@/utils/mapa';

interface ResultScreenProps {
  recipe: Prato;
  guess: { lat: number; lng: number; distancia: number; pontos: number };
  rodada: number;
  totalRodadas: number;
  totalScore: number;
  isLastRound: boolean;
  onNextRound: () => void;
  onRestart: () => void;
}

const desempenho = (distancia: number) => {
  if (distancia <= 50) return { emoji: '🎯', texto: 'Na mosca!', cor: 'text-green-800' };
  if (distancia <= 100) return { emoji: '🌟', texto: 'Excelente!', cor: 'text-green-800' };
  if (distancia <= 200) return { emoji: '👏', texto: 'Muito bom!', cor: 'text-blue-800' };
  if (distancia <= 500) return { emoji: '👍', texto: 'Bom palpite!', cor: 'text-blue-800' };
  if (distancia <= 1000) return { emoji: '🤔', texto: 'Quase lá', cor: 'text-amber-800' };
  return { emoji: '🧭', texto: 'Foi longe!', cor: 'text-red-800' };
};

const MapaResultado = ({ recipe, guess }: Pick<ResultScreenProps, 'recipe' | 'guess'>) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const mapa = L.map(container.current, { scrollWheelZoom: false });
    camadaBase().addTo(mapa);
    const resposta = L.latLng(recipe.latitude, recipe.longitude);
    const palpite = L.latLng(guess.lat, guess.lng);
    L.polyline([palpite, resposta], { color: '#052e16', weight: 3, opacity: 0.8, dashArray: '8 8' }).addTo(mapa);
    L.circleMarker(palpite, estiloPalpite).bindTooltip('Seu palpite').addTo(mapa);
    L.circleMarker(resposta, estiloResposta).bindTooltip(recipe.local).addTo(mapa);
    mapa.fitBounds(L.latLngBounds([palpite, resposta]), { padding: [40, 40], maxZoom: 8 });
    return () => {
      mapa.remove();
    };
  }, [recipe, guess]);

  return (
    <figure>
      <div ref={container} className="h-72 w-full rounded-2xl border-2 border-stone-200" aria-label="Mapa com o seu palpite e a origem do prato" />
      <figcaption className="mt-2 flex justify-center gap-6 text-sm font-medium text-stone-700">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-600" />
          Seu palpite
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-600" />
          Origem do prato
        </span>
      </figcaption>
    </figure>
  );
};

export const ResultScreen = ({ recipe, guess, rodada, totalRodadas, totalScore, isLastRound, onNextRound, onRestart }: ResultScreenProps) => {
  const d = desempenho(guess.distancia);
  const [fotoOk, setFotoOk] = useState(true);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <article className="painel animate-fade-in p-5 sm:p-8">
        <Progresso rodada={rodada} total={totalRodadas} />

        <header className="mt-5 flex items-center gap-4">
          <span aria-hidden="true" className="text-6xl">
            {d.emoji}
          </span>
          <h2 className={`text-3xl sm:text-4xl ${d.cor}`}>{d.texto}</h2>
        </header>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-2xl bg-blue-50 p-4">
            <dt className="text-sm font-semibold text-blue-900">Distância</dt>
            <dd className="font-titulo text-2xl font-bold text-blue-900 sm:text-3xl">{formatDistance(guess.distancia)}</dd>
          </div>
          <div className="rounded-2xl bg-yellow-100 p-4">
            <dt className="text-sm font-semibold text-green-950">Pontos</dt>
            <dd className="font-titulo text-2xl font-bold text-green-950 sm:text-3xl">+{guess.pontos}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <MapaResultado recipe={recipe} guess={guess} />
        </div>

        <div className="mt-8">
          <span className="etiqueta">{CATEGORIA[recipe.categoria]}</span>
          <h3 className="mt-2 text-3xl sm:text-4xl">{recipe.prato}</h3>
          <p className="mt-1 text-lg text-stone-700">
            📍 {recipe.local} · {recipe.pais}
          </p>
        </div>

        {fotoOk && (
          <figure className="mt-5 overflow-hidden rounded-2xl border-2 border-stone-200">
            <img
              src={arquivoPublico(recipe.imagem.arquivo)}
              alt={`Foto de ${recipe.prato}`}
              className="max-h-[28rem] w-full object-cover"
              onError={() => setFotoOk(false)}
            />
            <figcaption className="bg-stone-50 px-4 py-2 text-xs text-stone-600">
              Foto: {recipe.imagem.autor} ·{' '}
              <a href={recipe.imagem.url} target="_blank" rel="noreferrer" className="underline hover:text-stone-900">
                {recipe.imagem.licenca}, via Wikimedia Commons
              </a>
            </figcaption>
          </figure>
        )}

        <section className="mt-6 space-y-5 text-lg leading-relaxed">
          <div>
            <h4 className="text-xl text-blue-900">🌎 Curiosidade</h4>
            <p className="mt-1 text-stone-800">{recipe.curiosidade}</p>
          </div>
          <div>
            <h4 className="text-xl text-green-800">👩‍🍳 Como se faz</h4>
            <p className="mt-1 text-stone-800">{recipe.comoSeFaz}</p>
          </div>
          <a href={recipe.fonte} target="_blank" rel="noreferrer" className="inline-block text-base font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-900">
            Saiba mais sobre o prato ↗
          </a>
        </section>

        {isLastRound && (
          <div className="mt-8 rounded-2xl bg-green-950 p-6 text-center text-white">
            <p className="font-titulo text-xl font-bold">🏆 Viagem completa!</p>
            <p className="mt-1 font-titulo text-4xl font-bold text-yellow-300">{totalScore.toLocaleString('pt-BR')} pontos</p>
            <p className="mt-1 text-green-100">de {(totalRodadas * 1000).toLocaleString('pt-BR')} possíveis</p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {!isLastRound && (
            <button type="button" onClick={onNextRound} className="botao-principal flex-1">
              Próximo prato 🍽️
            </button>
          )}
          <button type="button" onClick={onRestart} className={`flex-1 ${isLastRound ? 'botao-principal' : 'botao-secundario'}`}>
            {isLastRound ? 'Jogar de novo 🌎' : 'Trocar de país 🌎'}
          </button>
        </div>
      </article>
    </main>
  );
};
