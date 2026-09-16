import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import { leadDoctor } from '../data/catalog';
import { Search, ShieldCheck } from 'lucide-react';

export const HeroBanner = () => {
  const { modules, filters, setFilters } = usePlatform();

  const totalEpisodes = modules.reduce((acc, mod) => acc + mod.episodes.length, 0);
  const totalMinutes = modules.reduce(
    (acc, mod) => acc + mod.episodes.reduce((sum, ep) => sum + ep.durationMinutes, 0),
    0,
  );
  const totalHours = Math.round(totalMinutes / 60);

  const stats = [
    { value: String(modules.length).padStart(2, '0'), label: 'Programas clínicos' },
    { value: String(totalEpisodes), label: 'Clases en video' },
    { value: `${totalHours} h`, label: 'Material grabado' },
    { value: leadDoctor.experienceYears.toString(), label: 'Años de consultorio' },
  ];

  const goToCatalog = (event: React.FormEvent) => {
    event.preventDefault();
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="border-b border-rule bg-card">
      <div className="shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
          {/* Columna editorial */}
          <div className="lg:col-span-7 py-10 lg:py-16 lg:pr-12 lg:border-r border-rule">
            <p className="kicker">Compendio clínico en video · Edición 2026</p>

            <h1 className="mt-5 text-[2.5rem] sm:text-6xl lg:text-[4.25rem] leading-[0.98]">
              Lo que explico en consulta,
              <br />
              <span className="italic">ordenado para que puedas volver a verlo.</span>
            </h1>

            <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-ink-secondary">
              Protocolos de TDAH, Autismo y regulación sensorial, filmados por el médico que los
              aplica. Cada clase trae su guía en PDF y su bibliografía.
            </p>

            {/* Buscador clínico integrado */}
            <form onSubmit={goToCatalog} className="mt-7 flex flex-col sm:flex-row gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder="Escribí el síntoma: sueño, colapso, escuela, medicación"
                  aria-label="Buscar por síntoma o tema clínico"
                  className="field pl-9 py-3"
                />
              </div>
              <button type="submit" className="btn btn-primary py-3">
                Buscar en el catálogo
              </button>
            </form>

            {/* Indicadores del compendio */}
            <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 border-t border-l border-rule">
              {stats.map((stat) => (
                <div key={stat.label} className="rule-cell px-4 py-3">
                  <dt className="text-2xs uppercase tracking-wider text-ink-muted">{stat.label}</dt>
                  <dd className="tabular mt-1 text-xl text-ink">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Ficha del profesional responsable */}
          <aside className="lg:col-span-5 py-10 lg:py-16 border-t lg:border-t-0 border-rule">
            <figure className="relative">
              <img
                src={leadDoctor.avatarUrl}
                alt={`Retrato del ${leadDoctor.name}`}
                className="w-full aspect-[4/5] object-cover rounded-xs border border-rule"
                loading="eager"
              />
              <figcaption className="mt-4 border-t border-ink pt-4">
                <h2 className="text-2xl leading-tight">{leadDoctor.name}</h2>
                <p className="mt-1 text-[13px] text-ink-secondary">{leadDoctor.title}</p>
                <p className="tabular mt-2 text-2xs uppercase tracking-wider text-ink-muted">
                  Matrícula {leadDoctor.licenseNumber} · {leadDoctor.specialty}
                </p>
              </figcaption>
            </figure>

            <p className="mt-5 flex items-start gap-2 text-[13px] leading-relaxed text-ink-secondary">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-ok" aria-hidden="true" />
              <span>
                Contenido revisado contra criterios DSM-5-TR y guías de la Sociedad Argentina de
                Pediatría. Cada módulo cita su bibliografía.
              </span>
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
};
