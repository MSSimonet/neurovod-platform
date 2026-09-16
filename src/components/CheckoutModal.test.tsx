import React, { useEffect } from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderConPlataforma } from '../test/render';
import { CheckoutModal } from './CheckoutModal';
import { usePlatform } from '../context/PlatformContext';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

/** Abre la pasarela sobre un módulo y expone el estado para comprobarlo. */
const Banco = ({ moduleId, onEstado }: { moduleId: string; onEstado?: (e: unknown) => void }) => {
  const plataforma = usePlatform();
  const { modules, setActiveCheckoutModule } = plataforma;

  useEffect(() => {
    const mod = modules.find((m) => m.id === moduleId);
    if (mod) setActiveCheckoutModule(mod);
    // Solo al montar: reabrirlo en cada render impediría cerrarlo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onEstado?.({
      comprados: plataforma.purchasedModuleIds,
      ventas: plataforma.sales,
    });
  });

  return <CheckoutModal />;
};

const abrirPasarela = (moduleId = 'tdah-infancia-integral') => {
  const estado: { comprados: string[]; ventas: { amountArs: number; kind: string }[] } = {
    comprados: [],
    ventas: [],
  };
  const utilidades = renderConPlataforma(
    <Banco moduleId={moduleId} onEstado={(e) => Object.assign(estado, e)} />,
  );
  return { ...utilidades, estado };
};

beforeEach(() => localStorage.clear());

describe('presentación del importe', () => {
  test('muestra el total en pesos argentinos', async () => {
    abrirPasarela();

    const dialogo = await screen.findByRole('dialog');
    expect(dialogo).toHaveTextContent(/\$\s?50\.000\s*ARS/);
  });

  test('anuncia que es un pago único con acceso permanente', async () => {
    abrirPasarela();

    const menciones = await screen.findAllByText(/acceso permanente/i);
    expect(menciones.length).toBeGreaterThan(0);
  });

  test('compara contra el honorario de la consulta presencial', async () => {
    abrirPasarela();

    expect(await screen.findByText(/consulta presencial/i)).toBeInTheDocument();
  });

  test('avisa que el entorno no procesa operaciones reales', async () => {
    abrirPasarela();

    expect(await screen.findByText(/entorno de prueba/i)).toBeInTheDocument();
  });
});

describe('cupones de descuento', () => {
  test('un cupón válido baja el total', async () => {
    const { usuario } = abrirPasarela();
    await screen.findByRole('dialog');

    await usuario.type(screen.getByLabelText(/cupón de descuento/i), 'DOCTOR2026');
    await usuario.click(screen.getByRole('button', { name: /aplicar/i }));

    expect(await screen.findByText(/descuento del 15%/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pagar/i })).toHaveTextContent(/42\.500/);
  });

  test('un cupón inexistente deja el precio igual y lo explica', async () => {
    const { usuario } = abrirPasarela();
    await screen.findByRole('dialog');

    await usuario.type(screen.getByLabelText(/cupón de descuento/i), 'NOEXISTE');
    await usuario.click(screen.getByRole('button', { name: /aplicar/i }));

    expect(await screen.findByText(/no está vigente/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pagar/i })).toHaveTextContent(/50\.000/);
  });
});

describe('medios de pago', () => {
  test('arranca en Mercado Pago y ofrece el código de pago', async () => {
    abrirPasarela();
    await screen.findByRole('dialog');

    expect(screen.getByRole('radio', { name: /mercado pago/i })).toBeChecked();
    expect(screen.getByAltText(/código qr/i)).toBeInTheDocument();
  });

  test('elegir tarjeta pide los datos y el plan de cuotas', async () => {
    const { usuario } = abrirPasarela();
    await screen.findByRole('dialog');

    await usuario.click(screen.getByRole('radio', { name: /^tarjeta/i }));

    expect(await screen.findByLabelText(/número de tarjeta/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /cuotas/i })).toBeInTheDocument();
  });

  test('elegir transferencia muestra el alias para copiar', async () => {
    const { usuario } = abrirPasarela();
    await screen.findByRole('dialog');

    await usuario.click(screen.getByRole('radio', { name: /transferencia/i }));

    expect(await screen.findByText('NEURO.DESARROLLO.MP')).toBeInTheDocument();
  });
});

describe('facturación', () => {
  test('la factura A pide el CUIT para el reintegro', async () => {
    const { usuario } = abrirPasarela();
    await screen.findByRole('dialog');

    await usuario.selectOptions(screen.getByLabelText(/tipo de factura/i), 'A');

    expect(await screen.findByLabelText(/cuit/i)).toBeInTheDocument();
  });

  test('la factura B de consumidor final no pide CUIT', async () => {
    abrirPasarela();
    await screen.findByRole('dialog');

    expect(screen.queryByLabelText(/cuit/i)).not.toBeInTheDocument();
  });
});

describe('confirmación de la compra', () => {
  test('acredita el pago, habilita el módulo y emite comprobante', async () => {
    const { usuario, estado } = abrirPasarela();
    await screen.findByRole('dialog');

    const correo = screen.getByLabelText(/correo/i);
    await usuario.clear(correo);
    await usuario.type(correo, 'familia@ejemplo.com');
    await usuario.click(screen.getByRole('button', { name: /pagar/i }));

    expect(await screen.findByText(/pago acreditado/i, {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.getByText(/ya tenés acceso al módulo/i)).toBeInTheDocument();

    await waitFor(() => expect(estado.comprados).toContain('tdah-infancia-integral'));
    expect(estado.ventas[0].amountArs).toBe(50000);
    expect(estado.ventas[0].kind).toBe('pago');
  });

  test('el comprobante identifica al profesional con su matrícula', async () => {
    const { usuario } = abrirPasarela();
    await screen.findByRole('dialog');

    await usuario.click(screen.getByRole('button', { name: /pagar/i }));

    const comprobante = await screen.findByText(/MN 142\.890/, {}, { timeout: 5000 });
    expect(comprobante).toBeInTheDocument();
  });

  test('el descuento aplicado queda registrado en la venta', async () => {
    const { usuario, estado } = abrirPasarela();
    await screen.findByRole('dialog');

    await usuario.type(screen.getByLabelText(/cupón de descuento/i), 'LANZAMIENTO');
    await usuario.click(screen.getByRole('button', { name: /aplicar/i }));
    await usuario.click(screen.getByRole('button', { name: /pagar/i }));

    await screen.findByText(/pago acreditado/i, {}, { timeout: 5000 });
    await waitFor(() => expect(estado.ventas[0].amountArs).toBe(42500));
  });

  test('deshabilita el botón mientras confirma para evitar el doble cobro', async () => {
    const { usuario } = abrirPasarela();
    await screen.findByRole('dialog');

    const pagar = screen.getByRole('button', { name: /pagar/i });
    await usuario.click(pagar);

    expect(screen.getByRole('button', { name: /confirmando/i })).toBeDisabled();
  });
});
