import { describe, expect, test } from 'vitest';
import { createPreference, confirmPayment, isSandbox, PaymentPayload } from './mercadopago';
import { sampleModules } from '../data/catalog';

const pago = (extra: Partial<PaymentPayload> = {}): PaymentPayload => ({
  module: sampleModules[0],
  amountArs: 50000,
  method: 'mercadopago',
  payerEmail: 'familia@ejemplo.com',
  installments: 1,
  ...extra,
});

describe('createPreference', () => {
  test('devuelve un identificador y un punto de inicio de pago', async () => {
    const preferencia = await createPreference(pago());

    expect(preferencia.preferenceId).toMatch(/^PREF-\d{12}$/);
    expect(preferencia.initPoint).toContain('mercadopago.com.ar');
    expect(preferencia.initPoint).toContain(preferencia.preferenceId);
  });

  test('cada operación genera una preferencia distinta', async () => {
    const [a, b] = await Promise.all([createPreference(pago()), createPreference(pago())]);

    expect(a.preferenceId).not.toBe(b.preferenceId);
  });
});

describe('confirmPayment', () => {
  test('acredita el pago y entrega un comprobante con fecha', async () => {
    const resultado = await confirmPayment(pago());

    expect(resultado.status).toBe('approved');
    expect(resultado.paymentId).toMatch(/^MP-\d{9}$/);
    expect(Number.isNaN(Date.parse(resultado.processedAt))).toBe(false);
  });

  test('describe el pago con dinero en cuenta', async () => {
    const resultado = await confirmPayment(pago({ method: 'mercadopago' }));

    expect(resultado.detail).toContain('Mercado Pago');
  });

  test('detalla la cantidad de cuotas cuando se paga con tarjeta', async () => {
    const resultado = await confirmPayment(pago({ method: 'card', installments: 3 }));

    expect(resultado.detail).toContain('3 cuotas');
  });

  test('distingue el pago con tarjeta en una sola cuota', async () => {
    const resultado = await confirmPayment(pago({ method: 'card', installments: 1 }));

    expect(resultado.detail).toContain('un pago');
    expect(resultado.detail).not.toContain('cuotas');
  });

  test('describe la transferencia bancaria', async () => {
    const resultado = await confirmPayment(pago({ method: 'transfer' }));

    expect(resultado.detail).toContain('Transferencia');
  });
});

describe('isSandbox', () => {
  test('avisa que no se procesan operaciones reales mientras falten credenciales', () => {
    expect(isSandbox()).toBe(true);
  });
});
