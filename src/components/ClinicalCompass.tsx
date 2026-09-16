import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import { ConditionType } from '../types';
import { scrollToCatalog } from '../lib/scrollToCatalog';
import { ArrowRight } from 'lucide-react';

interface CompassEntry {
  id: string;
  moduleId: string;
  situation: string;
  detail: string;
  fallbackCondition: ConditionType;
}

const ENTRIES: CompassEntry[] = [
  {
    id: 'colapso',
    moduleId: 'autismo-desregulacion-colapsos',
    situation: 'Mi hijo colapsa y no sé qué hacer en el momento',
    detail: 'Diferencia entre berrinche y colapso sensorial. Protocolo de contención paso a paso.',
    fallbackCondition: 'Autismo',
  },
  {
    id: 'atencion',
    moduleId: 'tdah-infancia-integral',
    situation: 'No se concentra y en la escuela ya me llamaron',
    detail: 'Química de la atención, rutinas sostenibles y qué pedir en la reunión con docentes.',
    fallbackCondition: 'TDAH',
  },
  {
    id: 'sueno',
    moduleId: 'guia-sueno-neurodivergente',
    situation: 'Todas las noches son una batalla para dormir',
    detail: 'Protocolo nocturno de cuatro fases. Cuándo se evalúa melatonina y cuándo no.',
    fallbackCondition: 'Sensorial',
  },
  {
    id: 'comunicacion',
    moduleId: 'tea-comunicacion-apoyos-visuales',
    situation: 'Le cuesta comunicarse y anticipar los cambios',
    detail: 'Tableros pictográficos, anticipación visual y modelado del lenguaje en el juego.',
    fallbackCondition: 'Autismo',
  },
];

/**
 * Brújula clínica al estilo Mayo Clinic: la familia entra por el problema
 * concreto, no por la taxonomía médica.
 */
export const ClinicalCompass = () => {
  const { modules, setActiveDetailModule, setFilters } = usePlatform();

  const openEntry = (entry: CompassEntry) => {
    const target = modules.find((m) => m.id === entry.moduleId);
    if (target) {
      setActiveDetailModule(target);
      return;
    }
    setFilters((prev) => ({ ...prev, condition: entry.fallbackCondition, searchQuery: '' }));
    scrollToCatalog();
  };

  return (
    <section className="py-12 lg:py-16 border-b border-rule bg-subtle">
      <div className="shell">
        <header className="mb-7">
          <p className="kicker">Consulta rápida</p>
          <h2 className="mt-2 text-3xl sm:text-4xl leading-tight">
            ¿Qué está pasando en tu casa esta semana?
          </h2>
          <p className="mt-2 max-w-prose text-[13px] leading-relaxed text-ink-secondary">
            Cuatro entradas directas al abordaje que corresponde. Sin recorrer todo el catálogo.
          </p>
        </header>

        <div className="rule-grid grid-cols-1 md:grid-cols-2 bg-card">
          {ENTRIES.map((entry, index) => (
            <button
              key={entry.id}
              onClick={() => openEntry(entry)}
              className="rule-cell group text-left p-6 transition-colors hover:bg-accent-surface"
            >
              <div className="flex items-start gap-5">
                <span className="tabular text-2xs text-ink-muted pt-1.5 shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="text-xl leading-snug group-hover:text-accent transition-colors">
                    {entry.situation}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-secondary">
                    {entry.detail}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent">
                    Abrir protocolo
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
