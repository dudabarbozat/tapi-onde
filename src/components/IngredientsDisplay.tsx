import { CATEGORIA, type Prato } from '@/data/pratos';
import { Progresso } from '@/components/Progresso';

interface IngredientsDisplayProps {
  recipe: Prato;
  rodada: number;
  totalRodadas: number;
  onContinue: () => void;
}

export const IngredientsDisplay = ({ recipe, rodada, totalRodadas, onContinue }: IngredientsDisplayProps) => (
  <main className="mx-auto max-w-3xl px-4 py-6">
    <article className="painel animate-fade-in p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Progresso rodada={rodada} total={totalRodadas} />
        <span className="etiqueta">{CATEGORIA[recipe.categoria]}</span>
      </div>

      <h2 className="mt-6 text-3xl sm:text-4xl">De onde é este prato?</h2>
      <p className="mt-1 text-stone-700">Leia as pistas e depois marque no mapa onde ele é tradicionalmente preparado.</p>

      <h3 className="mt-6 text-lg">🌿 Ingredientes</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {recipe.ingredientes.map((ingrediente, i) => (
          <li
            key={ingrediente}
            className="animate-fade-in rounded-full border-2 border-green-200 bg-green-50 px-4 py-1.5 font-medium text-green-950"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {ingrediente}
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl border-2 border-yellow-400 bg-yellow-50 p-4 sm:p-5">
        <h3 className="text-lg">💡 Dica</h3>
        <p className="mt-1 text-lg leading-relaxed">{recipe.dica}</p>
      </div>

      <div className="mt-8 text-center">
        <button type="button" onClick={onContinue} className="botao-principal w-full sm:w-auto">
          Abrir o mapa 🗺️
        </button>
      </div>
    </article>
  </main>
);
