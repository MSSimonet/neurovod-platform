import { defineConfig, devices } from '@playwright/test';

/**
 * PRUEBAS DE PUNTA A PUNTA
 *
 * Corren contra el build de producción servido por `vite preview`, no contra
 * el servidor de desarrollo: así se prueba el mismo paquete que se publica,
 * con las tipografías empaquetadas y el panel en su chunk aparte.
 *
 * Los tests de Vitest ya cubren cada componente con jsdom. Lo que se verifica
 * acá es lo que jsdom no puede: un navegador de verdad, el ruteo por hash
 * sobreviviendo al refresco y lo que queda guardado entre visitas.
 */
const PUERTO = 4173;
const BASE = `http://localhost:${PUERTO}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: BASE,
    locale: 'es-AR',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'] } },
    // La mayoría de las familias entra desde el teléfono.
    { name: 'telefono', use: { ...devices['Pixel 5'] } },
  ],

  webServer: {
    command: `npm run build && npm run preview -- --port ${PUERTO} --strictPort`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
