/**
 * GENERADOR DE LA IMAGEN DE COMPARTIR
 *
 * Renderiza la plantilla HTML a un PNG de 1200x630, que es lo que piden
 * WhatsApp, Facebook, LinkedIn y X para la tarjeta de un enlace.
 *
 *   node scripts/og/generar.mjs            -> escribe public/og.png
 *   node scripts/og/generar.mjs a b        -> escribe og-a.png y og-b.png al lado
 *                                             de las plantillas, para comparar
 *
 * Tener la plantilla en el repositorio -y no sólo el PNG- permite corregir una
 * palabra del titular sin tener que rehacer la imagen a mano.
 */
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ANCHO = 1200;
const ALTO = 630;

const aca = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aca, '../..');

const variantes = process.argv.slice(2);
const trabajos = variantes.length
  ? variantes.map((v) => ({ plantilla: `${v}.html`, salida: path.join(aca, `og-${v}.png`) }))
  : [{ plantilla: 'plantilla.html', salida: path.join(raiz, 'public/og.png') }];

const navegador = await chromium.launch();
const pagina = await navegador.newPage({
  viewport: { width: ANCHO, height: ALTO },
  deviceScaleFactor: 1,
});

for (const { plantilla, salida } of trabajos) {
  await pagina.goto(`file://${path.join(aca, plantilla)}`);
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForLoadState('networkidle');
  await pagina.screenshot({ path: salida });
  console.log(`listo: ${path.relative(raiz, salida)}`);
}

await navegador.close();
