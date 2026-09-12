import React, { useState, useMemo } from 'react';
import { usePlatform } from './context/PlatformContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ClinicalCompass } from './components/ClinicalCompass';
import { ContentRow } from './components/ContentRow';
import { FilterBar } from './components/FilterBar';
import { ModuleDetailModal } from './components/ModuleDetailModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { DemoPresentationToolbar } from './components/DemoPresentationToolbar';
import { AdminDashboard } from './components/AdminDashboard';
import { DoctorProfileSection } from './components/DoctorProfileSection';
import { Footer } from './components/Footer';
import {
  Sparkles, Brain, HeartPulse, Lightbulb, GraduationCap,
  CheckCircle2, AlertCircle, RefreshCw, Lock, Play, Clock, Star,
  Compass, ArrowRight, ShieldCheck, Download
} from 'lucide-react';

export const App: React.FC = () => {
  const {
    modules,
    filters,
    purchasedModuleIds,
    activeCategory,
    setActiveCategory,
    resetFilters,
    setActiveDetailModule,
    setActiveVideoEpisode,
    setActiveCheckoutModule,
    isPurchased,
    isAdminOpen,
    watchProgress
  } = usePlatform();

  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);

  // Filter modules based on search and 4 filter variables
  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      // 1. Search query
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchSubtitle = m.subtitle.toLowerCase().includes(q);
        const matchDesc = m.description.toLowerCase().includes(q);
        const matchTags = m.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSubtitle && !matchDesc && !matchTags) {
          return false;
        }
      }

      // 2. Condition
      if (filters.condition !== 'all' && m.condition !== filters.condition) {
        return false;
      }

      // 3. Content Type
      if (filters.contentType !== 'all' && m.contentType !== filters.contentType) {
        return false;
      }

      // 4. Year
      if (filters.year !== 'all' && m.year !== filters.year) {
        return false;
      }

      // 5. Target Audience
      if (filters.targetAudience !== 'all' && m.targetAudience !== filters.targetAudience) {
        return false;
      }

      // 6. Category View mode
      if (activeCategory === 'my-modules' && !purchasedModuleIds.includes(m.id)) {
        return false;
      }

      return true;
    });
  }, [modules, filters, activeCategory, purchasedModuleIds]);

  const hasActiveFiltering =
    filters.searchQuery.trim() !== '' ||
    filters.condition !== 'all' ||
    filters.contentType !== 'all' ||
    filters.year !== 'all' ||
    filters.targetAudience !== 'all' ||
    activeCategory === 'my-modules';

  // Categorized lists for the Netflix layout
  const tdahModules = useMemo(() => modules.filter(m => m.condition === 'TDAH'), [modules]);
  const autismoModules = useMemo(() => modules.filter(m => m.condition === 'Autismo'), [modules]);
  const tipsAndGuides = useMemo(() => modules.filter(m => m.contentType === 'Guia' || m.contentType === 'Tip'), [modules]);
  const congressModules = useMemo(() => modules.filter(m => m.contentType === 'Congreso' || m.condition === 'General'), [modules]);
  const myPurchasedModules = useMemo(() => modules.filter(m => purchasedModuleIds.includes(m.id)), [modules, purchasedModuleIds]);

  const featuredModule = modules.find(m => m.isFeatured) || modules[0];

  // Detect currently active in-progress module
  const inProgressModule = useMemo(() => {
    return modules.find(m => {
      return m.episodes.some(ep => watchProgress[ep.id] && !watchProgress[ep.id].completed);
    }) || (purchasedModuleIds.length > 0 ? modules.find(m => m.id === purchasedModuleIds[0]) : null);
  }, [modules, watchProgress, purchasedModuleIds]);

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Floating Island Navbar */}
      <Navbar
        onOpenFilters={() => setIsFilterBarOpen(!isFilterBarOpen)}
        isFiltersOpen={isFilterBarOpen}
      />

      {/* Hero Banner (visible when not deep in active search) */}
      {!hasActiveFiltering && <HeroBanner module={featuredModule} />}

      {/* Active Learning Journey Card (Linear/Apple Fitness style tracker) */}
      {!hasActiveFiltering && inProgressModule && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 -mt-4 sm:-mt-6 mb-4 relative z-30">
          <div className="glass-island rounded-2xl p-4 sm:p-5 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-cyan-500/40 shadow-md">
                <img
                  src={inProgressModule.thumbnailUrl}
                  alt={inProgressModule.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <Play className="w-6 h-6 fill-cyan-400 text-cyan-400" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Tu Trayecto Activo • 45%
                  </span>
                  <span className="text-xs text-slate-400">Restan aprox. 26 min</span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-white line-clamp-1">
                  Continuar: {inProgressModule.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1">
                  Episodio 1: Masterclass Intensiva • Protocolo Nocturno de 4 Fases
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <button
                onClick={() => setActiveVideoEpisode({ module: inProgressModule, episode: inProgressModule.episodes[0] })}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all transform hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Reanudar Video</span>
              </button>
              <button
                onClick={() => setActiveDetailModule(inProgressModule)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700"
              >
                <span>Ver Ficha & PDFs</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Compass: 4 Fast-Track Portals for Parents */}
      {!hasActiveFiltering && <ClinicalCompass />}

      {/* Collapsible Multi-Variable Filter Bar */}
      <div className={!hasActiveFiltering ? 'relative z-20' : 'pt-24'}>
        <FilterBar
          isOpen={isFilterBarOpen || hasActiveFiltering}
          onClose={() => setIsFilterBarOpen(false)}
          filteredCount={filteredModules.length}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {hasActiveFiltering ? (
          /* Search / Filtered Grid Results View */
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-black text-white">
                  {activeCategory === 'my-modules'
                    ? 'Mis Módulos Desbloqueados'
                    : 'Resultados del Catálogo Clínico'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mostrando {filteredModules.length} programas médicos coincidentes
                </p>
              </div>

              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Mostrar Catálogo Completo
              </button>
            </div>

            {filteredModules.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 max-w-lg mx-auto space-y-4 my-10">
                <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">
                  No se encontraron módulos con esos filtros
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Prueba cambiando la condición médica seleccionada o limpiando el texto de búsqueda.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Restablecer Todos los Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredModules.map((module) => {
                  const purchased = isPurchased(module.id);
                  return (
                    <div
                      key={module.id}
                      onClick={() => setActiveDetailModule(module)}
                      className="group double-bezel transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-950/50 cursor-pointer flex flex-col justify-between"
                    >
                      <div className="double-bezel-inner flex flex-col justify-between h-full bg-[#0D1424]">
                        <div className="relative h-44 overflow-hidden bg-slate-950">
                          <img
                            src={module.thumbnailUrl}
                            alt={module.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-2.5 left-2.5 flex gap-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-950/90 text-cyan-300 border border-cyan-700/50">
                              {module.condition}
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            {purchased ? (
                              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950">
                                <CheckCircle2 className="w-3 h-3" />
                                Desbloqueado
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-950/90 text-amber-300 border border-amber-500/40">
                                <Lock className="w-3 h-3 text-amber-400" />
                                Acceso Exclusivo
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <h4 className="font-extrabold text-slate-100 text-sm group-hover:text-cyan-300 transition-colors line-clamp-2">
                              {module.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {module.subtitle}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                            <span className="font-semibold text-slate-300">{module.episodesCount} episodios</span>
                            <span className="text-cyan-400 font-bold">{module.targetAudience}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Curated Streaming Rows & Condition Hub */
          <div className="space-y-4 sm:space-y-6">
            {/* Row 0: My Purchased Modules (if any exist) */}
            {myPurchasedModules.length > 0 && (
              <ContentRow
                title="Tus Módulos Desbloqueados"
                subtitle="Continúa donde lo dejaste en tu biblioteca personal"
                modules={myPurchasedModules}
                icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              />
            )}

            {/* Row 1: Featured & Popular */}
            <ContentRow
              title="Programas Clínicos Más Solicitados"
              subtitle="Estrategias fundamentales consultadas por más de 3.500 familias"
              modules={modules.slice(0, 4)}
              icon={<Sparkles className="w-6 h-6 text-cyan-400" />}
            />

            {/* Row 2: TDAH */}
            <ContentRow
              title="Manejo Integral de TDAH"
              subtitle="Funciones ejecutivas, rutinas cotidianas, mediación escolar y farmacología"
              modules={tdahModules}
              icon={<Brain className="w-6 h-6 text-cyan-400" />}
            />

            {/* Row 3: Autismo (TEA) */}
            <ContentRow
              title="Condición del Espectro Autista (TEA)"
              subtitle="Desregulación sensorial, anticipación visual y comunicación afectiva"
              modules={autismoModules}
              icon={<HeartPulse className="w-6 h-6 text-teal-400" />}
            />

            {/* Row 4: Fast Guides & Practical Tips */}
            <ContentRow
              title="Guías Rápidas & Tips de Consulta Diaria"
              subtitle="Soluciones prácticas en menos de 45 minutos para situaciones concretas"
              modules={tipsAndGuides}
              icon={<Lightbulb className="w-6 h-6 text-amber-400" />}
            />

            {/* Row 5: Congresses & Medical Updates */}
            <ContentRow
              title="Congresos, Jornadas y Actualización Médica"
              subtitle="Grabaciones completas sobre avances terapéuticos y criterios diagnósticos"
              modules={congressModules}
              icon={<GraduationCap className="w-6 h-6 text-indigo-400" />}
            />
          </div>
        )}

        {/* Doctor Credibility & Clinical Guarantee Section */}
        <DoctorProfileSection />
      </main>

      {/* Global Modals */}
      <ModuleDetailModal />
      <VideoPlayerModal />
      <CheckoutModal />
      <AuthModal />

      {/* Floating Client Demo Presentation Toolbar */}
      <DemoPresentationToolbar />

      {/* Private Medical Admin Section */}
      {isAdminOpen && <AdminDashboard />}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;

