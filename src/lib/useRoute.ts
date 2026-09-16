import { useCallback, useEffect, useState } from 'react';

export type AppRoute = '/' | '/admin';

/**
 * RUTEO PARA HOSTING ESTÁTICO
 *
 * La forma canónica de la ruta es el hash (#/admin) porque funciona en
 * cualquier destino: sobrevive al refresco, al enlace directo y a un
 * subdirectorio de publicación, sin pedir configuración del servidor.
 *
 * El pathname /admin también se acepta al entrar. En Vercel funciona
 * gracias a la reescritura declarada en vercel.json, y en el servidor de
 * desarrollo de Vite gracias a su fallback de aplicación de una sola
 * página. Se descuenta BASE_URL para tolerar un subdirectorio.
 */

/** Quita el subdirectorio de publicación del pathname. */
const stripBase = (pathname: string): string => {
  const base = import.meta.env.BASE_URL ?? '/';
  // Con base relativa ('./') no hay prefijo absoluto que descontar.
  const prefix = base.startsWith('/') ? base.replace(/\/+$/, '') : '';
  const path = prefix && pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;
  return path.replace(/\/+$/, '') || '/';
};

/** Path del sitio sin la ruta de la aplicación. Sirve para volver al inicio. */
const homeHref = (): string => {
  const base = import.meta.env.BASE_URL ?? '/';
  const pathname = stripBase(window.location.pathname) === '/admin' ? base : window.location.pathname;
  return `${pathname}${window.location.search}`;
};

const readRoute = (): AppRoute => {
  if (typeof window === 'undefined') return '/';

  const hash = window.location.hash.replace(/^#/, '').replace(/\/+$/, '');
  if (hash) return hash === '/admin' ? '/admin' : '/';

  return stripBase(window.location.pathname) === '/admin' ? '/admin' : '/';
};

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
    // Siempre relativo al documento actual: nunca se sale del subdirectorio.
    const target = to === '/admin' ? '#/admin' : homeHref();
    window.history.pushState({}, '', target);
    setRoute(to);
    window.scrollTo({ top: 0 });
  }, []);

  return { route, navigate };
};
