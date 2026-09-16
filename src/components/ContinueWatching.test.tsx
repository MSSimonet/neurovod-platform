import React from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderConPlataforma } from '../test/render';
import { ContinueWatching } from './ContinueWatching';
import { DemoPresentationToolbar } from './DemoPresentationToolbar';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

/** Estado inicial: la guía de sueño viene habilitada y empezada al 45%. */
const conClaseEmpezada = () =>
  localStorage.setItem(
    'neurovod_progress',
    JSON.stringify({ 'guia-sueno-ep1': { seconds: 720, percent: 45, completed: false } }),
  );

beforeEach(() => localStorage.clear());

describe('trayecto activo', () => {
  test('invita a retomar la clase empezada con su porcentaje', () => {
    conClaseEmpezada();

    renderConPlataforma(<ContinueWatching />);

    expect(screen.getByRole('region', { name: /continuar viendo/i })).toBeInTheDocument();
    expect(screen.getByText(/45% completado/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retomar la clase/i })).toBeInTheDocument();
  });

  test('calcula cuánto falta para terminar', () => {
    conClaseEmpezada();

    renderConPlataforma(<ContinueWatching />);

    expect(screen.getByText(/restan/i)).toBeInTheDocument();
  });

  test('ofrece abrir el programa completo', () => {
    conClaseEmpezada();

    renderConPlataforma(<ContinueWatching />);

    expect(screen.getByRole('button', { name: /ver el programa/i })).toBeInTheDocument();
  });

  test('no aparece si no hay ninguna clase a medio ver', () => {
    localStorage.setItem('neurovod_progress', JSON.stringify({}));

    renderConPlataforma(<ContinueWatching />);

    expect(screen.queryByRole('region', { name: /continuar viendo/i })).not.toBeInTheDocument();
  });

  test('no aparece cuando la clase ya se terminó', () => {
    localStorage.setItem(
      'neurovod_progress',
      JSON.stringify({ 'guia-sueno-ep1': { seconds: 1600, percent: 100, completed: true } }),
    );

    renderConPlataforma(<ContinueWatching />);

    expect(screen.queryByRole('region', { name: /continuar viendo/i })).not.toBeInTheDocument();
  });
});

describe('barra de demostración', () => {
  test('arranca plegada para no molestar', () => {
    renderConPlataforma(<DemoPresentationToolbar />);

    expect(screen.getByRole('button', { name: /modo demostración|demo/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /pasarela de pago/i })).not.toBeInTheDocument();
  });

  test('desplegada ofrece los atajos de la reunión', async () => {
    const { usuario } = renderConPlataforma(<DemoPresentationToolbar />);

    await usuario.click(screen.getByRole('button', { name: /modo demostración|demo/i }));

    expect(await screen.findByRole('button', { name: /pasarela de pago/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reproductor/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /panel médico/i })).toBeInTheDocument();
  });

  test('abrir todo habilita el catálogo completo', async () => {
    const { usuario } = renderConPlataforma(<DemoPresentationToolbar />);
    await usuario.click(screen.getByRole('button', { name: /modo demostración|demo/i }));

    await usuario.click(await screen.findByRole('button', { name: /abrir todo/i }));

    expect(await screen.findByText(/8\/8 habilitados/)).toBeInTheDocument();
  });

  test('bloquear vuelve al módulo de muestra', async () => {
    const { usuario } = renderConPlataforma(<DemoPresentationToolbar />);
    await usuario.click(screen.getByRole('button', { name: /modo demostración|demo/i }));
    await usuario.click(await screen.findByRole('button', { name: /abrir todo/i }));

    await usuario.click(screen.getByRole('button', { name: /bloquear/i }));

    expect(await screen.findByText(/1\/8 habilitados/)).toBeInTheDocument();
  });

  test('se puede volver a plegar', async () => {
    const { usuario } = renderConPlataforma(<DemoPresentationToolbar />);
    await usuario.click(screen.getByRole('button', { name: /modo demostración|demo/i }));

    await usuario.click(await screen.findByRole('button', { name: /minimizar los controles/i }));

    expect(screen.queryByRole('button', { name: /pasarela de pago/i })).not.toBeInTheDocument();
  });
});
