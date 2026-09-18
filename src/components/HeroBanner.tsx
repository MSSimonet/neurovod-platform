import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { leadDoctor } from '../data/catalog';
import { scrollToCatalog } from '../lib/scrollToCatalog';
import { Search, ShieldCheck } from 'lucide-react';
import { imageAt, retratoSrcSet } from '../lib/imageUrl';

export const HeroBanner = () => {
  const { modules, setFilters } = usePlatform();

  /**
   * La consulta se guarda acá y recién viaja al filtro global al enviar.
   * Si escribiera directo sobre el filtro, la portada se reemplazaría por el
   * listado de resultados con la primera letra y el campo desaparecería
   * debajo del cursor.
   */
  const [consulta, setConsulta] = useState('');

  const totalEpisodes = modules.reduce((acc, mod) => acc + mod.episodes.length, 0);
  const totalMinutes = modules.reduce(
    (acc, mod) => acc + mod.episodes.reduce((sum, ep) => sum + ep.durationMinutes, 0),
    0,
  );
  const totalHours = Math.round(totalMinutes / 60);

  const indicadores = [
    `${String(modules.length).padStart(2, '0')} programas`,
    `${totalEpisodes} clases`,
    `${totalHours} h de material`,
    `+${leadDoctor.experienceYears} años de consultorio`,
  ];

  const buscar = (event: React.FormEvent) => {
    event.preventDefault();
    setFilters((prev) => ({ ...prev, searchQuery: consulta }));
    scrollToCatalog();
  };

  return (
    /* La sección va a ancho completo, sin contenedor: el retrato sangra hasta
       el borde derecho de la pantalla. El texto se alinea igual con el resto
       del sitio gracias al bloque interno acotado más abajo. */
    <section className="border-b border-rule bg-card">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[600px]">
        {/* Columna editorial */}
        <div className="flex justify-end order-1">
          <div className="w-full max-w-[620px] px-5 md:px-8 xl:px-12 py-12 lg:py-20 flex flex-col justify-center">
            <p className="kicker">Compendio clínico en video · Edición 2026</p>

            <h1 className="mt-5 text-[2.5rem] sm:text-6xl xl:text-[4.25rem] leading-[1.02]">
              Lo que explico en consulta, ordenado para que puedas volver a verlo.
            </h1>

            <p className="mt-6 text-[15px] leading-relaxed text-ink-secondary">
              Protocolos de TDAH, Autismo y regulación sensorial, filmados por el médico que los
              aplica. Cada clase trae su guía en PDF y su bibliografía.
            </p>

            {/* Buscador clínico integrado */}
            <form onSubmit={buscar} className="mt-7 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={consulta}
                  onChange={(e) => setConsulta(e.target.value)}
                  placeholder="Escribí el síntoma: sueño, colapso, escuela"
                  aria-label="Buscar por síntoma o tema clínico"
                  className="field pl-9 py-3"
                />
              </div>
              <button type="submit" className="btn btn-primary py-3">
                Buscar en el catálogo
              </button>
            </form>

            {/* Indicadores del compendio, en una sola línea de filete */}
            <p className="tabular mt-10 pt-5 border-t border-rule text-2xs uppercase tracking-wider text-ink-muted">
              {indicadores.join(' · ')}
            </p>

            <p className="mt-4 flex items-start gap-2 text-[13px] leading-relaxed text-ink-secondary">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-ok" aria-hidden="true" />
              <span>
                Contenido revisado contra criterios DSM-5-TR y guías de la Sociedad Argentina de
                Pediatría.
              </span>
            </p>
          </div>
        </div>

        {/* Retrato del profesional, a sangre contra el borde de la pantalla */}
        <figure className="relative order-2 min-h-[420px] lg:min-h-0 border-t lg:border-t-0 border-rule">
          <img
            src={imageAt(leadDoctor.avatarUrl, 1000)}
            srcSet={retratoSrcSet()}
            /* Media pantalla desde el escritorio; todo el ancho en teléfono. */
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt={`Retrato del ${leadDoctor.name}`}
            className="absolute inset-0 w-full h-full object-cover object-top"
            loading="eager"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-ink/90 px-5 md:px-8 py-4">
            <h2 className="text-xl sm:text-2xl leading-tight text-ink-inverse">
              {leadDoctor.name}
            </h2>
            <p className="tabular mt-1 text-2xs uppercase tracking-wider text-rule-strong">
              {leadDoctor.specialty} · Matrícula {leadDoctor.licenses[0]} · Entre Ríos y Corrientes
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
