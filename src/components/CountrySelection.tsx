import { useState } from 'react';
import { Github } from 'lucide-react';
import { countriesData } from '@/data/countries';
import { arquivoPublico, pratosDoPais } from '@/data/pratos';
import { MapaEscolha } from '@/components/MapaEscolha';

interface CountrySelectionProps {
  onCountrySelect: (countryCode: string) => void;
}

const PASSOS = [
  { icone: '🥘', titulo: 'Leia as pistas', texto: 'Veja os ingredientes do prato e uma dica sobre a sua história.' },
  { icone: '📍', titulo: 'Marque no mapa', texto: 'Toque onde você acha que o prato nasceu. Pode mudar o ponto antes de confirmar.' },
  { icone: '🏆', titulo: 'Descubra o prato', texto: 'Veja a foto, a origem e como ele é feito. Quanto mais perto, mais pontos.' },
];

export const CountrySelection = ({ onCountrySelect }: CountrySelectionProps) => {
  const [destaque, setDestaque] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:pt-10">
      <header className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <h1 className="flex-none">
          <img src={arquivoPublico('img/logo.png')} alt="TapiOnde" className="h-32 w-32 sm:h-40 sm:w-40" />
        </h1>
        <div>
          <p className="font-titulo text-3xl font-bold leading-tight sm:text-4xl">De onde é este prato?</p>
          <p className="mt-2 max-w-2xl text-lg text-green-50">
            Um jogo de geografia pela comida da América Latina: leia as pistas, marque a origem no mapa e conheça pratos
            típicos de 10 países.
          </p>
        </div>
      </header>

      <section aria-labelledby="titulo-escolha" className="painel grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="h-[420px] sm:h-[560px] lg:h-[640px]">
          <MapaEscolha destaque={destaque} onDestaque={setDestaque} onEscolher={onCountrySelect} />
        </div>

        <div className="flex flex-col">
          <h2 id="titulo-escolha" className="text-2xl sm:text-3xl">
            Escolha um país para começar
          </h2>
          <p className="mb-4 mt-1 text-stone-700">Toque em um país colorido no mapa ou escolha na lista.</p>

          <ul className="grid grid-cols-2 gap-2">
            {countriesData.map((c) => (
              <li key={c.codigo}>
                <button
                  type="button"
                  onClick={() => onCountrySelect(c.codigo)}
                  onMouseEnter={() => setDestaque(c.codigo)}
                  onMouseLeave={() => setDestaque(null)}
                  onFocus={() => setDestaque(c.codigo)}
                  onBlur={() => setDestaque(null)}
                  style={{ borderLeftColor: c.cor }}
                  className={`flex w-full items-center gap-2 rounded-xl border-2 border-l-8 px-2 py-2.5 sm:gap-3 sm:px-3 text-left transition ${
                    destaque === c.codigo ? 'border-green-900 bg-green-50' : 'border-stone-200 hover:border-green-900'
                  }`}
                >
                  <img src={c.bandeira} alt="" className="h-5 w-7 flex-none rounded-sm sm:h-6 sm:w-9 object-cover ring-1 ring-stone-300" />
                  <span className="min-w-0">
                    <span className="block font-titulo font-bold leading-tight">{c.pais}</span>
                    <span className="block text-sm text-stone-600">{pratosDoPais(c.codigo).length} pratos</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="titulo-como-jogar" className="mt-12">
        <h2 id="titulo-como-jogar" className="mb-5 text-center text-2xl sm:text-3xl">
          Como jogar
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="painel flex gap-4 p-5">
              <span aria-hidden="true" className="grid h-10 w-10 flex-none place-items-center rounded-full bg-yellow-400 font-titulo text-lg font-bold text-green-950">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg">
                  <span aria-hidden="true">{p.icone} </span>
                  {p.titulo}
                </h3>
                <p className="mt-1 text-stone-700">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="titulo-escola" className="mt-12 rounded-3xl border-2 border-green-600 bg-green-950 p-6 sm:p-8">
        <h2 id="titulo-escola" className="text-2xl">
          Para usar na escola
        </h2>
        <ul className="mt-3 grid gap-2 text-green-50 sm:grid-cols-2">
          <li>✔ Funciona no navegador, no computador ou no celular.</li>
          <li>✔ Sem cadastro e sem anúncios.</li>
          <li>✔ Cada partida tem 5 pratos e leva poucos minutos.</li>
          <li>✔ Cada prato traz a fonte para aprofundar o assunto.</li>
        </ul>
        <a
          href="https://github.com/dudabarbozat/tapi-onde"
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 font-semibold text-yellow-300 underline underline-offset-4 hover:text-yellow-200"
        >
          <Github size={18} aria-hidden="true" />
          Código aberto no GitHub
        </a>
      </section>

      <footer className="mt-10 text-center text-sm text-green-100">
        Fotos: Wikimedia Commons · Mapas: OpenStreetMap e Natural Earth
      </footer>
    </main>
  );
};
