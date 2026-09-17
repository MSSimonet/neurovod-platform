/**
 * ANCHO DE IMAGEN A MEDIDA DEL HUECO
 *
 * El catálogo guarda las portadas con un ancho fijo en la URL (`w=800`), que
 * es el correcto para una ficha grande pero un desperdicio para un avatar de
 * 32 px: el navegador baja la imagen entera y después la achica.
 *
 * `imageAt` reescribe ese parámetro para pedir sólo lo que se va a mostrar.
 * Como el ancho pedido es el del hueco en pantalla, conviene pasarlo ya
 * multiplicado por 2, así la imagen no se ve blanda en pantallas retina.
 *
 * Sólo toca las URLs de Unsplash, que es la única fuente que entiende el
 * parámetro. Cualquier otro origen (o una URL rota) se devuelve intacto.
 */
const UNSPLASH_HOST = 'images.unsplash.com';

export const imageAt = (url: string, width: number): string => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== UNSPLASH_HOST) return url;

    parsed.searchParams.set('w', String(width));
    return parsed.toString();
  } catch {
    // Una URL relativa o inválida no se puede reescribir: se usa tal cual.
    return url;
  }
};
