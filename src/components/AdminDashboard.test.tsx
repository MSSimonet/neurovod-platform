import React from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { screen, within, waitFor } from '@testing-library/react';
import { renderConPlataforma } from '../test/render';
import { AdminDashboard } from './AdminDashboard';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

beforeEach(() => {
  window.history.replaceState({}, '', '/#/admin');
  localStorage.clear();
});

const abrirPestana = async (
  usuario: ReturnType<typeof renderConPlataforma>['usuario'],
  nombre: RegExp,
) => {
  const secciones = screen.getByRole('navigation', { name: /secciones del panel/i });
  await usuario.click(within(secciones).getByRole('button', { name: nombre }));
};

describe('encabezado e indicadores', () => {
  test('identifica al profesional a cargo', () => {
    renderConPlataforma(<AdminDashboard />);

    expect(screen.getByText(/panel médico/i)).toBeInTheDocument();
    expect(screen.getByText(/Julián Rossi/)).toBeInTheDocument();
  });

  test('resume facturación, operaciones y contenido publicado', () => {
    renderConPlataforma(<AdminDashboard />);

    expect(screen.getByText(/facturado en ars/i)).toBeInTheDocument();
    expect(screen.getByText(/operaciones/i)).toBeInTheDocument();
    expect(screen.getAllByText(/programas publicados/i).length).toBeGreaterThan(0);
  });

  test('las becas no engordan la facturación', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);
    const facturadoAntes = screen.getByText(/facturado en ars/i).nextElementSibling?.textContent;

    await abrirPestana(usuario, /ventas y accesos/i);
    await usuario.type(screen.getByLabelText(/correo del paciente/i), 'beca@escuela.edu.ar');
    await usuario.click(screen.getByRole('button', { name: /otorgar el acceso/i }));

    await screen.findByRole('status');
    expect(screen.getByText(/facturado en ars/i).nextElementSibling?.textContent).toBe(
      facturadoAntes,
    );
  });
});

describe('catálogo y precios', () => {
  test('lista los programas con su condición clínica', () => {
    renderConPlataforma(<AdminDashboard />);

    const tabla = screen.getAllByRole('table')[0];
    expect(within(tabla).getByText(/manejo integral del tdah/i)).toBeInTheDocument();
  });

  test('cambiar el precio de un programa lo confirma', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);

    const campo = screen.getByLabelText(/precio de manejo integral del tdah/i);
    await usuario.clear(campo);
    await usuario.type(campo, '61000');
    await usuario.tab();

    expect(await screen.findByRole('status')).toHaveTextContent(/precio actualizado/i);
  });

  test('publicar un programa nuevo lo agrega al catálogo', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);

    await usuario.type(screen.getByLabelText(/título del programa/i), 'Rutinas de la mañana');
    await usuario.type(screen.getByLabelText(/resumen de dos líneas/i), 'Cómo sostener la secuencia');
    await usuario.click(screen.getByRole('button', { name: /publicar programa/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/publicado en el catálogo/i);
    const tabla = screen.getAllByRole('table')[0];
    expect(within(tabla).getByText('Rutinas de la mañana')).toBeInTheDocument();
  });

  test('editar un programa carga sus datos en el formulario', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);

    await usuario.click(screen.getByRole('button', { name: /editar manejo integral del tdah/i }));

    expect(await screen.findByDisplayValue(/manejo integral del tdah/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar edición/i })).toBeInTheDocument();
  });

  test('cancelar la edición vuelve al alta de un programa nuevo', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);
    await usuario.click(screen.getByRole('button', { name: /editar manejo integral del tdah/i }));

    await usuario.click(await screen.findByRole('button', { name: /cancelar edición/i }));

    expect(screen.getByRole('button', { name: /publicar programa/i })).toBeInTheDocument();
  });

  test('eliminar un programa lo quita de la tabla', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);

    await usuario.click(screen.getByRole('button', { name: /eliminar manejo integral del tdah/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/retirado del catálogo/i);
    await waitFor(() =>
      expect(
        screen.queryByLabelText(/precio de manejo integral del tdah/i),
      ).not.toBeInTheDocument(),
    );
  });

  test('actualiza el honorario de referencia de la consulta presencial', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);

    const campo = screen.getByLabelText(/honorario de consulta presencial/i);
    await usuario.clear(campo);
    await usuario.type(campo, '72000');
    await usuario.click(screen.getByRole('button', { name: /^guardar$/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/honorario actualizado/i);
  });
});

