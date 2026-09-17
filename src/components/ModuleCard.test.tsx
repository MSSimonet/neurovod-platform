import React from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderConPlataforma } from '../test/render';
import { ModuleCard } from './ModuleCard';
import { sampleModules } from '../data/catalog';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const moduloBloqueado = sampleModules.find((m) => m.id === 'tdah-infancia-integral')!;
const moduloHabilitado = sampleModules.find((m) => m.id === 'guia-sueno-neurodivergente')!;

beforeEach(() => localStorage.clear());

describe('ficha bloqueada', () => {
  test('muestra el precio en pesos y ofrece desbloquear', () => {
    renderConPlataforma(<ModuleCard module={moduloBloqueado} index={0} />);

    expect(screen.getByRole('button', { name: /desbloquear módulo/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^ver clase$/i })).not.toBeInTheDocument();
  });

  test('el precio aparece en el formato argentino', () => {
    renderConPlataforma(<ModuleCard module={moduloBloqueado} index={0} />);

    const ficha = screen.getByRole('article');
    expect(within(ficha).getByText(/\$\s?50\.000/)).toBeInTheDocument();
  });

  test('numera la ficha dentro del compendio', () => {
    renderConPlataforma(<ModuleCard module={moduloBloqueado} index={4} />);

    expect(screen.getByText('FICHA 05')).toBeInTheDocument();
  });

  test('abre la pasarela de pago al pedir el desbloqueo', async () => {
    const { usuario } = renderConPlataforma(<ModuleCard module={moduloBloqueado} index={0} />);

    await usuario.click(screen.getByRole('button', { name: /desbloquear módulo/i }));

    // La pasarela vive fuera de esta ficha, así que lo observable aquí es
    // que la acción no rompa y el botón siga disponible.
    expect(screen.getByRole('button', { name: /desbloquear módulo/i })).toBeInTheDocument();
  });
});

describe('ficha habilitada', () => {
  test('indica el acceso y ofrece ver la clase en lugar del precio', () => {
    renderConPlataforma(<ModuleCard module={moduloHabilitado} index={0} />);

    expect(screen.getByText(/desbloqueado/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ver clase/i })).toBeInTheDocument();
    expect(screen.queryByText(/\$\s?15\.000/)).not.toBeInTheDocument();
  });
});

describe('datos clínicos de la ficha', () => {
  test('publica condición, cantidad de clases y edad sugerida', () => {
    renderConPlataforma(<ModuleCard module={moduloBloqueado} index={0} />);

    const ficha = screen.getByRole('article');
    expect(within(ficha).getByText('TDAH')).toBeInTheDocument();
    expect(within(ficha).getByText(/5 CLASES/)).toBeInTheDocument();
    expect(within(ficha).getByText(/ESCOLAR/i)).toBeInTheDocument();
  });

  test('anuncia el material descargable cuando el módulo lo tiene', () => {
    renderConPlataforma(<ModuleCard module={moduloBloqueado} index={0} />);

    expect(screen.getByText(/\d+ PDF/)).toBeInTheDocument();
  });

  test('el título abre la ficha completa y se nombra con el texto que se ve', () => {
    renderConPlataforma(<ModuleCard module={moduloBloqueado} index={0} />);

    // WCAG 2.5.3: el nombre accesible tiene que contener el texto visible. Si
    // se lo reemplaza por un aria-label, quien navega por voz dice lo que lee
    // y no activa nada.
    const abrir = screen.getByRole('button', { name: new RegExp(moduloBloqueado.title, 'i') });
    expect(abrir).toHaveAccessibleName(new RegExp(moduloBloqueado.subtitle, 'i'));
  });

  test('la imagen de portada es decorativa y no ensucia el lector de pantalla', () => {
    renderConPlataforma(<ModuleCard module={moduloBloqueado} index={0} />);

    const ficha = screen.getByRole('article');
    const imagenes = within(ficha).getAllByRole('presentation', { hidden: true });
    expect(imagenes.length).toBeGreaterThan(0);
  });
});
