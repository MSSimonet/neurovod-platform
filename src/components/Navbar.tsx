import React, { useState, useEffect } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { Search, Film, Activity, Sparkles, BookOpen, CheckCircle, SlidersHorizontal, User, ShieldCheck, KeyRound } from 'lucide-react';

interface NavbarProps {
  onOpenFilters: () => void;
  isFiltersOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenFilters, isFiltersOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { filters, setFilters, purchasedModuleIds, setActiveCategory, activeCategory, user, setIsAuthModalOpen, setIsAdminOpen } = usePlatform();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilters(prev => ({ ...prev, condition: 'all', contentType: 'all' }));
    } else if (category === 'TDAH') {
      setFilters(prev => ({ ...prev, condition: 'TDAH' }));
    } else if (category === 'Autismo') {
      setFilters(prev => ({ ...prev, condition: 'Autismo' }));
    } else if (category === 'Tips') {
      setFilters(prev => ({ ...prev, contentType: 'Tip' }));
    } else if (category === 'my-modules') {
      // handled in App view
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <div className={`glass-island rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 transition-all duration-300 ${
          isScrolled ? 'bg-slate-950/90 shadow-2xl border-cyan-500/20' : 'bg-slate-900/80'
        }`}>
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button
              onClick={() => handleNavClick('all')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                    NEURO<span className="text-cyan-400">VOD</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Médica
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium hidden sm:flex">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-soft-pulse" />
                  <span>Consultorio Digital · Dr. Julián Rossi</span>
                </div>
              </div>
            </button>

            {/* Quick Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => handleNavClick('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  activeCategory === 'all'
                    ? 'text-white bg-slate-800 border border-slate-700 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Catálogo
              </button>
              <button
                onClick={() => handleNavClick('TDAH')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  activeCategory === 'TDAH'
                    ? 'text-cyan-300 bg-cyan-950/70 border border-cyan-700/60 shadow-sm'
                    : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50'
                }`}
              >
                TDAH
              </button>
              <button
                onClick={() => handleNavClick('Autismo')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  activeCategory === 'Autismo'
                    ? 'text-teal-300 bg-teal-950/70 border border-teal-700/60 shadow-sm'
                    : 'text-slate-300 hover:text-teal-300 hover:bg-slate-800/50'
                }`}
              >
                Autismo (TEA)
              </button>
              <button
                onClick={() => handleNavClick('Tips')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  activeCategory === 'Tips'
                    ? 'text-amber-300 bg-amber-950/70 border border-amber-700/60 shadow-sm'
                    : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/50'
                }`}
              >
                Tips & Sueño
              </button>
              <button
                onClick={() => handleNavClick('my-modules')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                  activeCategory === 'my-modules'
                    ? 'text-emerald-300 bg-emerald-950/70 border border-emerald-700/60 shadow-sm'
                    : 'text-slate-300 hover:text-emerald-300 hover:bg-slate-800/50'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Mi Biblioteca
                <span className="ml-0.5 text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded-full font-black border border-emerald-500/30">
                  {purchasedModuleIds.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Right Controls: Search, Filter Toggle, Admin & User Account */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Search */}
            <div className="relative flex items-center">
              {isSearchExpanded ? (
                <div className="flex items-center bg-slate-950 border border-cyan-500/60 rounded-full px-3 py-1.5 w-44 sm:w-60 transition-all shadow-lg shadow-cyan-950/50">
                  <Search className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Buscar síntoma, tema..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    autoFocus
                    className="bg-transparent text-xs text-slate-100 placeholder-slate-400 focus:outline-none w-full"
                  />
                  <button
                    onClick={() => {
                      setIsSearchExpanded(false);
                      setFilters(prev => ({ ...prev, searchQuery: '' }));
                    }}
                    className="text-xs text-slate-400 hover:text-white ml-1"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  aria-label="Abrir buscador"
                  className="p-2 text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 rounded-full transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Advanced Filters Toggle Button */}
            <button
              onClick={onOpenFilters}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                isFiltersOpen
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/30'
                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-300'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filtros</span>
            </button>

            {/* Admin Dashboard Quick Access Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-full bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-950 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950/30 transition-all transform hover:scale-[1.02]"
              title="Abrir Panel Médico Privado (Gestión de Precios, Videos y PDFs)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Portal Médico</span>
            </button>

            {/* Interactive User Login / Account Trigger */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 pl-1.5 border-l border-slate-800/80 hover:opacity-90 transition-opacity text-left"
              title="Abrir Perfil Familiar y Modo Demo"
            >
              {user ? (
                <>
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-cyan-500/80 shadow-sm"
                  />
                  <div className="hidden xl:block leading-tight">
                    <div className="text-xs font-bold text-slate-200">{user.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {user.role}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Ingresar</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
