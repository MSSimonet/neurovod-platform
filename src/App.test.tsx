import React from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { screen, within, waitFor } from '@testing-library/react';
import { renderConPlataforma } from './test/render';
import App from './App';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  localStorage.clear();
});

describe('portada del compendio', () => {
  test('presenta el titular editorial y la credencial del profesional', () => {
    renderConPlataforma(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/lo que explico en consulta/i);
    expect(screen.getAllByText(/MN 142\.890/).length).toBeGreaterThan(0);
  });

  test('cuenta los programas y las clases disponibles', () => {
    renderConPlataforma(<App />);

    // Los indicadores van en una sola línea de filete bajo el buscador.
    const indicadores = screen.getByText(/\d+ programas · \d+ clases/i);
    expect(indicadores).toBeInTheDocument();
    expect(indicadores).toHaveTextContent(/h de material/i);
    expect(indicadores).toHaveTextContent(/años de consultorio/i);
  });

  test('ordena el catálogo en secciones clínicas numeradas', () => {
    renderConPlataforma(<App />);

    expect(screen.getAllByRole('heading', { name: /manejo integral del tdah/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /autismo \(tea\) y regulación/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /guías rápidas/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /congresos y neurodesarrollo/i })).toBeInTheDocument();
  });

  test('ofrece la brújula de consulta rápida por situación', () => {
    renderConPlataforma(<App />);

    expect(screen.getByRole('heading', { name: /qué está pasando en tu casa/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mi hijo colapsa/i })).toBeInTheDocument();
  });

  test('publica la bibliografía que respalda el contenido', () => {
    renderConPlataforma(<App />);

    expect(screen.getAllByText(/DSM-5-TR/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sociedad Argentina de Pediatría/).length).toBeGreaterThan(0);
  });

  test('incluye el aviso de que no sustituye la consulta médica', () => {
    renderConPlataforma(<App />);

    expect(screen.getByText(/sustituye la consulta médica individual/i)).toBeInTheDocument();
  });

  test('muestra la biblioteca del usuario cuando tiene accesos', () => {
    renderConPlataforma(<App />);

    expect(
      screen.getByRole('heading', { name: /módulos con acceso habilitado/i }),
    ).toBeInTheDocument();
  });
});

describe('búsqueda en el catálogo', () => {
  test('filtra por síntoma y anuncia cuántos programas coinciden', async () => {
    const { usuario } = renderConPlataforma(<App />);

    await usuario.type(screen.getByLabelText(/buscar por síntoma/i), 'sueño');
    await usuario.click(screen.getByRole('button', { name: /buscar en el catálogo/i }));

    const titulo = await screen.findByRole('heading', { level: 1 });
    expect(titulo).toHaveTextContent(/programas? para tu búsqueda/i);
  });

  test('explica el resultado vacío en lugar de dejar la pantalla en blanco', async () => {
    const { usuario } = renderConPlataforma(<App />);

    await usuario.type(screen.getByLabelText(/buscar por síntoma/i), 'dermatología');
    await usuario.click(screen.getByRole('button', { name: /buscar en el catálogo/i }));

    expect(await screen.findByRole('heading', { name: /sin coincidencias/i })).toBeInTheDocument();
    expect(screen.getByText(/probá con otra condición clínica/i)).toBeInTheDocument();
  });

  test('permite volver al catálogo completo desde el resultado vacío', async () => {
    const { usuario } = renderConPlataforma(<App />);
    await usuario.type(screen.getByLabelText(/buscar por síntoma/i), 'dermatología');
    await usuario.click(screen.getByRole('button', { name: /buscar en el catálogo/i }));
    await screen.findByRole('heading', { name: /sin coincidencias/i });

    await usuario.click(screen.getByRole('button', { name: /limpiar los filtros/i }));

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      /lo que explico en consulta/i,
    );
  });
});

describe('navegación por condición clínica', () => {
  test('elegir TDAH deja solo los programas de esa condición', async () => {
    const { usuario } = renderConPlataforma(<App />);
    const barra = screen.getByRole('navigation', { name: /condiciones clínicas/i });

    await usuario.click(within(barra).getByRole('button', { name: 'TDAH' }));

    const titulo = await screen.findByRole('heading', { level: 1 });
    expect(titulo).toHaveTextContent(/3 programas/i);
  });

  test('la barra de secciones marca cuál está activa', async () => {
    const { usuario } = renderConPlataforma(<App />);
    const barra = screen.getByRole('navigation', { name: /condiciones clínicas/i });

    await usuario.click(within(barra).getByRole('button', { name: 'Sensorial' }));

    await waitFor(() =>
      expect(within(barra).getByRole('button', { name: 'Sensorial' })).toHaveAttribute(
        'aria-current',
        'true',
      ),
    );
  });
});

describe('panel de filtros', () => {
  test('se abre desde la barra superior y ofrece las cuatro clasificaciones', async () => {
    const { usuario } = renderConPlataforma(<App />);

    await usuario.click(screen.getByRole('button', { name: /filtros del catálogo/i }));

    const panel = await screen.findByRole('region', { name: /filtros del catálogo/i });
    expect(within(panel).getByText(/condición clínica/i)).toBeInTheDocument();
    expect(within(panel).getByText(/formato/i)).toBeInTheDocument();
    expect(within(panel).getByText(/edad del paciente/i)).toBeInTheDocument();
    expect(within(panel).getByText(/año de edición/i)).toBeInTheDocument();
  });

  test('filtrar por formato reduce el catálogo', async () => {
    const { usuario } = renderConPlataforma(<App />);
    await usuario.click(screen.getByRole('button', { name: /filtros del catálogo/i }));
    const panel = await screen.findByRole('region', { name: /filtros del catálogo/i });

    await usuario.click(within(panel).getByRole('button', { name: /guía intensiva/i }));

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/1 programa/i);
  });

  test('se puede cerrar el panel', async () => {
    const { usuario } = renderConPlataforma(<App />);
    await usuario.click(screen.getByRole('button', { name: /filtros del catálogo/i }));
    const panel = await screen.findByRole('region', { name: /filtros del catálogo/i });

    await usuario.click(within(panel).getByRole('button', { name: /cerrar filtros/i }));

    await waitFor(() =>
      expect(screen.queryByRole('region', { name: /filtros del catálogo/i })).not.toBeInTheDocument(),
    );
  });
});

describe('ruteo hacia el panel del profesional', () => {
  test('la portada no expone el acceso administrativo', () => {
    renderConPlataforma(<App />);

    const barra = screen.getByRole('navigation', { name: /condiciones clínicas/i });
    const cabecera = barra.closest('header')!;
    expect(within(cabecera).queryByRole('button', { name: /panel médico/i })).not.toBeInTheDocument();
  });

  test('entrar por el hash del panel muestra la vista administrativa', async () => {
    window.history.replaceState({}, '', '/#/admin');

    renderConPlataforma(<App />);

    // El panel viaja en su propio paquete: aparece recién cuando termina de bajar.
    expect(await screen.findByText(/panel médico/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /volver al sitio/i })).toBeInTheDocument();
  });
});

describe('brújula de consulta rápida', () => {
  test('abre la ficha del abordaje que corresponde a la situación', async () => {
    const { usuario } = renderConPlataforma(<App />);

    await usuario.click(screen.getByRole('button', { name: /todas las noches son una batalla/i }));

    const ficha = await screen.findByRole('dialog');
    expect(ficha).toHaveTextContent(/higiene del sueño/i);
  });
});
