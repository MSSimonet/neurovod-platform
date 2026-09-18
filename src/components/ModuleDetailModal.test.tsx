import React, { useEffect } from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderConPlataforma } from '../test/render';
import { ModuleDetailModal } from './ModuleDetailModal';
import { usePlatform } from '../context/PlatformContext';
import { leadDoctor } from '../data/catalog';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const Ficha = ({ moduleId }: { moduleId: string }) => {
  const { modules, setActiveDetailModule } = usePlatform();
  useEffect(() => {
    const mod = modules.find((m) => m.id === moduleId);
    if (mod) setActiveDetailModule(mod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <ModuleDetailModal />;
};

const BLOQUEADO = 'tdah-infancia-integral';
const HABILITADO = 'guia-sueno-neurodivergente';

beforeEach(() => localStorage.clear());

describe('ficha de un módulo bloqueado', () => {
  test('presenta título, condición y edad sugerida', async () => {
    renderConPlataforma(<Ficha moduleId={BLOQUEADO} />);

    const dialogo = await screen.findByRole('dialog');
    expect(dialogo).toHaveTextContent(/manejo integral del tdah/i);
    expect(within(dialogo).getByText('TDAH')).toBeInTheDocument();
    expect(dialogo).toHaveTextContent(/escolar/i);
  });

  test('muestra el precio y ofrece desbloquear', async () => {
    renderConPlataforma(<Ficha moduleId={BLOQUEADO} />);

    const dialogo = await screen.findByRole('dialog');
    expect(within(dialogo).getByText(/\$\s?50\.000/)).toBeInTheDocument();
    expect(within(dialogo).getByText(/pago único/i)).toBeInTheDocument();
    expect(within(dialogo).getByRole('button', { name: /desbloquear módulo/i })).toBeInTheDocument();
  });

  test('lista el índice de clases con su duración', async () => {
    renderConPlataforma(<Ficha moduleId={BLOQUEADO} />);

    const dialogo = await screen.findByRole('dialog');
    expect(within(dialogo).getByText(/índice de clases/i)).toBeInTheDocument();
    expect(within(dialogo).getAllByRole('listitem').length).toBeGreaterThan(0);
    expect(within(dialogo).getAllByText(/\d+ MIN/).length).toBeGreaterThan(0);
  });

  test('el material descargable aparece bloqueado', async () => {
    renderConPlataforma(<Ficha moduleId={BLOQUEADO} />);

    const dialogo = await screen.findByRole('dialog');
    expect(within(dialogo).getAllByText(/BLOQUEADO/).length).toBeGreaterThan(0);
    expect(within(dialogo).queryByRole('link', { name: /descargar/i })).not.toBeInTheDocument();
  });

  test('identifica al profesional con su matrícula', async () => {
    renderConPlataforma(<Ficha moduleId={BLOQUEADO} />);

    const dialogo = await screen.findByRole('dialog');
    expect(within(dialogo).getByText(new RegExp(leadDoctor.name))).toBeInTheDocument();
    expect(within(dialogo).getByText(new RegExp(leadDoctor.licenses[0]))).toBeInTheDocument();
  });

  test('enumera qué resuelve el programa', async () => {
    renderConPlataforma(<Ficha moduleId={BLOQUEADO} />);

    const dialogo = await screen.findByRole('dialog');
    expect(within(dialogo).getByText(/qué resuelve/i)).toBeInTheDocument();
  });
});

describe('ficha de un módulo habilitado', () => {
  test('confirma el acceso y ofrece ver la primera clase', async () => {
    renderConPlataforma(<Ficha moduleId={HABILITADO} />);

    const dialogo = await screen.findByRole('dialog');
    expect(within(dialogo).getByText(/acceso habilitado/i)).toBeInTheDocument();
    expect(within(dialogo).getByRole('button', { name: /ver primera clase/i })).toBeInTheDocument();
  });

  test('el material se puede descargar', async () => {
    renderConPlataforma(<Ficha moduleId={HABILITADO} />);

    const dialogo = await screen.findByRole('dialog');
    const descargas = within(dialogo).queryAllByRole('link', { name: /descargar/i });
    expect(descargas.length).toBeGreaterThan(0);
  });

  test('no insiste con el precio de un módulo ya comprado', async () => {
    renderConPlataforma(<Ficha moduleId={HABILITADO} />);

    const dialogo = await screen.findByRole('dialog');
    expect(within(dialogo).queryByText(/\$\s?15\.000/)).not.toBeInTheDocument();
  });
});

describe('cierre de la ficha', () => {
  test('se puede cerrar con el botón', async () => {
    const { usuario } = renderConPlataforma(<Ficha moduleId={BLOQUEADO} />);
    await screen.findByRole('dialog');

    await usuario.click(screen.getByRole('button', { name: /cerrar ventana/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
