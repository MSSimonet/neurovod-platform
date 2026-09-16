/**
 * Lleva la vista al catálogo.
 *
 * Se espera un fotograma doble a propósito. Cuando cambia un filtro, la página
 * pasa de la portada completa al listado de resultados, que mide bastante menos.
 * Si el desplazamiento corre antes de que React confirme ese cambio, la posición
 * calculada deja de corresponder al nuevo alto y la vista aterriza en cualquier
 * lado. El primer fotograma deja confirmar el render, el segundo deja pintar.
 *
 * La separación respecto de la cabecera fija la resuelve `scroll-margin-top`
 * sobre #catalogo, definido en index.css.
 */
export const scrollToCatalog = (): void => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.getElementById('catalogo')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });
};
