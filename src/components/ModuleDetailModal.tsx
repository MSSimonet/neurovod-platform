import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { Episode } from '../types';
import {
  X, Play, Lock, CheckCircle2, Star, Clock, Calendar, Download,
  FileText, ShieldCheck, Check, BadgeDollarSign, Sparkles, UserCheck
} from 'lucide-react';

export const ModuleDetailModal: React.FC = () => {
  const {
    activeDetailModule,
    setActiveDetailModule,
    isPurchased,
    setActiveVideoEpisode,
    setActiveCheckoutModule,
    watchProgress
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'episodes' | 'materials' | 'doctor'>('episodes');

  if (!activeDetailModule) return null;

  const purchased = isPurchased(activeDetailModule.id);

  const handlePlayEpisode = (episode: Episode) => {
    if (purchased) {
      setActiveVideoEpisode({ module: activeDetailModule, episode });
    } else {
      setActiveCheckoutModule(activeDetailModule);
    }
  };

  const handleBuy = () => {
    setActiveCheckoutModule(activeDetailModule);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-[#0F172A] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl my-8 animate-scale-in max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveDetailModule(null)}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors shadow-lg"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Preview Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-slate-950">
          <img
            src={activeDetailModule.heroBannerUrl}
            alt={activeDetailModule.title}
            className="w-full h-full object-cover filter brightness-[0.65] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />

          {/* Overlay Info */}
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-extrabold uppercase bg-cyan-500 text-slate-950">
                {activeDetailModule.condition}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800/90 text-slate-200 border border-slate-600">
                Edición {activeDetailModule.year}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-600">
                {activeDetailModule.targetAudience}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow">
              {activeDetailModule.title}
            </h2>

            {/* CTAs in Header */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {purchased ? (
                <button
                  onClick={() => handlePlayEpisode(activeDetailModule.episodes[0])}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  Reproducir Módulo
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                </button>
              ) : (
                <button
                  onClick={handleBuy}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/30 transition-all"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  Desbloquear Acceso al Programa
                </button>
              )}

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-xs text-slate-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {activeDetailModule.totalDurationHours} • {activeDetailModule.episodesCount} episodios
              </div>

              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-xs text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {activeDetailModule.rating} ({activeDetailModule.reviewsCount} familias)
              </div>
            </div>
          </div>
        </div>

        {/* Informative Clinical Access Banner (Sin precios visibles) */}
        {!purchased && (
          <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-slate-900 border-y border-cyan-800/40 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>
                <strong>Orientación Médica Especializada:</strong> Acceso permanente a las {activeDetailModule.episodesCount} clases, protocolo conductual y guías en PDF.
              </span>
            </div>
            <button
              onClick={handleBuy}
              className="text-cyan-400 hover:text-cyan-200 font-bold underline transition-colors"
            >
              Habilitar en Pasarela de Pagos →
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/60">
          <button
            onClick={() => setActiveTab('episodes')}
            className={`py-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'episodes'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Lista de Episodios ({activeDetailModule.episodes.length})
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`py-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'materials'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Materiales y Guías PDF
          </button>
          <button
            onClick={() => setActiveTab('doctor')}
            className={`py-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'doctor'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Ficha del Especialista
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Description & Key Points */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
              Objetivo del Módulo
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {activeDetailModule.description}
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <h5 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Puntos Clave que Aprenderás:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activeDetailModule.keyLearningPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TAB 1: Episodes Playlist */}
          {activeTab === 'episodes' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white tracking-wide">
                Contenido del Módulo ({activeDetailModule.episodes.length} episodios)
              </h4>

              <div className="space-y-2.5">
                {activeDetailModule.episodes.map((ep) => {
                  const progress = watchProgress[ep.id];
                  return (
                    <div
                      key={ep.id}
                      onClick={() => handlePlayEpisode(ep)}
                      className="group p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between gap-4 cursor-pointer"
                    >
                      {/* Left: Thumbnail & Number */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-slate-800">
                          <img
                            src={ep.thumbnailUrl}
                            alt={ep.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            {purchased ? (
                              <Play className="w-5 h-5 text-cyan-300 fill-cyan-300/80 group-hover:scale-110 transition-transform" />
                            ) : (
                              <Lock className="w-4 h-4 text-amber-400" />
                            )}
                          </div>
                          {progress && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                              <div className="h-full bg-cyan-400" style={{ width: `${progress.percent}%` }} />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-cyan-400">
                              EP {ep.episodeNumber}
                            </span>
                            <span className="text-xs text-slate-400">
                              • {ep.durationMinutes} min
                            </span>
                            {progress?.completed && (
                              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/50">
                                Completado
                              </span>
                            )}
                          </div>
                          <h5 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                            {ep.title}
                          </h5>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {ep.synopsis}
                          </p>
                        </div>
                      </div>

                      {/* Right CTA */}
                      <div className="shrink-0">
                        {purchased ? (
                          <button className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                            <Play className="w-4 h-4 fill-current" />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500 group-hover:text-amber-300 flex items-center gap-1 font-medium">
                            <Lock className="w-3.5 h-3.5" />
                            Bloqueado
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Materials & PDF Downloads */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">
                Guías y Herramientas Clínicas Descargables
              </h4>
              <p className="text-xs text-slate-400">
                Material complementario preparado por el especialista para utilizar con la familia, terapeutas o el colegio.
              </p>

              <div className="space-y-2">
                {activeDetailModule.episodes.flatMap(e => e.resources || []).length > 0 ? (
                  activeDetailModule.episodes.flatMap(e => e.resources || []).map((res, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-200">{res.title}</div>
                          <div className="text-xs text-slate-500 uppercase">{res.type} • {res.size}</div>
                        </div>
                      </div>

                      {purchased ? (
                        <button
                          onClick={() => alert(`Descargando recurso oficial: ${res.title}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-300 text-xs font-semibold transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Descargar PDF
                        </button>
                      ) : (
                        <span className="text-xs text-amber-400/80 flex items-center gap-1 font-medium">
                          <Lock className="w-3.5 h-3.5" />
                          Disponible al adquirir
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-500">
                    Este módulo incluye el resumen ejecutivo en video y guía integrada en el reproductor.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Doctor Profile */}
          {activeTab === 'doctor' && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeDetailModule.doctor.avatarUrl}
                  alt={activeDetailModule.doctor.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500 shadow-md"
                />
                <div>
                  <div className="text-base font-black text-white flex items-center gap-1.5">
                    {activeDetailModule.doctor.name}
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xs font-semibold text-cyan-300">
                    {activeDetailModule.doctor.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {activeDetailModule.doctor.licenseNumber} • {activeDetailModule.doctor.experienceYears} años de experiencia
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                {activeDetailModule.doctor.bio}
              </p>

              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200">
                <strong>Propósito de estos módulos:</strong> Aliviar las listas de espera de turnos presenciales y brindar a los padres el marco teórico y práctico exacto que el médico explica en consulta, para consultar con dudas mucho más focalizadas.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
