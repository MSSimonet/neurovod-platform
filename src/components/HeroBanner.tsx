import React from 'react';
import { ModuleItem } from '../types';
import { usePlatform } from '../context/PlatformContext';
import { Play, Info, CheckCircle2, Lock, Sparkles, Clock, Calendar, ShieldCheck, BadgeDollarSign } from 'lucide-react';

interface HeroBannerProps {
  module: ModuleItem;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ module }) => {
  const { isPurchased, setActiveDetailModule, setActiveVideoEpisode, setActiveCheckoutModule } = usePlatform();
  const purchased = isPurchased(module.id);

  const handlePlay = () => {
    if (purchased) {
      setActiveVideoEpisode({ module, episode: module.episodes[0] });
    } else {
      setActiveCheckoutModule(module);
    }
  };

  return (
    <div className="relative min-h-[620px] lg:min-h-[680px] flex items-center overflow-hidden pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-8 lg:px-12">
      {/* Background Image with Cinematic Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={module.heroBannerUrl}
          alt={module.title}
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 filter brightness-[0.58] contrast-[1.05]"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A12] via-[#070A12]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070A12] via-[#070A12]/85 to-transparent w-full lg:w-3/5" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#070A12]/90 to-transparent" />
      </div>

      {/* Asymmetrical Grid Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Editorial Information & Direct Actions */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 animate-fade-in">
          {/* Eyebrow & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {module.badge || 'Programa Clínico Destacado'}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-slate-200 border border-slate-700">
              {module.condition}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/80 text-slate-300 flex items-center gap-1 border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {module.totalDurationHours} • {module.episodesCount} episodios
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/80 text-slate-300 flex items-center gap-1 border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Edición {module.year}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md">
              {module.title}
            </h1>
            <p className="text-base sm:text-lg text-cyan-200 font-semibold leading-snug">
              {module.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl drop-shadow">
            {module.description}
          </p>

          {/* Doctor Trust Seal */}
          <div className="flex items-center gap-3 py-1">
            <img
              src={module.doctor.avatarUrl}
              alt={module.doctor.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-cyan-500/60 shadow-md"
            />
            <div className="text-xs">
              <div className="text-white font-bold flex items-center gap-1">
                {module.doctor.name}
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-slate-400">
                {module.doctor.title} • <span className="text-cyan-300">{module.doctor.licenseNumber}</span>
              </div>
            </div>
          </div>

          {/* Dual Action Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveVideoEpisode({ module, episode: module.episodes[0] })}
              className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-cyan-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="w-7 h-7 rounded-full bg-slate-950 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400 ml-0.5" />
              </div>
              <span>Ver Clase Teaser (Gratis)</span>
            </button>

            <button
              onClick={() => setActiveDetailModule(module)}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm sm:text-base backdrop-blur-md border border-slate-700/90 transition-all hover:border-cyan-500/50"
            >
              <Info className="w-4 h-4 text-cyan-300" />
              Ver Programa & 5 Episodios
            </button>
          </div>
        </div>

        {/* Right Column: Double-Bezel Live Interactive Preview Card */}
        <div className="hidden lg:block lg:col-span-5">
          <div
            onClick={() => setActiveVideoEpisode({ module, episode: module.episodes[0] })}
            className="group relative rounded-3xl p-2 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-2xl backdrop-blur-xl cursor-pointer hover:border-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video shadow-inner">
              <img
                src={module.episodes[0]?.thumbnailUrl || module.thumbnailUrl}
                alt={module.episodes[0]?.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Floating Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/40 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-slate-950 ml-1" />
                </div>
              </div>

              {/* Card Badges Top */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-slate-950 shadow-md">
                  Clase 1 Disponible
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/90 text-slate-200 border border-slate-700">
                  {module.episodes[0]?.durationMinutes} min
                </span>
              </div>
            </div>

            {/* Preview Card Metadata Bottom */}
            <div className="p-4 space-y-2">
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                Episodio 1 de 5
              </div>
              <h4 className="font-extrabold text-white text-sm leading-snug group-hover:text-cyan-300 transition-colors">
                {module.episodes[0]?.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2">
                {module.episodes[0]?.synopsis}
              </p>

              {/* Highlights Chips */}
              <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-800/80 text-[10px] text-slate-300">
                <span className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/60">
                  ✓ Química de la dopamina
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/60">
                  ✓ Guía PDF adjunta
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
