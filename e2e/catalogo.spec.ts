import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('la portada se presenta con el titular y la credencial del profesional', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/lo que explico en consulta/i);
  await expect(page.getByText(/MN 142\.890/).first()).toBeVisible();
});

test('buscar un síntoma desde la portada filtra el catálogo', async ({ page }) => {
  await page.getByLabel(/buscar por síntoma o tema clínico/i).fill('sueño');
  await page.getByRole('button', { name: /buscar en el catálogo/i }).click();

  await expect(page.getByRole('heading', { level: 1 })).toContainText(/para tu búsqueda/i);
});

test('el buscador de la barra superior limpia lo escrito', async ({ page, isMobile }) => {
  // Debajo de 640px la barra superior esconde el campo: ahí se busca desde la
  // portada, que es lo que cubre el test de arriba.
  test.skip(isMobile, 'el campo de la barra superior no existe en pantalla chica');

  const buscador = page.getByLabel(/buscar en el catálogo clínico/i);
  await buscador.fill('sueño');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/para tu búsqueda/i);

  await page.getByRole('button', { name: /limpiar búsqueda/i }).click();

  await expect(buscador).toHaveValue('');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/lo que explico en consulta/i);
});

test('filtrar por condición deja sólo los programas de esa condición', async ({ page }) => {
  const barra = page.getByRole('navigation', { name: /condiciones clínicas/i });

  await barra.getByRole('button', { name: 'TDAH', exact: true }).click();

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('article').first()).toContainText(/TDAH/i);
});

test('abrir una ficha muestra el índice de clases y se cierra con Escape', async ({ page }) => {
  await page.getByRole('article').first().getByRole('button').first().click();

  const ficha = page.getByRole('dialog');
  await expect(ficha).toContainText(/índice de clases/i);

  await page.keyboard.press('Escape');

  await expect(ficha).toBeHidden();
});
