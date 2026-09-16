import { ModuleItem } from '../types';

/**
 * CAPA DE INTEGRACION CON MERCADO PAGO ARGENTINA (Checkout Pro)
 *
 * Todo el contacto con Mercado Pago vive en este archivo. La interfaz de
 * usuario nunca llama a la pasarela de forma directa, solo consume estas
 * funciones. Cuando el cliente entregue sus credenciales productivas, se
 * reemplaza el cuerpo de `createPreference` y `pollPaymentStatus` sin tocar
 * un solo componente.
 *
 * PASOS PARA PASAR A PRODUCCION
 * 1. `npm install @mercadopago/sdk-react`
 * 2. Definir en el `.env` del proyecto:
 *      VITE_MP_PUBLIC_KEY=APP_USR-xxxxxxxx
 *    La Access Token es secreta y nunca viaja al navegador. Vive en el
 *    backend que crea la preferencia.
 * 3. Publicar el endpoint `POST /api/mp/preference` que llama a la API de
 *    Mercado Pago con la Access Token y devuelve `{ id, init_point }`.
 * 4. Publicar el webhook `POST /api/mp/webhook` que recibe la notificacion
 *    de pago aprobado y habilita el modulo en la base de datos.
 * 5. Cambiar MODE a 'checkout-pro'. El resto del codigo ya esta preparado.
 */

type IntegrationMode = 'simulated' | 'checkout-pro';

/** Cambiar a 'checkout-pro' cuando el cliente entregue sus credenciales. */
const MODE = 'simulated' as IntegrationMode;

const PUBLIC_KEY: string = import.meta.env?.VITE_MP_PUBLIC_KEY ?? '';

export type PaymentMethod = 'mercadopago' | 'card' | 'transfer';

export interface PaymentPayload {
  module: ModuleItem;
  amountArs: number;
  method: PaymentMethod;
  payerEmail: string;
  installments: number;
}

export interface PaymentResult {
  status: 'approved' | 'rejected';
  /** Identificador del pago tal como lo devuelve Mercado Pago */
  paymentId: string;
  /** Detalle legible para el comprobante */
  detail: string;
  /** Marca temporal ISO de la acreditacion */
  processedAt: string;
}

export interface CheckoutPreference {
  preferenceId: string;
  initPoint: string;
}

const randomDigits = (length: number): string =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

/** Crea la preferencia de pago previa al Checkout Pro. */
export const createPreference = async (payload: PaymentPayload): Promise<CheckoutPreference> => {
  if (MODE === 'checkout-pro') {
    const response = await fetch('/api/mp/preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moduleId: payload.module.id,
        title: payload.module.title,
        unitPrice: payload.amountArs,
        payerEmail: payload.payerEmail,
        currencyId: 'ARS',
      }),
    });
    if (!response.ok) {
      throw new Error('No se pudo crear la preferencia de pago en Mercado Pago.');
    }
    const data = await response.json();
    return { preferenceId: data.id, initPoint: data.init_point };
  }

  const preferenceId = `PREF-${randomDigits(12)}`;
  return {
    preferenceId,
    initPoint: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`,
  };
};

/** Confirma el pago. En modo simulado acredita siempre, con demora realista. */
export const confirmPayment = async (payload: PaymentPayload): Promise<PaymentResult> => {
  const preference = await createPreference(payload);

  if (MODE === 'checkout-pro') {
    window.location.href = preference.initPoint;
    return {
      status: 'rejected',
      paymentId: preference.preferenceId,
      detail: 'Redirigiendo a Mercado Pago.',
      processedAt: new Date().toISOString(),
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 1100));

  const methodLabel: Record<PaymentMethod, string> = {
    mercadopago: 'Dinero en cuenta de Mercado Pago',
    card: payload.installments > 1
      ? `Tarjeta en ${payload.installments} cuotas sin interes`
      : 'Tarjeta en un pago',
    transfer: 'Transferencia bancaria inmediata',
  };

  return {
    status: 'approved',
    paymentId: `MP-${randomDigits(9)}`,
    detail: methodLabel[payload.method],
    processedAt: new Date().toISOString(),
  };
};

/** Indica si la plataforma corre contra credenciales reales. */
export const isSandbox = (): boolean => MODE === 'simulated' || PUBLIC_KEY === '';
