import React, { useState, useRef, useEffect } from 'react';
import { usePlatform } from '../context/PlatformContext';
import {
  X, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX,
  Maximize, Minimize, List, BookOpen, Clock, ChevronRight, CheckCircle2, ShieldCheck, Download
} from 'lucide-react';

export const VideoPlayerModal: React.FC = () => {
  const { activeVideoEpisode, setActiveVideoEpisode, updateWatchProgress, watchProgress } = usePlatform();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chapters' | 'episodes' | 'notes'>('chapters');

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!activeVideoEpisode) return null;

  const { module, episode } = activeVideoEpisode;

  // Auto-hide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(current);
    updateWatchProgress(episode.id, current, dur);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    // Restore saved time if available
    const saved = watchProgress[episode.id];
    if (saved && saved.seconds > 5 && saved.seconds < videoRef.current.duration - 10) {
      videoRef.current.currentTime = saved.seconds;
      setCurrentTime(saved.seconds);
    }
    videoRef.current.play().catch(() => setIsPlaying(false));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    videoRef.current.muted = nextMute;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const jumpToChapter = (chapterSeconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = chapterSeconds;
      setCurrentTime(chapterSeconds);
      if (!isPlaying) {
        videoRef.current.play();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={episode.videoUrl}
        poster={episode.thumbnailUrl}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        playsInline
      />

      {/* Top Bar: Title & Close */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 max-w-2xl">
          <button
            onClick={() => setActiveVideoEpisode(null)}
            className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition-colors"
            aria-label="Volver a la plataforma"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <span>{module.title}</span>
              <span>•</span>
              <span className="text-slate-300">Episodio {episode.episodeNumber}</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white truncate drop-shadow">
              {episode.title}
            </h3>
          </div>
        </div>

        {/* Playlist & Notes Drawer Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-colors ${
              isSidebarOpen
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Capítulos & Episodios</span>
          </button>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar & Chapter Markers */}
        <div className="relative mb-3 group/timeline">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-2.5 transition-all"
          />

          {/* Chapter Tick Marks */}
          {duration > 0 &&
            episode.chapters.map((ch) => {
              const leftPercent = (ch.timeSeconds / duration) * 100;
              return (
                <div
                  key={ch.id}
                  onClick={() => jumpToChapter(ch.timeSeconds)}
                  style={{ left: `${leftPercent}%` }}
                  title={ch.title}
                  className="absolute top-0 w-1 h-2 bg-amber-400 rounded-sm hover:h-4 hover:w-1.5 -translate-y-0.5 cursor-pointer shadow-sm shadow-black"
                />
              );
            })}
        </div>

        {/* Control Buttons Row */}
        <div className="flex items-center justify-between gap-4 text-white">
          {/* Left Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 sm:p-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
            </button>

            {/* Skip -10s */}
            <button
              onClick={() => skipTime(-10)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              title="Retroceder 10 segundos"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Skip +10s */}
            <button
              onClick={() => skipTime(10)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              title="Adelantar 10 segundos"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/volume">
              <button
                onClick={toggleMute}
                className="p-2 text-slate-300 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  setIsMuted(val === 0);
                  if (videoRef.current) {
                    videoRef.current.volume = val;
                    videoRef.current.muted = false;
                  }
                }}
                className="w-16 sm:w-20 h-1 bg-slate-700 accent-cyan-400 rounded cursor-pointer"
              />
            </div>

            {/* Time Stamp */}
            <div className="text-xs font-medium text-slate-300 tracking-wider">
              <span>{formatTime(currentTime)}</span>
              <span className="text-slate-500"> / </span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Playback Speed Selector */}
            <div className="flex items-center bg-slate-900/80 rounded-lg border border-slate-700 p-0.5">
              {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-1.5 sm:px-2 py-0.5 text-[11px] font-bold rounded transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Sidebar for Chapters & Playlist */}
      {isSidebarOpen && (
        <div className="absolute top-0 right-0 bottom-0 w-80 sm:w-96 bg-slate-950/95 border-l border-slate-800 backdrop-blur-xl z-40 flex flex-col p-4 animate-scale-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Guía del Contenido
            </h4>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Tabs */}
          <div className="flex gap-2 py-2 border-b border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'chapters'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Capítulos
            </button>
            <button
              onClick={() => setActiveTab('episodes')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'episodes'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Episodios ({module.episodes.length})
            </button>
          </div>

          {/* Chapters List */}
          {activeTab === 'chapters' && (
            <div className="overflow-y-auto py-3 space-y-2 flex-1">
              <div className="text-xs text-slate-400 font-medium mb-1">
                Haz clic para saltar al minuto exacto:
              </div>
              {episode.chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => jumpToChapter(ch.timeSeconds)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/50 transition-all flex items-center justify-between group"
                >
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                    {ch.title}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </button>
              ))}
            </div>
          )}

          {/* Episodes Playlist */}
          {activeTab === 'episodes' && (
            <div className="overflow-y-auto py-3 space-y-2 flex-1">
              {module.episodes.map((ep) => {
                const isCurrent = ep.id === episode.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => setActiveVideoEpisode({ module, episode: ep })}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center gap-3 ${
                      isCurrent
                        ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200'
                        : 'bg-slate-900/70 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {ep.episodeNumber}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{ep.title}</div>
                      <div className="text-[10px] text-slate-400">{ep.durationMinutes} min</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
