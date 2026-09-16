import React from 'react';
import { ModuleItem } from '../types';
import { ModuleCard } from './ModuleCard';

interface ContentRowProps {
  /** Rótulo monoespaciado que ordena la sección dentro del compendio */
  kicker: string;
  title: string;
  summary?: string;
  modules: ModuleItem[];
  id?: string;
}

/**
 * Sección del catálogo en retícula editorial.
 * Reemplaza al antiguo carrusel horizontal: ninguna ficha queda oculta
 * fuera de pantalla y la cuadrícula muestra sus divisiones de 1px.
 */
export const ContentRow = ({ kicker, title, summary, modules, id }: ContentRowProps) => {
  if (modules.length === 0) return null;

  return (
    <section id={id} className="py-12 lg:py-16 border-b border-rule">
      <div className="shell">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
          <div>
            <p className="kicker">{kicker}</p>
            <h2 className="mt-2 text-3xl sm:text-4xl leading-tight">{title}</h2>
            {summary && (
              <p className="mt-2 max-w-prose text-[13px] leading-relaxed text-ink-secondary">
                {summary}
              </p>
            )}
          </div>
          <p className="tabular text-2xs text-ink-muted shrink-0">
            {String(modules.length).padStart(2, '0')}{' '}
            {modules.length === 1 ? 'PROGRAMA' : 'PROGRAMAS'}
          </p>
        </header>

        <div className="rule-grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module, index) => (
            <ModuleCard key={module.id} module={module} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
