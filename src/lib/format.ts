import { ConditionType } from '../types';

/**
 * Formato oficial de moneda para toda la plataforma.
 * Pesos Argentinos, sin decimales (los montos son siempre redondos).
 */
const arsFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Ej: 50000 -> "$ 50.000" */
export const formatArs = (amount: number): string => arsFormatter.format(amount);

/** Ej: 50000 -> "$ 50.000 ARS". Se usa en checkout y comprobantes. */
export const formatArsLong = (amount: number): string => `${arsFormatter.format(amount)} ARS`;

/** Ej: 145 -> "2 h 25 min". Duraciones siempre explicitas para la familia. */
export const formatMinutes = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
};

/** Ej: 3720 -> "62:00". Reloj del reproductor. */
export const formatClock = (totalSeconds: number): string => {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

/** Ej: "2026-03-11T14:02:00Z" -> "11 mar 2026" */
export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/** Numeracion de ficha del compendio: 1 -> "01" */
export const folio = (index: number): string => String(index + 1).padStart(2, '0');

interface ConditionMeta {
  /** Etiqueta corta para la ficha del catalogo */
  label: string;
  /** Nombre clinico completo, usado en indices y titulos de seccion */
  clinicalName: string;
  /** Clase de color sanitario definida en index.css */
  tagClass: string;
}

export const CONDITION_META: Record<ConditionType, ConditionMeta> = {
  TDAH: {
    label: 'TDAH',
    clinicalName: 'Trastorno por Deficit de Atencion e Hiperactividad',
    tagClass: 'tag-tdah',
  },
  Autismo: {
    label: 'Autismo (TEA)',
    clinicalName: 'Condicion del Espectro Autista',
    tagClass: 'tag-tea',
  },
  Sensorial: {
    label: 'Sensorial',
    clinicalName: 'Procesamiento sensorial y regulacion',
    tagClass: 'tag-sensorial',
  },
  General: {
    label: 'Neurodesarrollo',
    clinicalName: 'Neurodesarrollo general y actualizacion medica',
    tagClass: 'tag-general',
  },
};

export const conditionTag = (condition: ConditionType): string =>
  `tag ${CONDITION_META[condition].tagClass}`;
