import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import {
  Sparkles, KeyRound, CreditCard, PlayCircle, Layers,
  RefreshCw, Unlock, ChevronUp, ChevronDown, Presentation
} from 'lucide-react';

export const DemoPresentationToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const {
    modules,
    setIsAuthModalOpen,
    setActiveCheckoutModule,
    setActiveVideoEpisode,
    setActiveDetailModule,
    resetDemoPurchases,
    unlockAllDemo,
    purchasedModuleIds,
    setIsAdminOpen
  } = usePlatform();

  const featured = modules[0];

  return (
    <aside aria-label="Controles de Demostración" className="fixed bottom-4 right-4 z-40">
      {isOpen ? (
        <div className="bg-slate-900/95 border border-cyan-500/50 rounded-2xl p-3 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl max-w-xs sm:max-w-md animate-scale-in text-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 font-black text-cyan-300 uppercase tracking-wider text-[11px]">
              <Presentation className="w-4 h-4 text-cyan-400" />
              Barra de Presentación al Cliente
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Minimizar barra demo"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            Accesos directos para saltar a las vistas clave durante tu reunión o demostración:
          </p>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-slate-200 font-bold transition-all flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>Preview Login</span>
            </button>

            <button
              onClick={() => setActiveCheckoutModule(featured)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-200 font-bold transition-all flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preview Pagos</span>
            </button>

            <button
              onClick={() => setActiveDetailModule(featured)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-teal-600 hover:text-slate-950 text-slate-200 font-bold transition-all flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>Playlist Módulo</span>
            </button>

            <button
              onClick={() => setActiveVideoEpisode({ module: featured, episode: featured.episodes[0] })}
              className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 font-bold transition-all flex items-center gap-1.5"
            >
              <PlayCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Reproductor</span>
            </button>
          </div>

          {/* Admin Panel Launch Button */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-emerald-500/20 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Abrir Panel Médico Admin (Precios & Videos)</span>
          </button>

          {/* Demonstration state toggle: Locked vs Unlocked */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              Desbloqueados: <strong className="text-cyan-300">{purchasedModuleIds.length}/{modules.length}</strong>
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={resetDemoPurchases}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                title="Restablecer a solo 1 módulo para mostrar el bloqueo"
              >
                <RefreshCw className="w-3 h-3" />
                Bloquear
              </button>
              <button
                onClick={unlockAllDemo}
                className="px-2 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 flex items-center gap-1 font-bold transition-colors"
                title="Desbloquear todos para mostrar catálogo completo activo"
              >
                <Unlock className="w-3 h-3" />
                Todo Activo
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black shadow-xl shadow-cyan-500/30 flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Sparkles className="w-5 h-5 fill-current" />
          <span className="text-xs font-bold hidden sm:inline">Modo Demo Cliente</span>
        </button>
      )}
    </aside>
  );
};
