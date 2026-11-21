import { CATEGORIA, type Prato } from '@/data/pratos';
import { comArtigo, paisPorCodigo } from '@/data/countries';
import { Progresso, type ProgressoProps } from '@/components/Progresso';

interface IngredientsDisplayProps {
  recipe: Prato;
  progresso: ProgressoProps;
  /** Nome de quem está jogando, no modo em grupo. */
  jogador?: string;
  onContinue: () => void;
}

export const IngredientsDisplay = ({ recipe, progresso, jogador, onContinue }: IngredientsDisplayProps) => {
  const pais = paisPorCodigo(recipe.codigoPais);
  const divisao = pais?.divisao.nome ?? 'estado';

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <article className="painel animate-fade-in p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Progresso {...progresso} />
          <span className="etiqueta">{CATEGORIA[recipe.categoria]}</span>
          {jogador && <span className="etiqueta bg-blue-100 text-blue-900">👤 Vez de {jogador}</span>}
        </div>

        <p className="mt-6 inline-flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-2 font-semibold text-stone-800">
          {pais && <img src={pais.bandeira} alt="" className="h-5 w-7 rounded-sm object-cover ring-1 ring-stone-300" />}
          Prato típico {comArtigo(recipe.pais)}
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl">{pais?.divisaoUnica ? 'De onde é este prato?' : `De qual ${divisao} é este prato?`}</h2>
        <p className="mt-1 text-stone-700">Leia as pistas. Depois, toque no mapa {comArtigo(recipe.pais)} onde ele nasceu.</p>

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
};
