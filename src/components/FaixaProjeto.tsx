import { useState } from 'react';
import { Github, X } from 'lucide-react';

const CHAVE = 'tapionde-faixa-fechada';

const lerFechada = () => {
  try {
    return localStorage.getItem(CHAVE) === '1';
  } catch {
    return false;
  }
};

/** Apresentação do projeto para quem chega pelo portfólio: o que é e link do código. */
export const FaixaProjeto = () => {
  const [fechada, setFechada] = useState(lerFechada);
  if (fechada) return null;

  const fechar = () => {
    setFechada(true);
    try {
      localStorage.setItem(CHAVE, '1');
    } catch {
      /* armazenamento indisponível: a faixa só some nesta visita */
    }
  };

  return (
    <aside aria-label="Sobre o projeto" className="bg-blue-950 text-white text-sm" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 py-2 pl-4 pr-12 sm:flex-nowrap sm:pr-4">
        <p className="min-w-0 flex-1 basis-full leading-snug sm:basis-auto">
          <b className="mr-1 text-yellow-300">TapiOnde</b>
          <span className="text-white/90">Jogo de geografia gastronômica: veja os ingredientes e descubra de onde vem cada prato da América Latina.</span>
          <small className="mt-0.5 block text-green-300 sm:ml-2 sm:mt-0 sm:inline">Pratos reais · fotos do Wikimedia Commons</small>
        </p>
        <a
          href="https://github.com/dudabarbozat/tapi-onde"
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-none items-center gap-1.5 whitespace-nowrap rounded-md bg-yellow-400 px-3 py-1.5 font-semibold text-blue-950 hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Github size={16} aria-hidden="true" />
          Ver o código no GitHub
        </a>
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar apresentação do projeto"
          className="absolute right-2 top-1.5 grid h-8 w-8 place-items-center rounded-md hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:static"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
};
