import { useState } from 'react';
import type { Prato } from '@/data/pratos';
import { comArtigo, naDivisao, paisPorCodigo } from '@/data/countries';
import { Progresso, type ProgressoProps } from '@/components/Progresso';
import { MapaEstados } from '@/components/MapaEstados';
import type { Marcacao } from '@/utils/estados';

interface GameMapProps {
  recipe: Prato;
  progresso: ProgressoProps;
  onGuess: (m: Marcacao) => void;
}

export const GameMap = ({ recipe, progresso, onGuess }: GameMapProps) => {
  const [marcacao, setMarcacao] = useState<Marcacao | null>(null);
  const [fora, setFora] = useState(false);
  const pais = paisPorCodigo(recipe.codigoPais);
  const divisao = pais?.divisao ?? { nome: 'estado', plural: 'estados', feminino: false };

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <section className="painel p-4 sm:p-6">
        <Progresso {...progresso} />
        <h2 className="mt-4 text-2xl sm:text-3xl">
          📍 Em qual {divisao.nome} {comArtigo(recipe.pais)} este prato nasceu?
        </h2>
        <p className="mt-1 text-stone-700">
          Toque {naDivisao(divisao)} no mapa. Use + e − para aproximar. Pode trocar antes de confirmar.
        </p>
        <p className="mt-3 rounded-xl bg-green-50 px-4 py-2 text-green-950">
          <b>Ingredientes:</b> {recipe.ingredientes.join(', ')}
        </p>

        <div className="mt-4 h-[55vh] min-h-[340px]">
          <MapaEstados
            modo="palpite"
            codigoPais={recipe.codigoPais}
            onMarcar={(m) => {
              setMarcacao(m);
              setFora(false);
            }}
            onFora={() => setFora(true)}
          />
        </div>

        {fora && (
          <p role="status" className="mt-3 rounded-xl bg-amber-50 px-4 py-2 font-semibold text-amber-900">
            Esse ponto fica fora {comArtigo(recipe.pais)}. Toque dentro do país colorido.
          </p>
        )}

        <div className="sticky bottom-3 z-[1000] mt-4 text-center">
          <button type="button" onClick={() => marcacao && onGuess(marcacao)} disabled={!marcacao} className="botao-principal w-full shadow-lg sm:w-auto">
            {marcacao ? `Confirmar: ${marcacao.estado} ✓` : `Toque em ${divisao.feminino ? 'uma' : 'um'} ${divisao.nome} no mapa`}
          </button>
        </div>
      </section>
    </main>
  );
};
