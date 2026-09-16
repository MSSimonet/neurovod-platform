import React, { useEffect, useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { ConditionType } from '../types';
import { scrollToCatalog } from '../lib/scrollToCatalog';
import { Search, SlidersHorizontal, X, BookMarked } from 'lucide-react';

interface NavbarProps {
  onOpenFilters: () => void;
  isFiltersOpen: boolean;
}

const CONDITION_LINKS: { label: string; value: ConditionType | 'all' }[] = [
  { label: 'Catálogo completo', value: 'all' },
  { label: 'TDAH', value: 'TDAH' },
  { label: 'Autismo (TEA)', value: 'Autismo' },
  { label: 'Sensorial', value: 'Sensorial' },
  { label: 'Neurodesarrollo', value: 'General' },
];

export const Navbar = ({ onOpenFilters, isFiltersOpen }: NavbarProps) => {
  const { filters, setFilters, purchasedModuleIds, user, setIsAuthModalOpen, navigate } =
    usePlatform();
  const [isCondensed, setIsCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsCondensed(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToCondition = (value: ConditionType | 'all') => {
    setFilters((prev) => ({ ...prev, condition: value }));
    scrollToCatalog();
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-rule">
      {/* Cabecera de publicación: la credencial a la vista, se pliega al bajar */}
      <div
        className={`hidden md:block overflow-hidden border-b border-rule bg-subtle transition-all duration-200 ${
          isCondensed ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
        }`}
      >
        <div className="shell flex items-center justify-between gap-4 h-9 text-2xs text-ink-muted">
          <p className="tabular truncate">
            DR. JULIÁN ROSSI · NEUROLOGÍA INFANTIL · MN 142.890 · CONSULTORIO CABA
          </p>
          <p className="tabular hidden lg:block shrink-0">
            CONTENIDO CLÍNICO VERIFICADO · EDICIÓN 2026
          </p>
        </div>
      </div>

      {/* Fila principal: identidad y controles del lector */}
      <div className="shell">
        <div className="flex items-center justify-between gap-4 h-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-baseline gap-2 text-left shrink-0"
          >
            <span className="font-serif text-2xl leading-none text-ink">NeuroVOD</span>
            <span className="kicker hidden sm:inline">Médica</span>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="relative hidden sm:block min-w-0">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="Buscar síntoma o tema"
                aria-label="Buscar en el catálogo clínico"
                className="field w-44 lg:w-56 pl-8 pr-8 py-2 text-[13px]"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={onOpenFilters}
              aria-expanded={isFiltersOpen}
              aria-label="Filtros del catálogo"
              className={`btn ${isFiltersOpen ? 'btn-primary' : 'btn-secondary'} px-3 py-2 shrink-0`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Filtros</span>
            </button>

            <button
              onClick={() => goToCondition('all')}
              className="btn btn-ghost px-3 py-2 shrink-0"
              aria-label={`Mi biblioteca, ${purchasedModuleIds.length} módulos habilitados`}
            >
              <BookMarked className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden lg:inline">Mi biblioteca</span>
              <span className="tabular text-2xs text-ink-muted">{purchasedModuleIds.length}</span>
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 pl-2 border-l border-rule shrink-0"
              aria-label={user ? `Perfil de ${user.name}` : 'Ingresar a la plataforma'}
            >
              {user ? (
                <>
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-rule-strong"
                  />
                  <span className="hidden xl:block text-left leading-tight">
                    <span className="block text-[13px] font-semibold text-ink">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="block text-2xs text-ink-muted">{user.role}</span>
                  </span>
                </>
              ) : (
                <span className="btn btn-secondary px-3 py-2">Ingresar</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Barra de secciones al modo de un diario. Se desplaza en pantallas angostas,
          así la navegación por condición también existe en el celular. */}
      <div className="border-t border-rule">
        <div className="shell">
          <nav
            className="flex items-center gap-1 h-11 overflow-x-auto no-scrollbar"
            aria-label="Condiciones clínicas"
          >
            {CONDITION_LINKS.map((link) => {
              const isActive = filters.condition === link.value;
              return (
                <button
                  key={link.value}
                  onClick={() => goToCondition(link.value)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`px-3 py-1.5 text-[13px] font-medium rounded-xs whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-accent-surface text-accent'
                      : 'text-ink-secondary hover:bg-subtle hover:text-ink'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
