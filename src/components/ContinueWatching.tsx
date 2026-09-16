import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import { formatMinutes } from '../lib/format';
import { Play, ListVideo } from 'lucide-react';

/**
 * Trayecto activo del paciente. Aparece solo si hay una clase empezada
 * y sin terminar, para que la familia retome donde dejó.
 */
export const ContinueWatching = () => {
  const { modules, watchProgress, purchasedModuleIds, setActiveVideoEpisode, setActiveDetailModule } =
    usePlatform();

  const resumePoint = modules
    .filter((mod) => purchasedModuleIds.includes(mod.id))
    .flatMap((mod) => mod.episodes.map((episode) => ({ mod, episode })))
    .find(({ episode }) => {
      const entry = watchProgress[episode.id];
      return entry && entry.percent > 0 && !entry.completed;
    });

  if (!resumePoint) return null;

  const { mod, episode } = resumePoint;
  const progress = watchProgress[episode.id];
  const remainingMinutes = Math.max(
    1,
    Math.round(episode.durationMinutes * (1 - progress.percent / 100)),
  );

  return (
    <section className="border-b border-rule bg-card" aria-label="Continuar viendo">
      <div className="shell py-6">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <img
            src={episode.thumbnailUrl}
            alt=""
            className="w-full md:w-40 aspect-[16/9] object-cover rounded-xs border border-rule shrink-0"
            loading="lazy"
          />

          <div className="flex-1 min-w-0">
            <p className="kicker">
              Trayecto activo · {progress.percent}% completado · restan {formatMinutes(remainingMinutes)}
            </p>
            {/* Dos líneas antes de recortar: el título de la clase es el dato que
                la familia necesita leer entero para saber dónde quedó. */}
            <h2 className="mt-1.5 text-xl leading-snug line-clamp-2">{episode.title}</h2>
            <p className="mt-1 text-[13px] text-ink-secondary line-clamp-1">{mod.title}</p>

            <div className="progress-track mt-3 max-w-md">
              <div className="progress-fill" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveVideoEpisode({ module: mod, episode })}
              className="btn btn-primary"
            >
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              Retomar la clase
            </button>
            <button onClick={() => setActiveDetailModule(mod)} className="btn btn-secondary">
              <ListVideo className="w-3.5 h-3.5" aria-hidden="true" />
              Ver el programa
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
