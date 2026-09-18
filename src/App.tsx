import React, { Suspense, lazy, useMemo, useState } from 'react';
import { usePlatform } from './context/PlatformContext';
import { useCanonical } from './lib/useCanonical';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ContinueWatching } from './components/ContinueWatching';
import { ClinicalCompass } from './components/ClinicalCompass';
import { FilterBar } from './components/FilterBar';
import { ContentRow } from './components/ContentRow';
import { ModuleCard } from './components/ModuleCard';
import { DoctorProfileSection } from './components/DoctorProfileSection';
import { ConsultingRooms } from './components/ConsultingRooms';
import { Footer } from './components/Footer';
import { ModuleDetailModal } from './components/ModuleDetailModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { DemoPresentationToolbar } from './components/DemoPresentationToolbar';

/**
 * El panel de gestión es privado y lo usa una sola persona: no tiene por qué
 * viajar en el paquete que baja una familia para ver el catálogo. Se carga
 * recién cuando se entra a /admin.
 */
const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard').then((modulo) => ({ default: modulo.AdminDashboard })),
);

export const App = () => {
  const { modules, filters, purchasedModuleIds, resetFilters, route } = usePlatform();

  // Las dos vistas comparten el HTML: la canónica se ajusta a la ruta abierta.
  useCanonical(route);
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);

  const isFiltering =
    filters.searchQuery.trim() !== '' ||
    filters.condition !== 'all' ||
    filters.contentType !== 'all' ||
    filters.year !== 'all' ||
    filters.targetAudience !== 'all';

  const filteredModules = useMemo(() => {
    const query = filters.searchQuery.trim().toLowerCase();

    return modules.filter((mod) => {
      if (query !== '') {
        const haystack = [mod.title, mod.subtitle, mod.description, ...mod.tags]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (filters.condition !== 'all' && mod.condition !== filters.condition) return false;
      if (filters.contentType !== 'all' && mod.contentType !== filters.contentType) return false;
      if (filters.year !== 'all' && mod.year !== filters.year) return false;
      if (filters.targetAudience !== 'all' && mod.targetAudience !== filters.targetAudience) {
        return false;
      }
      return true;
    });
  }, [modules, filters]);

  const unlockedModules = useMemo(
    () => modules.filter((mod) => purchasedModuleIds.includes(mod.id)),
    [modules, purchasedModuleIds],
  );
  const tdahModules = useMemo(() => modules.filter((m) => m.condition === 'TDAH'), [modules]);
  const autismModules = useMemo(() => modules.filter((m) => m.condition === 'Autismo'), [modules]);
  const quickGuides = useMemo(
    () => modules.filter((m) => m.contentType === 'Guia' || m.contentType === 'Tip'),
    [modules],
  );
  const updates = useMemo(
    () => modules.filter((m) => m.contentType === 'Congreso' || m.condition === 'General'),
    [modules],
  );

  if (route === '/admin') {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-app flex items-center justify-center">
            <p className="kicker">Abriendo el panel</p>
          </div>
        }
      >
        <AdminDashboard />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Navbar
        onOpenFilters={() => setIsFilterBarOpen((open) => !open)}
        isFiltersOpen={isFilterBarOpen}
      />

      <FilterBar
        isOpen={isFilterBarOpen}
        onClose={() => setIsFilterBarOpen(false)}
        filteredCount={filteredModules.length}
      />

      <main className="flex-1">
        {isFiltering ? (
          /* ----- Resultados de búsqueda ----- */
          <section id="catalogo" className="py-10 lg:py-14 border-b border-rule">
            <div className="shell">
              <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
                <div>
                  <p className="kicker">Resultados del catálogo</p>
                  <h1 className="mt-2 text-3xl sm:text-4xl leading-tight">
                    {filteredModules.length === 0
                      ? 'Sin coincidencias'
                      : `${filteredModules.length} ${
                          filteredModules.length === 1 ? 'programa' : 'programas'
                        } para tu búsqueda`}
                  </h1>
                </div>
                <button onClick={resetFilters} className="btn btn-secondary shrink-0">
                  Ver el catálogo completo
                </button>
              </header>

              {filteredModules.length === 0 ? (
                <div className="border border-rule bg-card p-10 text-center">
                  <h2 className="text-2xl">No hay módulos con esos criterios.</h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-secondary">
                    Probá con otra condición clínica o borrá el texto del buscador.
                  </p>
                  <button onClick={resetFilters} className="btn btn-primary mt-5">
                    Limpiar los filtros
                  </button>
                </div>
              ) : (
                <div className="rule-grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {filteredModules.map((mod, index) => (
                    <ModuleCard key={mod.id} module={mod} index={index} />
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : (
          /* ----- Portada del compendio ----- */
          <>
            <HeroBanner />
            <ContinueWatching />
            <ClinicalCompass />

            {unlockedModules.length > 0 && (
              <ContentRow
                kicker="Tu biblioteca"
                title="Módulos con acceso habilitado"
                summary="Podés volver a verlos las veces que necesites, sin vencimiento."
                modules={unlockedModules}
              />
            )}

            <ContentRow
              id="catalogo"
              kicker="Sección 01 · Atención y funciones ejecutivas"
              title="Manejo integral del TDAH"
              summary="Química de la atención, rutinas domésticas, mediación escolar y criterios de medicación."
              modules={tdahModules}
            />

            <ContentRow
              kicker="Sección 02 · Espectro autista"
              title="Autismo (TEA) y regulación"
              summary="Colapsos sensoriales, anticipación visual y comunicación con apoyos."
              modules={autismModules}
            />

            <ContentRow
              kicker="Sección 03 · Consulta puntual"
              title="Guías rápidas y tips clínicos"
              summary="Respuestas acotadas para una situación concreta, en menos de una hora."
              modules={quickGuides}
            />

            <ContentRow
              kicker="Sección 04 · Actualización profesional"
              title="Congresos y neurodesarrollo"
              summary="Grabaciones completas sobre criterios diagnósticos y avances terapéuticos."
              modules={updates}
            />

            <DoctorProfileSection />

            <ConsultingRooms />
          </>
        )}
      </main>

      <Footer />

      <ModuleDetailModal />
      <VideoPlayerModal />
      <CheckoutModal />
      <AuthModal />
      <DemoPresentationToolbar />
    </div>
  );
};

export default App;
