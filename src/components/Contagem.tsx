import { useEffect, useState } from 'react';

interface ContagemProps {
  bandeira?: string;
  frase: string;
  onFim: () => void;
}

const PASSOS = [
  { texto: 'Preparado?', ms: 1300 },
  { texto: '3', ms: 800 },
  { texto: '2', ms: 800 },
  { texto: '1', ms: 800 },
  { texto: 'Vamos lá!', ms: 900 },
];

/** "Preparado? 3, 2, 1, Vamos lá!" antes de o cronômetro começar. */
export const Contagem = ({ bandeira, frase, onFim }: ContagemProps) => {
  const [passo, setPasso] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => (passo < PASSOS.length - 1 ? setPasso(passo + 1) : onFim()), PASSOS[passo].ms);
    return () => clearTimeout(t);
  }, [passo, onFim]);

  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
      {bandeira && <img src={bandeira} alt="" className="h-20 w-32 rounded-lg object-cover shadow-lg ring-4 ring-white" />}
      <p className="mt-5 max-w-xl text-xl text-green-50">{frase}</p>
      <p key={passo} aria-live="assertive" className="mt-4 animate-in zoom-in-50 fade-in font-titulo font-bold leading-none text-yellow-300 duration-300"
        style={{ fontSize: 'clamp(3rem, 15vw, 6.5rem)' }}>
        {PASSOS[passo].texto}
      </p>
      <p className="mt-6 text-green-100">⏱️ O cronômetro começa quando aparecerem as pistas.</p>
    </main>
  );
};
