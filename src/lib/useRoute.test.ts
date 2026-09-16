import { describe, expect, test, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useRoute } from './useRoute';

/** Coloca al navegador en una URL concreta antes de montar el hook. */
const situarEn = (url: string) => {
  window.history.replaceState({}, '', url);
};

describe('useRoute al entrar por una URL', () => {
  beforeEach(() => situarEn('/'));

  test('la raíz resuelve la portada', () => {
    const { result } = renderHook(() => useRoute());

    expect(result.current.route).toBe('/');
  });

  test('el hash del panel resuelve el panel', () => {
    situarEn('/#/admin');

    const { result } = renderHook(() => useRoute());

    expect(result.current.route).toBe('/admin');
  });

  test('el pathname del panel también resuelve el panel', () => {
    situarEn('/admin');

    const { result } = renderHook(() => useRoute());

    expect(result.current.route).toBe('/admin');
  });

  test('tolera la barra final en el hash', () => {
    situarEn('/#/admin/');

    const { result } = renderHook(() => useRoute());

    expect(result.current.route).toBe('/admin');
  });

  test('un hash desconocido cae en la portada y no rompe', () => {
    situarEn('/#/inventado');

    const { result } = renderHook(() => useRoute());

    expect(result.current.route).toBe('/');
  });

  /**
   * Caso que estaba roto cuando el sitio se publicaba bajo un
   * subdirectorio: el pathname real lo incluye y la comparación contra
   * '/admin' nunca daba verdadera. Se conserva la cobertura para que el
   * ruteo siga tolerando ese despliegue.
   */
  test('reconoce el panel dentro del subdirectorio de publicación', () => {
    situarEn('/neurovod-platform/#/admin');

    const { result } = renderHook(() => useRoute());

    expect(result.current.route).toBe('/admin');
  });

  test('la portada dentro del subdirectorio no se confunde con el panel', () => {
    situarEn('/neurovod-platform/');

    const { result } = renderHook(() => useRoute());

    expect(result.current.route).toBe('/');
  });
});

describe('useRoute al navegar desde la interfaz', () => {
  beforeEach(() => situarEn('/neurovod-platform/'));

  test('ir al panel no abandona el subdirectorio de publicación', () => {
    const { result } = renderHook(() => useRoute());

    act(() => result.current.navigate('/admin'));

    expect(result.current.route).toBe('/admin');
    expect(window.location.pathname).toBe('/neurovod-platform/');
    expect(window.location.hash).toBe('#/admin');
  });

  test('volver al inicio limpia el hash y conserva la ruta base', () => {
    const { result } = renderHook(() => useRoute());
    act(() => result.current.navigate('/admin'));

    act(() => result.current.navigate('/'));

    expect(result.current.route).toBe('/');
    expect(window.location.hash).toBe('');
    expect(window.location.pathname).toBe('/neurovod-platform/');
  });

  test('responde al botón de atrás del navegador', () => {
    const { result } = renderHook(() => useRoute());
    act(() => result.current.navigate('/admin'));

    act(() => {
      window.history.replaceState({}, '', '/neurovod-platform/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current.route).toBe('/');
  });

  test('responde a un cambio de hash escrito a mano', () => {
    const { result } = renderHook(() => useRoute());

    act(() => {
      window.history.replaceState({}, '', '/neurovod-platform/#/admin');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(result.current.route).toBe('/admin');
  });
});
