import { test, expect } from '@playwright/test';

/**
 * El pago es una simulación: no hay pasarela real todavía. Lo que importa
 * verificar es que el acceso quede registrado y sobreviva a una recarga.
 */
test('desbloquear un módulo da acceso y el acceso sobrevive al refresco', async ({ page }) => {
  await page.goto('/');

  const ficha = page.getByRole('article').filter({ hasText: /desbloquear módulo/i }).first();
  const titulo = (await ficha.getByRole('heading').first().textContent())?.trim() ?? '';

  await ficha.getByRole('button', { name: /desbloquear módulo/i }).click();

  const pasarela = page.getByRole('dialog');
  await expect(pasarela).toContainText(/desbloquear el módulo/i);
  await expect(pasarela.getByRole('radio', { name: /mercado pago/i })).toBeChecked();

  await pasarela.getByRole('button', { name: /^pagar/i }).click();

  await expect(page.getByRole('dialog')).toContainText(/ya tenés acceso al módulo/i);
  await page.keyboard.press('Escape');

  await page.reload();

  const misma = page.getByRole('article').filter({ hasText: titulo }).first();
  await expect(misma.getByRole('button', { name: /desbloquear módulo/i })).toHaveCount(0);
  await expect(misma.getByRole('button', { name: /ver clase/i })).toBeVisible();
});
