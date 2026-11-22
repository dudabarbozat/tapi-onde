import { useState } from 'react';
import type { Prato } from '@/data/pratos';
import { comArtigo, emPais, naDivisao, paisPorCodigo } from '@/data/countries';
import { BarraInferior } from '@/components/BarraInferior';
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
  const unica = pais?.divisaoUnica;

  return (
    <main className="com-barra mx-auto max-w-5xl px-3 py-4 sm:px-4">
      <section className="painel p-3 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Progresso {...progresso} />
        </div>
        <h2 className="mt-3 text-xl sm:text-3xl">
          📍 {unica ? `Onde ${emPais(recipe.pais)} este prato nasceu?` : `Em qual ${divisao.nome} ${comArtigo(recipe.pais)} este prato nasceu?`}
        </h2>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Ingredientes">
          {recipe.ingredientes.map((i) => (
            <li key={i} className="rounded-full border-2 border-green-200 bg-green-50 px-3 py-0.5 text-sm font-medium text-green-950 sm:text-base">
              {i}
            </li>
          ))}
        </ul>

        {/* O mapa ocupa o resto da tela: é aqui que se joga. */}
        <div className="relative mt-3 h-[calc(100dvh-20rem)] min-h-[320px]">
          <MapaEstados
            modo="palpite"
            codigoPais={recipe.codigoPais}
            onMarcar={(m) => {
              setMarcacao(m);
              setFora(false);
            }}
            onFora={() => setFora(true)}
          />
          {fora && (
            <p role="status" className="absolute inset-x-3 bottom-3 z-[600] rounded-xl bg-amber-100 px-4 py-2 text-center font-semibold text-amber-950 shadow-lg">
              Esse ponto fica fora {comArtigo(recipe.pais)}. Toque dentro do país colorido.
            </p>
          )}
        </div>
      </section>

      <BarraInferior
        info={
          marcacao
            ? unica
              ? 'Palpite marcado. Pode trocar antes de confirmar.'
              : <>Você escolheu <b className="text-blue-800">{marcacao.estado}</b>. Pode trocar antes de confirmar.</>
            : unica
              ? 'Toque no ponto exato: até 50 km da origem vale como acerto.'
              : `Toque ${naDivisao(divisao)} no mapa. Use + e − ou a rodinha do mouse para aproximar.`
        }
      >
        <button type="button" onClick={() => marcacao && onGuess(marcacao)} disabled={!marcacao} className="botao-principal w-full sm:w-auto">
          {marcacao ? (unica ? 'Confirmar palpite ✓' : `Confirmar: ${marcacao.estado} ✓`) : 'Confirmar'}
        </button>
      </BarraInferior>
    </main>
  );
};
