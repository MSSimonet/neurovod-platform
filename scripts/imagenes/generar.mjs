/**
 * VERSIONES DEL RETRATO DEL PROFESIONAL
 *
 *   node scripts/imagenes/generar.mjs   ->  public/dr/retrato-<ancho>.webp
 *
 * El original es una foto de estudio de 1600x1600 y 414 KB. La misma imagen
 * se muestra a sangre en la portada y recortada en círculos de 32 px, así que
 * servir el archivo entero en todos lados haría que el avatar de la barra
 * baje 414 KB para mostrarse del tamaño de una uña.
 *
 * Acá se recorta una sola vez a cada ancho que el sitio necesita. El original
 * vive en scripts/, no en public/: no se publica, se versiona como fuente.
 *
 * Los anchos tienen que coincidir con ANCHOS_RETRATO en src/lib/imageUrl.ts,
 * que es quien elige cuál pedir en cada lugar.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const ANCHOS = [192, 384, 640, 1000, 1400];
const CALIDAD = 82;

const aca = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aca, '../..');
const origen = path.join(aca, 'fuente/foto_dr.jpeg');
const destino = path.join(raiz, 'public/dr');

await mkdir(destino, { recursive: true });

for (const ancho of ANCHOS) {
  const salida = path.join(destino, `retrato-${ancho}.webp`);
  const { size } = await sharp(origen)
    .resize(ancho, ancho, { fit: 'cover', position: 'top' })
    .webp({ quality: CALIDAD })
    .toFile(salida);

  console.log(`retrato-${ancho}.webp · ${Math.round(size / 1024)} KB`);
}
