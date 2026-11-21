import { comArtigo, paisPorCodigo } from '@/data/countries';

interface LoadingScreenProps {
  country: string;
}

export const LoadingScreen = ({ country }: LoadingScreenProps) => {
  const dados = paisPorCodigo(country);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center" aria-live="polite">
      <div className="relative mb-6">
        {dados && <img src={dados.bandeira} alt="" className="h-20 w-32 rounded-lg object-cover shadow-lg ring-4 ring-white" />}
        <span aria-hidden="true" className="absolute -right-5 -top-7 animate-bounce-gentle text-5xl">
          📍
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl">Preparando a viagem…</h2>
      <p className="mt-2 text-lg text-green-50">Separando 5 pratos típicos {comArtigo(dados?.pais ?? country)}.</p>
    </main>
  );
};
