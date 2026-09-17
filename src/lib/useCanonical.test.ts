import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCanonical } from './useCanonical';

const ponerEnlace = (href: string) => {
  const enlace = document.createElement('link');
  enlace.rel = 'canonical';
  enlace.href = href;
  document.head.appendChild(enlace);
  return enlace;
};

beforeEach(() => {
  document.head.querySelectorAll('link[rel="canonical"]').forEach((e) => e.remove());
});

afterEach(() => {
  document.head.querySelectorAll('link[rel="canonical"]').forEach((e) => e.remove());
});

describe('useCanonical', () => {
  test('el panel se declara canónico de sí mismo, no de la portada', () => {
    const enlace = ponerEnlace('https://neurovod-platform.vercel.app/');

    renderHook(() => useCanonical('/admin'));

    expect(enlace.href).toBe('https://neurovod-platform.vercel.app/admin');
  });

  test('la portada queda apuntando a la raíz', () => {
    const enlace = ponerEnlace('https://neurovod-platform.vercel.app/admin');

    renderHook(() => useCanonical('/'));

    expect(enlace.href).toBe('https://neurovod-platform.vercel.app/');
  });

  test('conserva el origen declarado en el HTML y no el del navegador', () => {
    const enlace = ponerEnlace('https://neurovod.com.ar/');

    renderHook(() => useCanonical('/admin'));

    expect(new URL(enlace.href).origin).toBe('https://neurovod.com.ar');
  });

  test('no explota si la página no declara canónica', () => {
    expect(() => renderHook(() => useCanonical('/admin'))).not.toThrow();
  });
});
