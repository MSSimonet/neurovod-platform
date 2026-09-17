import { useEffect } from 'react';
import { AppRoute } from './useRoute';

/**
 * CANÓNICA POR RUTA
 *
 * Las dos vistas se sirven desde el mismo index.html, así que la etiqueta
 * `rel="canonical"` que viene en el HTML apunta siempre a la portada. En el
 * panel eso es una contradicción: la página declara que su versión buena es
 * otra.
 *
 * El origen no se repite acá: se lee del propio enlace, que es donde ya está
 * declarado. Así el sitio puede mudarse a un dominio propio tocando una sola
 * línea del HTML, y una URL de previsualización nunca se declara canónica.
 */
const RUTA_CANONICA: Record<AppRoute, string> = {
  '/': '/',
  '/admin': '/admin',
};

export const useCanonical = (route: AppRoute): void => {
  useEffect(() => {
    const enlace = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!enlace) return;

    const url = new URL(enlace.href);
    url.pathname = RUTA_CANONICA[route];
    enlace.href = url.toString();
  }, [route]);
};
