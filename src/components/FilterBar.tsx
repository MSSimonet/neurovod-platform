import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import { ConditionType, ContentType, TargetAudience } from '../types';
import { X, RotateCcw, Search } from 'lucide-react';

interface FilterBarProps {
  isOpen: boolean;
  onClose: () => void;
  filteredCount: number;
}

interface FilterGroup<T> {
  legend: string;
  options: { label: string; value: T }[];
  value: T;
  onSelect: (value: T) => void;
}

const conditions: { label: string; value: ConditionType | 'all' }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'TDAH', value: 'TDAH' },
  { label: 'Autismo (TEA)', value: 'Autismo' },
  { label: 'Sensorial', value: 'Sensorial' },
  { label: 'Neurodesarrollo', value: 'General' },
];

const contentTypes: { label: string; value: ContentType | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Módulo completo', value: 'Modulo' },
  { label: 'Guía intensiva', value: 'Guia' },
  { label: 'Tip de consulta', value: 'Tip' },
  { label: 'Congreso', value: 'Congreso' },
];

const audiences: { label: string; value: TargetAudience | 'all' }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Preescolar', value: 'Preescolar (2-5 años)' },
  { label: 'Escolar', value: 'Escolar (6-12 años)' },
  { label: 'Adolescentes', value: 'Adolescentes (13-18 años)' },
  { label: 'Cuidadores', value: 'Familias y Cuidadores' },
];

const years: { label: string; value: number | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: '2026', value: 2026 },
  { label: '2025', value: 2025 },
  { label: '2024', value: 2024 },
];

function FilterFieldset<T extends string | number>({ legend, options, value, onSelect }: FilterGroup<T>) {
  return (
    <fieldset className="rule-cell p-5">
      <legend className="label">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(option.value)}
              className={`px-2.5 py-1.5 text-[13px] rounded-xs border transition-colors ${
                isActive
                  ? 'bg-accent text-ink-inverse border-accent font-semibold'
                  : 'bg-card text-ink-secondary border-rule-strong hover:border-ink-muted hover:text-ink'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export const FilterBar = ({ isOpen, onClose, filteredCount }: FilterBarProps) => {
  const { filters, setFilters, resetFilters } = usePlatform();

  if (!isOpen) return null;

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.condition !== 'all' ||
    filters.contentType !== 'all' ||
    filters.year !== 'all' ||
    filters.targetAudience !== 'all';

  return (
    <section className="border-b border-rule bg-subtle animate-rise" aria-label="Filtros del catálogo">
      <div className="shell py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-3">
            <p className="kicker">Clasificación del catálogo</p>
            <span className="tabular text-2xs text-ink-muted">
              {String(filteredCount).padStart(2, '0')}{' '}
              {filteredCount === 1 ? 'RESULTADO' : 'RESULTADOS'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button onClick={resetFilters} className="btn btn-ghost px-3 py-2">
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                Limpiar
              </button>
            )}
            <button onClick={onClose} className="btn btn-ghost px-2 py-2" aria-label="Cerrar filtros">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="rule-grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {/*
            Debajo de 640px la barra superior esconde su buscador, así que una
            vez pasada la portada el catálogo se quedaba sin forma de buscar.
            Este campo aparece exactamente donde aquel desaparece: nunca hay
            dos buscadores en pantalla al mismo tiempo.
          */}
          <div className="rule-cell p-5 sm:hidden">
            <label htmlFor="busqueda-catalogo" className="label">
              Síntoma o tema
            </label>
            <div className="relative">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted"
                aria-hidden="true"
              />
              <input
                id="busqueda-catalogo"
                type="search"
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="Sueño, colapso, escuela"
                className="field w-full pl-8 pr-8 py-2 text-[13px]"
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  aria-label="Borrar lo buscado"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <FilterFieldset
            legend="Condición clínica"
            options={conditions}
            value={filters.condition}
            onSelect={(value) => setFilters((prev) => ({ ...prev, condition: value }))}
          />
          <FilterFieldset
            legend="Formato"
            options={contentTypes}
            value={filters.contentType}
            onSelect={(value) => setFilters((prev) => ({ ...prev, contentType: value }))}
          />
          <FilterFieldset
            legend="Edad del paciente"
            options={audiences}
            value={filters.targetAudience}
            onSelect={(value) => setFilters((prev) => ({ ...prev, targetAudience: value }))}
          />
          <FilterFieldset
            legend="Año de edición"
            options={years}
            value={filters.year}
            onSelect={(value) => setFilters((prev) => ({ ...prev, year: value }))}
          />
        </div>
      </div>
    </section>
  );
};
