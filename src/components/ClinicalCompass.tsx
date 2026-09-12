import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import {
  Flame, Brain, Moon, MessageSquare, ArrowRight, Sparkles,
  ShieldCheck, Clock, CheckCircle2
} from 'lucide-react';

interface CompassOption {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  gradient: string;
  borderHover: string;
  glowColor: string;
  targetCondition: string;
}

export const ClinicalCompass: React.FC = () => {
  const { modules, setActiveDetailModule, setFilters, setActiveCategory } = usePlatform();

  const options: CompassOption[] = [
    {
      id: 'crisis',
      moduleId: 'autismo-desregulacion-colapsos',
      title: 'Crisis & Meltdowns Sensoriales',
      subtitle: 'Diferenciación berrinche vs. colapso neurovegetativo, qué hacer en el pico y protocolo de contención.',
      badge: 'Acción Urgente',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: <Flame className="w-5 h-5 text-rose-400" />,
      gradient: 'from-rose-950/40 via-slate-900/60 to-slate-950',
      borderHover: 'hover:border-rose-500/60 hover:shadow-rose-950/50',
      glowColor: 'group-hover:bg-rose-500/10',
      targetCondition: 'Autismo',
    },
    {
      id: 'tdah',
      moduleId: 'tdah-infancia-integral',
      title: 'TDAH, Foco & Desafíos Escolares',
      subtitle: 'Química de la atención, diseño de rutinas sin gritos, mediación con docentes y rol de la medicación.',
      badge: 'Más Consultado',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      icon: <Brain className="w-5 h-5 text-cyan-400" />,
      gradient: 'from-cyan-950/40 via-slate-900/60 to-slate-950',
      borderHover: 'hover:border-cyan-500/60 hover:shadow-cyan-950/50',
      glowColor: 'group-hover:bg-cyan-500/10',
      targetCondition: 'TDAH',
    },
    {
      id: 'sueno',
      moduleId: 'guia-sueno-neurodivergente',
      title: 'Higiene del Sueño & Descanso',
      subtitle: 'Protocolo de 4 fases para conciliar el sueño sin batallas, melatonina y reducción de hiperalerta.',
      badge: 'Guía de 48 min',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      gradient: 'from-indigo-950/40 via-slate-900/60 to-slate-950',
      borderHover: 'hover:border-indigo-500/60 hover:shadow-indigo-950/50',
      glowColor: 'group-hover:bg-indigo-500/10',
      targetCondition: 'Sensorial',
    },
    {
      id: 'comunicacion',
      moduleId: 'tea-comunicacion-apoyos-visuales',
      title: 'Comunicación, Lenguaje & TEA',
      subtitle: 'Tableros pictográficos, anticipación visual de transiciones y modelado del lenguaje en el juego.',
      badge: 'Herramientas Prácticas',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: <MessageSquare className="w-5 h-5 text-emerald-400" />,
      gradient: 'from-emerald-950/40 via-slate-900/60 to-slate-950',
      borderHover: 'hover:border-emerald-500/60 hover:shadow-emerald-950/50',
      glowColor: 'group-hover:bg-emerald-500/10',
      targetCondition: 'Autismo',
    },
  ];

  const handleSelectCompass = (option: CompassOption) => {
    const targetModule = modules.find((m) => m.id === option.moduleId);
    if (targetModule) {
      setActiveDetailModule(targetModule);
    } else {
      // Fallback: filter by condition
      setActiveCategory('all');
      setFilters((prev) => ({
        ...prev,
        condition: option.targetCondition as any,
        searchQuery: '',
      }));
    }
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-12">
      {/* Header with high-end typography and eyebrow */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Brújula Clínica Inmediata
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            ¿Qué situación necesita tu familia hoy?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Sin demoras ni tecnicismos. Selecciona el foco de preocupación actual para acceder directamente al abordaje médico y las pautas paso a paso del Dr. Julián Rossi.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Guías validadas en consultorio pediátrico</span>
        </div>
      </div>

      {/* 4 Compass Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => handleSelectCompass(opt)}
            className={`group relative rounded-2xl p-5 bg-gradient-to-b ${opt.gradient} border border-slate-800/90 ${opt.borderHover} transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden`}
          >
            {/* Ambient hover glow */}
            <div
              className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${opt.glowColor}`}
            />

            {/* Card Content Top */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {opt.icon}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${opt.badgeColor}`}>
                  {opt.badge}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-white group-hover:text-cyan-200 transition-colors leading-snug">
                  {opt.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                  {opt.subtitle}
                </p>
              </div>
            </div>

            {/* Card Footer Button */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300 relative z-10">
              <span>Abrir Abordaje Clínico</span>
              <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
