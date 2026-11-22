import type { ReactNode } from 'react';

/**
 * Barra fixa no rodapé da tela com a ação da vez (confirmar, próximo prato).
 * Fica fora do mapa, nunca por cima dele. A página precisa de espaço embaixo: use a classe "com-barra" no <main>.
 */
export const BarraInferior = ({ children, info }: { children: ReactNode; info?: ReactNode }) => (
  <div className="fixed inset-x-0 bottom-0 z-[1100] border-t-2 border-green-900/10 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-green-950 shadow-[0_-8px_24px_rgba(5,46,22,0.15)] backdrop-blur">
    <div className="mx-auto flex max-w-5xl flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
      {info && <div className="min-w-0 text-center text-sm font-semibold text-stone-700 sm:text-left sm:text-base">{info}</div>}
      <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row">{children}</div>
    </div>
  </div>
);
