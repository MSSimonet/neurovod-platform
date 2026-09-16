import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { formatClock } from '../lib/format';
import {
  X, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX,
  Maximize, Minimize, ListVideo, Download, FileText,
} from 'lucide-react';

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export const VideoPlayerModal = () => {
  const { activeVideoEpisode, setActiveVideoEpisode, updateWatchProgress, watchProgress } =
    usePlatform();

  const videoRef = useRef<HTMLVideoElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<'chapters' | 'episodes' | 'materials'>('chapters');
  const [hasError, setHasError] = useState(false);

  const close = useCallback(() => setActiveVideoEpisode(null), [setActiveVideoEpisode]);

  // El bloqueo de scroll y la tecla Escape solo aplican con el reproductor abierto.
  useEffect(() => {
    if (!activeVideoEpisode) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (hideControlsTimer.current) window.clearTimeout(hideControlsTimer.current);
    };
  }, [activeVideoEpisode, close]);

  if (!activeVideoEpisode) return null;

  const { module, episode } = activeVideoEpisode;
  const resources = episode.resources ?? [];

  const revealControls = () => {
    setShowControls(true);
    if (hideControlsTimer.current) window.clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3200);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    updateWatchProgress(episode.id, video.currentTime, video.duration || 1);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setHasError(false);
    setDuration(video.duration);
    const saved = watchProgress[episode.id];
    if (saved && saved.seconds > 5 && saved.seconds < video.duration - 10) {
      video.currentTime = saved.seconds;
      setCurrentTime(saved.seconds);
    }
    void video.play().catch(() => setIsPlaying(false));
  };

  const seekTo = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(duration || video.duration, seconds));
    setCurrentTime(video.currentTime);
  };

  const changeSpeed = (value: number) => {
    setSpeed(value);
    if (videoRef.current) videoRef.current.playbackRate = value;
  };

  const toggleFullscreen = () => {
    if (!shellRef.current) return;
    if (!document.fullscreenElement) {
      void shellRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => undefined);
    } else {
      void document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => undefined);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div
      ref={shellRef}
      onMouseMove={revealControls}
      className="fixed inset-0 z-50 flex bg-ink"
    >
      {/* Superficie de video */}
      <div className="relative flex-1 min-w-0 bg-black">
        <video
          ref={videoRef}
          src={episode.videoUrl}
          poster={episode.thumbnailUrl}
          className="w-full h-full object-contain"
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => setHasError(true)}
          playsInline
        />

        {/* El video no llegó. Se dice qué pasó y qué hacer. */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="max-w-sm bg-card border border-rule-strong p-6 text-center">
              <h3 className="text-xl leading-tight">La clase no se pudo cargar.</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-secondary">
                Puede ser un corte de conexión o que el servidor de video esté fuera de alcance
                desde esta red. Reintentá en unos segundos.
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setHasError(false);
                    videoRef.current?.load();
                  }}
                  className="btn btn-primary"
                >
                  Reintentar
                </button>
                <button onClick={close} className="btn btn-secondary">
                  Volver al catálogo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Encabezado */}
        <div
          className={`absolute inset-x-0 top-0 p-4 sm:p-5 flex items-start justify-between gap-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-200 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={close}
              aria-label="Cerrar el reproductor"
              className="w-9 h-9 flex items-center justify-center rounded-xs bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <p className="tabular text-2xs uppercase tracking-wider text-white/60 truncate">
                {module.title} · Clase {episode.episodeNumber}
              </p>
              <h2 className="text-base font-sans font-semibold text-white truncate">
                {episode.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsPanelOpen((open) => !open)}
            aria-expanded={isPanelOpen}
            className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xs bg-white/10 text-white text-[13px] font-medium hover:bg-white/20 transition-colors"
          >
            <ListVideo className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Índice</span>
          </button>
        </div>

        {/* Controles */}
        <div
          className={`absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-black/85 to-transparent transition-opacity duration-200 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="relative">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              aria-label="Línea de tiempo de la clase"
              className="w-full h-1 accent-accent cursor-pointer"
            />
            {duration > 0 &&
              episode.chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => seekTo(chapter.timeSeconds)}
                  title={chapter.title}
                  style={{ left: `${(chapter.timeSeconds / duration) * 100}%` }}
                  className="absolute top-0 w-0.5 h-3 -translate-y-1 bg-white/70 hover:bg-white"
                >
                  <span className="sr-only">{chapter.title}</span>
                </button>
              ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                className="w-10 h-10 flex items-center justify-center rounded-xs bg-accent hover:bg-accent-hover transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={() => seekTo(currentTime - 10)}
                aria-label="Retroceder diez segundos"
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => seekTo(currentTime + 10)}
                aria-label="Adelantar diez segundos"
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <div className="hidden sm:flex items-center gap-1.5">
                <button onClick={toggleMute} aria-label={isMuted ? 'Activar sonido' : 'Silenciar'} className="p-2 text-white/80 hover:text-white">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setVolume(value);
                    setIsMuted(value === 0);
                    if (videoRef.current) {
                      videoRef.current.volume = value;
                      videoRef.current.muted = value === 0;
                    }
                  }}
                  aria-label="Volumen"
                  className="w-20 h-1 accent-white cursor-pointer"
                />
              </div>

              <p className="tabular text-2xs text-white/70">
                {formatClock(currentTime)} / {formatClock(duration)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center border border-white/20 rounded-xs overflow-hidden">
                {SPEEDS.map((value) => (
                  <button
                    key={value}
                    onClick={() => changeSpeed(value)}
                    className={`tabular px-2 py-1 text-2xs transition-colors ${
                      speed === value ? 'bg-white text-ink' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {value}x
                  </button>
                ))}
              </div>
              <button
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Índice lateral en papel claro */}
      {isPanelOpen && (
        /* En pantallas angostas el índice cubre el video; desde md convive con él. */
        <aside className="absolute inset-0 z-20 md:static md:inset-auto md:w-full md:max-w-sm bg-card border-l border-rule-strong flex flex-col">
          <div className="flex border-b border-rule">
            {([
              ['chapters', 'Capítulos'],
              ['episodes', 'Clases'],
              ['materials', 'Material'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPanelTab(key)}
                className={`flex-1 py-3 text-[13px] font-medium border-b-2 transition-colors ${
                  panelTab === key
                    ? 'border-accent text-accent'
                    : 'border-transparent text-ink-secondary hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setIsPanelOpen(false)}
              aria-label="Cerrar el índice"
              className="px-4 text-ink-muted hover:text-ink md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {panelTab === 'chapters' && (
              <ul>
                {episode.chapters.map((chapter) => (
                  <li key={chapter.id} className="border-b border-rule">
                    <button
                      onClick={() => seekTo(chapter.timeSeconds)}
                      className="w-full text-left px-5 py-3.5 flex items-baseline gap-3 hover:bg-subtle transition-colors"
                    >
                      <span className="tabular text-2xs text-ink-muted shrink-0">
                        {formatClock(chapter.timeSeconds)}
                      </span>
                      <span className="text-[13px] text-ink">{chapter.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {panelTab === 'episodes' && (
              <ul>
                {module.episodes.map((item) => {
                  const isCurrent = item.id === episode.id;
                  return (
                    <li key={item.id} className="border-b border-rule">
                      <button
                        onClick={() => setActiveVideoEpisode({ module, episode: item })}
                        className={`w-full text-left px-5 py-3.5 flex items-start gap-3 transition-colors ${
                          isCurrent ? 'bg-accent-surface' : 'hover:bg-subtle'
                        }`}
                      >
                        <span className="tabular text-2xs text-ink-muted pt-0.5 shrink-0">
                          {String(item.episodeNumber).padStart(2, '0')}
                        </span>
                        <span className="min-w-0">
                          <span className={`block text-[13px] font-medium ${isCurrent ? 'text-accent' : 'text-ink'}`}>
                            {item.title}
                          </span>
                          <span className="tabular block text-2xs text-ink-muted mt-0.5">
                            {item.durationMinutes} MIN
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {panelTab === 'materials' && (
              <div className="p-5">
                {resources.length > 0 ? (
                  <ul className="border-t border-rule">
                    {resources.map((resource) => (
                      <li
                        key={resource.title}
                        className="flex items-center justify-between gap-3 border-b border-rule py-3"
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 shrink-0 text-ink-muted" aria-hidden="true" />
                          <span className="text-[13px] text-ink truncate">{resource.title}</span>
                        </span>
                        <a
                          href={resource.downloadUrl ?? '#'}
                          download
                          className="btn btn-secondary px-3 py-2 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" aria-hidden="true" />
                          PDF
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[13px] text-ink-secondary">
                    Esta clase no tiene material adjunto.
                  </p>
                )}
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
