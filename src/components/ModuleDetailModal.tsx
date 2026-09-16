import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import { Episode } from '../types';
import { Modal } from './ui/Modal';
import { conditionTag, CONDITION_META, formatArs, formatMinutes } from '../lib/format';
import { Play, Lock, Download, Check, FileText } from 'lucide-react';

export const ModuleDetailModal = () => {
  const {
    activeDetailModule,
    setActiveDetailModule,
    isPurchased,
    setActiveVideoEpisode,
    setActiveCheckoutModule,
    watchProgress,
  } = usePlatform();

  if (!activeDetailModule) return null;

  const module = activeDetailModule;
  const unlocked = isPurchased(module.id);
  const totalMinutes = module.episodes.reduce((sum, ep) => sum + ep.durationMinutes, 0);
  const resources = module.episodes.flatMap((ep) => ep.resources ?? []);

  const openEpisode = (episode: Episode) => {
    if (unlocked) {
      setActiveVideoEpisode({ module, episode });
    } else {
      setActiveCheckoutModule(module);
    }
  };

  return (
    <Modal onClose={() => setActiveDetailModule(null)} labelledBy="ficha-modulo" width="lg">
      {/* Portada */}
      <div className="border-b border-rule">
        <img
          src={module.heroBannerUrl}
          alt=""
          className="w-full h-44 sm:h-56 object-cover"
        />
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className={conditionTag(module.condition)}>
            {CONDITION_META[module.condition].label}
          </span>
          <span className="tabular text-2xs uppercase tracking-wider text-ink-muted">
            {module.contentType} · Edición {module.year} · {module.targetAudience}
          </span>
        </div>

        <h2 id="ficha-modulo" className="mt-3 text-3xl sm:text-4xl leading-[1.1]">
          {module.title}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-secondary max-w-prose">
          {module.subtitle}
        </p>

        {/* Barra de acceso */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-rule py-4">
          <dl className="tabular flex flex-wrap items-center gap-x-4 gap-y-1 text-2xs uppercase tracking-wider text-ink-muted">
            <div>
              <dt className="sr-only">Clases</dt>
              <dd>{module.episodes.length} clases</dd>
            </div>
            <span aria-hidden="true">·</span>
            <div>
              <dt className="sr-only">Duración total</dt>
              <dd>{formatMinutes(totalMinutes)}</dd>
            </div>
            <span aria-hidden="true">·</span>
            <div>
              <dt className="sr-only">Material adjunto</dt>
              <dd>{resources.length} PDF</dd>
            </div>
          </dl>

          {unlocked ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ok">
                <Check className="w-4 h-4" aria-hidden="true" />
                Acceso habilitado
              </span>
              <button onClick={() => openEpisode(module.episodes[0])} className="btn btn-primary">
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                Ver primera clase
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="tabular text-xl text-ink">{formatArs(module.priceArs)}</p>
                <p className="text-2xs text-ink-muted">Pago único, acceso permanente</p>
              </div>
              <button onClick={() => setActiveCheckoutModule(module)} className="btn btn-primary">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                Desbloquear módulo
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Índice de clases */}
          <div className="lg:col-span-7">
            <p className="kicker">Índice de clases</p>
            <ol className="mt-4 border-t border-rule">
              {module.episodes.map((episode) => {
                const progress = watchProgress[episode.id];
                return (
                  <li key={episode.id} className="border-b border-rule">
                    <button
                      onClick={() => openEpisode(episode)}
                      className="group w-full text-left flex items-start gap-4 py-4 transition-colors hover:bg-subtle/60"
                    >
                      <span className="tabular text-2xs text-ink-muted pt-1 w-6 shrink-0">
                        {String(episode.episodeNumber).padStart(2, '0')}
                      </span>

                      <span className="flex-1 min-w-0">
                        <span className="block text-base font-semibold text-ink group-hover:text-accent transition-colors">
                          {episode.title}
                        </span>
                        <span className="block mt-1 text-[13px] leading-relaxed text-ink-secondary line-clamp-2">
                          {episode.synopsis}
                        </span>
                        {progress && progress.percent > 0 && (
                          <span className="progress-track mt-2 block max-w-[220px]">
                            <span
                              className="progress-fill block"
                              style={{ width: `${progress.percent}%` }}
                            />
                          </span>
                        )}
                      </span>

                      <span className="tabular flex items-center gap-2 text-2xs text-ink-muted shrink-0 pt-1">
                        {episode.durationMinutes} MIN
                        {unlocked ? (
                          <Play className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                        ) : (
                          <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Columna lateral */}
          <aside className="lg:col-span-5 space-y-8">
            {module.keyLearningPoints.length > 0 && (
              <div>
                <p className="kicker">Qué resuelve</p>
                <ul className="mt-4 space-y-2.5">
                  {module.keyLearningPoints.map((point) => (
                    <li key={point} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-secondary">
                      <Check className="w-3.5 h-3.5 mt-1 shrink-0 text-ok" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="kicker">Material descargable</p>
              {resources.length > 0 ? (
                <ul className="mt-4 border-t border-rule">
                  {resources.map((resource) => (
                    <li
                      key={resource.title}
                      className="flex items-center justify-between gap-3 border-b border-rule py-3"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 shrink-0 text-ink-muted" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block text-[13px] font-medium text-ink truncate">
                            {resource.title}
                          </span>
                          <span className="tabular block text-2xs uppercase text-ink-muted">
                            {resource.type} · {resource.size}
                          </span>
                        </span>
                      </span>

                      {unlocked ? (
                        <a
                          href={resource.downloadUrl ?? '#'}
                          download
                          className="btn btn-secondary px-3 py-2 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" aria-hidden="true" />
                          Descargar
                        </a>
                      ) : (
                        <span className="tabular text-2xs text-ink-muted shrink-0">
                          <Lock className="w-3 h-3 inline mr-1" aria-hidden="true" />
                          BLOQUEADO
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[13px] text-ink-secondary">
                  Este programa entrega el material dentro del reproductor.
                </p>
              )}
            </div>

            {/* Autoría clínica */}
            <div className="border-t border-ink pt-4">
              <div className="flex items-center gap-3">
                <img
                  src={module.doctor.avatarUrl}
                  alt=""
                  className="w-12 h-12 rounded-xs object-cover border border-rule"
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-ink">{module.doctor.name}</p>
                  <p className="tabular text-2xs uppercase tracking-wider text-ink-muted">
                    Matrícula {module.doctor.licenseNumber}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-secondary">
                {module.doctor.bio}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </Modal>
  );
};
