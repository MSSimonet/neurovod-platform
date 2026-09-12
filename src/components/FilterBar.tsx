import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import { ConditionType, ContentType, TargetAudience } from '../types';
import { Filter, X, RefreshCw, Search, Layers, Calendar, Users, Stethoscope } from 'lucide-react';

interface FilterBarProps {
  isOpen: boolean;
  onClose: () => void;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ isOpen, onClose, filteredCount }) => {
  const { filters, setFilters, resetFilters } = usePlatform();

  if (!isOpen) return null;

  const conditions: { label: string; value: ConditionType | 'all' }[] = [
    { label: 'Todas las Condiciones', value: 'all' },
    { label: 'TDAH', value: 'TDAH' },
    { label: 'Autismo (TEA)', value: 'Autismo' },
    { label: 'Sensorial / Integración', value: 'Sensorial' },
    { label: 'General / Otros', value: 'General' },
  ];

  const contentTypes: { label: string; value: ContentType | 'all' }[] = [
    { label: 'Todos los Formatos', value: 'all' },
    { label: 'Módulo Completo (5 ep.)', value: 'Modulo' },
    { label: 'Guía Rápida Intensiva', value: 'Guia' },
    { label: 'Tip Práctico de Consulta', value: 'Tip' },
    { label: 'Congreso / Jornada', value: 'Congreso' },
  ];

  const years: { label: string; value: number | 'all' }[] = [
    { label: 'Todos los Años', value: 'all' },
    { label: '2026 (Actual)', value: 2026 },
    { label: '2025', value: 2025 },
    { label: '2024', value: 2024 },
  ];

  const audiences: { label: string; value: TargetAudience | 'all' }[] = [
    { label: 'Toda la Familia', value: 'all' },
    { label: 'Preescolar (2-5 años)', value: 'Preescolar (2-5 años)' },
    { label: 'Escolar (6-12 años)', value: 'Escolar (6-12 años)' },
    { label: 'Adolescentes (13-18 años)', value: 'Adolescentes (13-18 años)' },
    { label: 'Familias y Cuidadores', value: 'Familias y Cuidadores' },
  ];

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.condition !== 'all' ||
    filters.contentType !== 'all' ||
    filters.year !== 'all' ||
    filters.targetAudience !== 'all';

  return (
    <div className="bg-slate-900/95 border-y border-cyan-900/40 py-6 px-4 sm:px-8 lg:px-12 backdrop-blur-xl animate-fade-in shadow-2xl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Title and Reset / Close */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Buscador Avanzado y Clasificación Multivariable
            </h3>
            <span className="ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
              {filteredCount} {filteredCount === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium px-3 py-1.5 rounded-lg bg-cyan-950/50 border border-cyan-900 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Limpiar Filtros
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Cerrar panel de filtros"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Text Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
          <input
            type="text"
            placeholder="Buscar por síntoma clínico, tema o palabra clave (ej: desregulación, melatonina, rutinas, escuela)..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-500 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* 4 Multi-variable Filter Groups */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
          {/* 1. Condición / Diagnóstico */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
              1. Condición Médica
            </label>
            <div className="flex flex-wrap gap-1.5">
              {conditions.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilters(prev => ({ ...prev, condition: item.value }))}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                    filters.condition === item.value
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Tipo de Contenido */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              2. Formato de Contenido
            </label>
            <div className="flex flex-wrap gap-1.5">
              {contentTypes.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilters(prev => ({ ...prev, contentType: item.value }))}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                    filters.contentType === item.value
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Año de Edición */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              3. Año de Edición
            </label>
            <div className="flex flex-wrap gap-1.5">
              {years.map((item) => (
                <button
                  key={item.value.toString()}
                  onClick={() => setFilters(prev => ({ ...prev, year: item.value }))}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                    filters.year === item.value
                      ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Grupo Objetivo */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              4. Grupo Objetivo
            </label>
            <div className="flex flex-wrap gap-1.5">
              {audiences.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilters(prev => ({ ...prev, targetAudience: item.value }))}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                    filters.targetAudience === item.value
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
