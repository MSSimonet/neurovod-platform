/**
 * ANCHO DE IMAGEN A MEDIDA DEL HUECO
 *
 * La misma foto se muestra a sangre en la portada y recortada en un círculo
 * de 32 px. Pedir el archivo grande para el círculo desperdicia todo: el
 * navegador lo baja entero y después lo achica.
 *
 * `imageAt` recibe el ancho del hueco en pantalla y devuelve la URL de la
 * versión que corresponde. Conviene pasarle el ancho ya multiplicado por 2,
 * así la imagen no se ve blanda en pantallas retina.
 *
 * Entiende dos fuentes y ninguna más:
 *
 *  - El retrato del profesional, que vive en el sitio en varios anchos ya
 *    recortados por scripts/imagenes/generar.mjs.
 *  - Las portadas del catálogo, que vienen de Unsplash con el ancho en un
 *    parámetro de la URL.
 *
 * Cualquier otro origen, o una URL rota, se devuelve intacto.
 */

/** Anchos que genera scripts/imagenes/generar.mjs. De menor a mayor. */
export const ANCHOS_RETRATO = [192, 384, 640, 1000, 1400] as const;

const RETRATO = /^\/dr\/retrato-\d+\.webp$/;

const UNSPLASH_HOST = 'images.unsplash.com';

/** Ej: 64 -> "/dr/retrato-192.webp". El más chico que alcanza. */
const retratoDe = (width: number): string => {
  const ancho = ANCHOS_RETRATO.find((a) => a >= width) ?? ANCHOS_RETRATO[ANCHOS_RETRATO.length - 1];
  return `/dr/retrato-${ancho}.webp`;
};

export const imageAt = (url: string, width: number): string => {
  if (RETRATO.test(url)) return retratoDe(width);

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

/**
 * Lista de versiones del retrato para que el navegador elija según pantalla.
 * Se usa donde la foto ocupa un espacio que cambia de tamaño, como la portada.
 */
export const retratoSrcSet = (): string =>
  ANCHOS_RETRATO.map((ancho) => `/dr/retrato-${ancho}.webp ${ancho}w`).join(', ');
