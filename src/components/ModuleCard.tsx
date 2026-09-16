import React from 'react';
import { ModuleItem } from '../types';
import { usePlatform } from '../context/PlatformContext';
import { conditionTag, CONDITION_META, formatArs, formatMinutes, folio } from '../lib/format';
import { Play, Lock, Check, FileText } from 'lucide-react';

interface ModuleCardProps {
  module: ModuleItem;
  index: number;
}

export const ModuleCard = ({ module, index }: ModuleCardProps) => {
  const { isPurchased, setActiveDetailModule, setActiveVideoEpisode, setActiveCheckoutModule, watchProgress } =
    usePlatform();

  const unlocked = isPurchased(module.id);
  const totalMinutes = module.episodes.reduce((sum, ep) => sum + ep.durationMinutes, 0);
  const pdfCount = module.episodes.reduce((sum, ep) => sum + (ep.resources?.length ?? 0), 0);

  const firstEpisode = module.episodes[0];
  const progress = firstEpisode ? watchProgress[firstEpisode.id] : undefined;

  const handlePrimaryAction = () => {
    if (unlocked && firstEpisode) {
      setActiveVideoEpisode({ module, episode: firstEpisode });
    } else {
      setActiveCheckoutModule(module);
    }
  };

  return (
    <article className="rule-cell lift flex flex-col bg-card hover:bg-subtle/40">
      {/* Cabecera de ficha: folio del compendio y condición clínica */}
      <div className="flex items-center justify-between px-5 pt-4">
        <span className="tabular text-2xs text-ink-muted">FICHA {folio(index)}</span>
        <span className={conditionTag(module.condition)}>{CONDITION_META[module.condition].label}</span>
      </div>

      <button
        onClick={() => setActiveDetailModule(module)}
        className="group text-left px-5 pt-4"
        aria-label={`Abrir la ficha de ${module.title}`}
      >
        <div className="relative overflow-hidden border border-rule rounded-xs">
          <img
            src={module.thumbnailUrl}
            alt=""
            className="w-full aspect-[16/9] object-cover"
            loading="lazy"
          />
          {unlocked && progress && progress.percent > 0 && (
            <div className="progress-track absolute bottom-0 left-0">
              <div className="progress-fill" style={{ width: `${progress.percent}%` }} />
            </div>
          )}
        </div>

        <h3 className="mt-4 text-2xl leading-[1.15] group-hover:text-accent transition-colors">
          {module.title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-secondary line-clamp-2">
          {module.subtitle}
        </p>
      </button>

      {/* Metadatos clínicos */}
      <dl className="tabular mt-4 px-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs text-ink-muted">
        <div className="flex items-center gap-1">
          <dt className="sr-only">Clases</dt>
          <dd>{module.episodes.length} CLASES</dd>
        </div>
        <span aria-hidden="true">·</span>
        <div className="flex items-center gap-1">
          <dt className="sr-only">Duración</dt>
          <dd>{formatMinutes(totalMinutes)}</dd>
        </div>
        {pdfCount > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" aria-hidden="true" />
              <dt className="sr-only">Material descargable</dt>
              <dd>{pdfCount} PDF</dd>
            </div>
          </>
        )}
        <span aria-hidden="true">·</span>
        <div>
          <dt className="sr-only">Edad sugerida</dt>
          <dd>{module.targetAudience.toUpperCase()}</dd>
        </div>
      </dl>

      {/* Pie de acceso */}
      <div className="mt-auto pt-4 px-5 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3 border-t border-rule pt-4">
          {unlocked ? (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ok">
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              Desbloqueado
            </span>
          ) : (
            <span className="tabular text-base font-medium text-ink">{formatArs(module.priceArs)}</span>
          )}

          <button
            onClick={handlePrimaryAction}
            className={`btn ${unlocked ? 'btn-secondary' : 'btn-primary'} px-4 py-2.5`}
          >
            {unlocked ? (
              <>
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                Ver clase
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                Desbloquear módulo
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