describe('clases y material', () => {
  test('lista la playlist del programa elegido', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);

    await abrirPestana(usuario, /clases y material/i);

    expect(await screen.findByText(/playlist del programa/i)).toBeInTheDocument();
    expect(screen.getByText(/05 CLASES/)).toBeInTheDocument();
  });

  test('publicar una clase nueva la suma a la playlist', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);
    await abrirPestana(usuario, /clases y material/i);

    await usuario.type(await screen.findByLabelText(/título de la clase/i), 'La cena familiar');
    await usuario.click(screen.getByRole('button', { name: /publicar la clase/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/clase agregada/i);
    expect(screen.getByText(/06 CLASES/)).toBeInTheDocument();
  });

  test('no se puede subir la primera clase de la lista', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);
    await abrirPestana(usuario, /clases y material/i);

    const subir = await screen.findAllByRole('button', { name: /subir la clase/i });
    expect(subir[0]).toBeDisabled();
  });

  test('eliminar una clase lo confirma', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);
    await abrirPestana(usuario, /clases y material/i);

    const borrar = await screen.findAllByRole('button', { name: /eliminar la clase/i });
    await usuario.click(borrar[0]);

    expect(await screen.findByRole('status')).toHaveTextContent(/clase eliminada/i);
  });

  test('vincular un PDF lo confirma', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);
    await abrirPestana(usuario, /clases y material/i);

    await usuario.type(
      await screen.findByLabelText(/nombre del documento/i),
      'Guía de adecuaciones escolares',
    );
    await usuario.click(screen.getByRole('button', { name: /vincular el documento/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/material vinculado/i);
  });

  test('el origen del video de cada clase es editable', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);
    await abrirPestana(usuario, /clases y material/i);

    const origen = await screen.findByLabelText(/origen del video de la clase 1/i);
    await usuario.clear(origen);
    await usuario.type(origen, 'https://cdn.neurovod.med.ar/clase.m3u8');

    expect(origen).toHaveValue('https://cdn.neurovod.med.ar/clase.m3u8');
  });
});

describe('ventas y accesos', () => {
  test('muestra el historial con comprobante, titular y monto', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);

    await abrirPestana(usuario, /ventas y accesos/i);

    expect(await screen.findByText(/historial de operaciones/i)).toBeInTheDocument();
    expect(screen.getByText('lucia.ferrer@gmail.com')).toBeInTheDocument();
  });

  test('otorgar una beca la registra y habilita el acceso', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);
    await abrirPestana(usuario, /ventas y accesos/i);

    await usuario.type(screen.getByLabelText(/correo del paciente/i), 'equipo@escuela.edu.ar');
    await usuario.click(screen.getByRole('button', { name: /otorgar el acceso/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/registrado como beca/i);
    expect(screen.getByText('equipo@escuela.edu.ar')).toBeInTheDocument();
  });

  test('dar de baja un acceso lo retira de la lista', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);
    await abrirPestana(usuario, /ventas y accesos/i);

    const baja = await screen.findAllByRole('button', { name: /dar de baja/i });
    await usuario.click(baja[0]);

    expect(await screen.findByRole('status')).toHaveTextContent(/acceso dado de baja/i);
  });
});

describe('vuelta al sitio público', () => {
  test('el botón de regreso lleva a la portada', async () => {
    const { usuario } = renderConPlataforma(<AdminDashboard />);

    await usuario.click(screen.getByRole('button', { name: /volver al sitio/i }));

    await waitFor(() => expect(window.location.hash).toBe(''));
  });
});
