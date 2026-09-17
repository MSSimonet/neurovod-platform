import { test, expect } from '@playwright/test';

test('el panel se abre por el hash y sigue ahí después de recargar', async ({ page }) => {
  await page.goto('/#/admin');

  // Viaja en su propio paquete: aparece recién cuando termina de bajar.
  await expect(page.getByRole('button', { name: /volver al sitio/i })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('button', { name: /volver al sitio/i })).toBeVisible();
});

test('volver al sitio devuelve al catálogo', async ({ page }) => {
  await page.goto('/#/admin');

  await page.getByRole('button', { name: /volver al sitio/i }).click();

  await expect(page.getByRole('heading', { level: 1 })).toContainText(/lo que explico en consulta/i);
});

test('la portada no ofrece el acceso al panel', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: /panel médico/i })).toHaveCount(0);
});

test('el panel se declara canónico de sí mismo y no de la portada', async ({ page }) => {
  await page.goto('/#/admin');
  await expect(page.getByRole('button', { name: /volver al sitio/i })).toBeVisible();

  const canonica = page.locator('link[rel="canonical"]');
  await expect(canonica).toHaveAttribute('href', /\/admin$/);

  await page.getByRole('button', { name: /volver al sitio/i }).click();

  await expect(canonica).toHaveAttribute('href', /vercel\.app\/$/);
});
