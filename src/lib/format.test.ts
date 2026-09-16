import { describe, expect, test } from 'vitest';
import {
  formatArs,
  formatArsLong,
  formatMinutes,
  formatClock,
  formatDate,
  folio,
  conditionTag,
  CONDITION_META,
} from './format';

/** El separador de miles que produce Intl para es-AR es un punto. */
const soloDigitos = (s: string) => s.replace(/\D/g, '');

describe('formatArs', () => {
  test('usa el separador de miles argentino y no muestra centavos', () => {
    const resultado = formatArs(50000);

    expect(soloDigitos(resultado)).toBe('50000');
    expect(resultado).toContain('$');
    expect(resultado).not.toContain(',00');
  });

  test('formatea el precio de una guía puntual', () => {
    expect(soloDigitos(formatArs(15000))).toBe('15000');
  });

  test('redondea sin decimales los montos con fracción', () => {
    const resultado = formatArs(16666.67);

    expect(resultado).not.toMatch(/[.,]\d{2}\s*$/);
    expect(soloDigitos(resultado)).toBe('16667');
  });

  test('devuelve cero para una beca sin cobro', () => {
    expect(soloDigitos(formatArs(0))).toBe('0');
  });

  test('formatea montos de siete cifras del panel de ventas', () => {
    expect(soloDigitos(formatArs(8450000))).toBe('8450000');
  });
});

describe('formatArsLong', () => {
  test('agrega la sigla de la moneda para el comprobante', () => {
    const resultado = formatArsLong(50000);

    expect(resultado).toMatch(/ARS$/);
    expect(soloDigitos(resultado)).toBe('50000');
  });
});

describe('formatMinutes', () => {
  test('muestra solo minutos cuando no llega a la hora', () => {
    expect(formatMinutes(48)).toBe('48 min');
  });

  test('muestra horas y minutos en una duración mixta', () => {
    expect(formatMinutes(165)).toBe('2 h 45 min');
  });

  test('omite los minutos cuando la duración es exacta en horas', () => {
    expect(formatMinutes(120)).toBe('2 h');
  });

  test('trata el cero como cero minutos', () => {
    expect(formatMinutes(0)).toBe('0 min');
  });
});

describe('formatClock', () => {
  test('rellena los segundos con cero a la izquierda', () => {
    expect(formatClock(65)).toBe('1:05');
  });

  test('descarta la fracción de segundo que informa el reproductor', () => {
    expect(formatClock(125.9)).toBe('2:05');
  });

  test('devuelve cero cuando el video todavía no informa duración', () => {
    expect(formatClock(NaN)).toBe('0:00');
    expect(formatClock(Infinity)).toBe('0:00');
    expect(formatClock(-10)).toBe('0:00');
  });
});

describe('formatDate', () => {
  test('arma una fecha corta en español', () => {
    const resultado = formatDate('2026-09-12T13:24:00.000Z');

    expect(resultado).toContain('2026');
    expect(resultado).toMatch(/\d{2}/);
  });

  test('devuelve cadena vacía ante una fecha inválida', () => {
    expect(formatDate('no es una fecha')).toBe('');
  });
});

describe('folio', () => {
  test('numera la primera ficha con cero a la izquierda', () => {
    expect(folio(0)).toBe('01');
  });

  test('deja de rellenar a partir de dos dígitos', () => {
    expect(folio(11)).toBe('12');
  });
});

describe('conditionTag', () => {
  test('asigna a cada condición su color sanitario', () => {
    expect(conditionTag('TDAH')).toBe('tag tag-tdah');
    expect(conditionTag('Autismo')).toBe('tag tag-tea');
    expect(conditionTag('Sensorial')).toBe('tag tag-sensorial');
    expect(conditionTag('General')).toBe('tag tag-general');
  });

  test('toda condición tiene etiqueta corta y nombre clínico', () => {
    for (const meta of Object.values(CONDITION_META)) {
      expect(meta.label.length).toBeGreaterThan(0);
      expect(meta.clinicalName.length).toBeGreaterThan(meta.label.length);
    }
  });
});
