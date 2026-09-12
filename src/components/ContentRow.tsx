import React, { useRef } from 'react';
import { ModuleItem } from '../types';
import { usePlatform } from '../context/PlatformContext';
import { ChevronLeft, ChevronRight, Play, CheckCircle2, Lock, Star, Clock, Info } from 'lucide-react';

interface ContentRowProps {
  title: string;
  subtitle?: string;
  modules: ModuleItem[];
  icon?: React.ReactNode;
}

export const ContentRow: React.FC<ContentRowProps> = ({ title, subtitle, modules, icon }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const { isPurchased, setActiveDetailModule, setActiveVideoEpisode, setActiveCheckoutModule, watchProgress } = usePlatform();

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (modules.length === 0) return null;

  return (
    <div className="relative my-8 sm:my-10 px-4 sm:px-8 lg:px-12 group">
      {/* Row Header */}
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {icon && <div className="text-cyan-400">{icon}</div>}
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <span className="hidden sm:inline-block text-xs text-slate-400 font-medium pl-2 border-l border-slate-700">
              {subtitle}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {modules.length} {modules.length === 1 ? 'módulo' : 'módulos'}
        </span>
      </div>

      {/* Horizontal Carousel Wrapper */}
      <div className="relative">
        {/* Scroll Left Button */}
        <button
          onClick={() => handleScroll('left')}
          aria-label="Desplazar a la izquierda"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-28 bg-[#0B0F17]/80 hover:bg-[#0B0F17] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-r-lg border-y border-r border-slate-700/60 shadow-xl backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6 text-cyan-400" />
        </button>

        {/* Modules Slider Container */}
        <div
          ref={rowRef}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-3 scroll-smooth"
        >
          {modules.map((module) => {
            const purchased = isPurchased(module.id);
            const firstEp = module.episodes[0];
            const epProgress = firstEp ? watchProgress[firstEp.id] : null;

            return (
              <div
                key={module.id}
                className="flex-none w-72 sm:w-80 md:w-88 group/card relative double-bezel transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-950/50 cursor-pointer"
                onClick={() => setActiveDetailModule(module)}
              >
                <div className="double-bezel-inner flex flex-col justify-between h-full">
                  {/* Thumbnail Header */}
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-950">
                    <img
                      src={module.thumbnailUrl}
                      alt={module.title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1424] via-[#0D1424]/30 to-transparent" />

                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-md shadow-sm">
                        {module.condition}
                      </span>
                      {module.contentType === 'Guia' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                          Guía Rápida
                        </span>
                      )}
                      {module.contentType === 'Tip' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 backdrop-blur-md">
                          Tip Práctico
                        </span>
                      )}
                    </div>

                    {/* Access Status Indicator (Sin precio visible) */}
                    <div className="absolute top-3 right-3 z-10">
                      {purchased ? (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 shadow-md">
                          <CheckCircle2 className="w-3 h-3 text-slate-950" />
                          Desbloqueado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-sm">
                          <Lock className="w-3 h-3 text-amber-400" />
                          Acceso Exclusivo
                        </span>
                      )}
                    </div>

                    {/* Progress Bar (if watched) */}
                    {purchased && epProgress && (
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                        <div
                          className="h-full bg-cyan-400 transition-all duration-300"
                          style={{ width: `${epProgress.percent}%` }}
                        />
                      </div>
                    )}

                    {/* Quick Play Hover Trigger */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 bg-slate-950/50 backdrop-blur-[2px] transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (purchased) {
                            setActiveVideoEpisode({ module, episode: module.episodes[0] });
                          } else {
                            setActiveCheckoutModule(module);
                          }
                        }}
                        className="p-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-xl shadow-cyan-500/40 transform scale-90 group-hover/card:scale-100 transition-all"
                        aria-label="Reproducir o Comprar"
                      >
                        {purchased ? (
                          <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                        ) : (
                          <Lock className="w-5 h-5 text-slate-950" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#0D1424]">
                    <div>
                      <h3 className="font-extrabold text-slate-100 text-base leading-snug group-hover/card:text-cyan-300 transition-colors line-clamp-1">
                        {module.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-medium">
                        {module.subtitle}
                      </p>
                    </div>

                    {/* Metadata Footer */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {module.totalDurationHours} • {module.episodesCount} {module.episodesCount === 1 ? 'clase' : 'clases'}
                      </span>
                      <span className="flex items-center gap-1 text-amber-300 font-black">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {module.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => handleScroll('right')}
          aria-label="Desplazar a la derecha"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-28 bg-[#0B0F17]/80 hover:bg-[#0B0F17] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-l-lg border-y border-l border-slate-700/60 shadow-xl backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6 text-cyan-400" />
        </button>
      </div>
    </div>
  );
};
