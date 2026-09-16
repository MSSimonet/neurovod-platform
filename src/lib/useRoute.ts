import { useCallback, useEffect, useState } from 'react';

export type AppRoute = '/' | '/admin';

const readRoute = (): AppRoute => {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname.replace(/\/+$/, '');
  const hash = window.location.hash.replace(/^#/, '').replace(/\/+$/, '');
  if (path === '/admin' || hash === '/admin') return '/admin';
  return '/';
};

/**
 * Ruteo minimo sobre la History API. Evita sumar una dependencia de router
 * para dos vistas. Soporta /admin y el fallback #/admin para hostings
 * estaticos que no reescriben rutas hacia index.html.
 */
export const useRoute = (): { route: AppRoute; navigate: (to: AppRoute) => void } => {
  const [route, setRoute] = useState<AppRoute>(readRoute);

  useEffect(() => {
    const sync = () => setRoute(readRoute());
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  const navigate = useCallback((to: AppRoute) => {
    if (readRoute() !== to) {
      window.history.pushState({}, '', to);
    }
    setRoute(to);
    window.scrollTo({ top: 0 });
  }, []);

  return { route, navigate };
};
