import React from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { screen, within, waitFor } from '@testing-library/react';
import { renderConPlataforma } from '../test/render';
import App from '../App';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  localStorage.clear();
});

const abrirBarraDemo = async (usuario: ReturnType<typeof renderConPlataforma>['usuario']) => {
  const controles = screen.getByRole('complementary', { name: /controles de demostración/i });
  await usuario.click(within(controles).getByRole('button'));
  return controles;
};

describe('atajos de la barra de demostración', () => {
  test('el atajo de ingreso abre la ventana de sesión', async () => {
    const { usuario } = renderConPlataforma(<App />);
    const controles = await abrirBarraDemo(usuario);

    await usuario.click(within(controles).getByRole('button', { name: /ingreso/i }));

    expect(await screen.findByRole('dialog')).toHaveTextContent(/sesión activa/i);
  });

  test('el atajo de ficha abre la ficha del programa destacado', async () => {
    const { usuario } = renderConPlataforma(<App />);
    const controles = await abrirBarraDemo(usuario);

    await usuario.click(within(controles).getByRole('button', { name: /ficha del módulo/i }));

    expect(await screen.findByRole('dialog')).toHaveTextContent(/índice de clases/i);
  });

  test('el atajo de pagos abre la pasarela', async () => {
    const { usuario } = renderConPlataforma(<App />);
    const controles = await abrirBarraDemo(usuario);

    await usuario.click(within(controles).getByRole('button', { name: /pasarela de pago/i }));

    expect(await screen.findByRole('dialog')).toHaveTextContent(/desbloquear el módulo/i);
  });

  test('el atajo de reproductor abre la clase', async () => {
    const { usuario } = renderConPlataforma(<App />);
    const controles = await abrirBarraDemo(usuario);

    await usuario.click(within(controles).getByRole('button', { name: /reproductor/i }));

    expect(await screen.findByRole('button', { name: /cerrar el reproductor/i })).toBeInTheDocument();
  });

  test('el atajo del panel lleva a la vista administrativa', async () => {
    const { usuario } = renderConPlataforma(<App />);
    const controles = await abrirBarraDemo(usuario);

    await usuario.click(within(controles).getByRole('button', { name: /panel médico/i }));

    expect(await screen.findByRole('button', { name: /volver al sitio/i })).toBeInTheDocument();
  });
});

describe('buscador de la barra superior', () => {
  test('filtra con cada tecla sin perder el campo', async () => {
    const { usuario } = renderConPlataforma(<App />);

    const buscador = screen.getByLabelText(/buscar en el catálogo clínico/i);
    await usuario.type(buscador, 'sueño');

    expect(buscador).toHaveValue('sueño');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/para tu búsqueda/i);
  });

  test('el botón de limpiar vacía la búsqueda', async () => {
    const { usuario } = renderConPlataforma(<App />);
    const buscador = screen.getByLabelText(/buscar en el catálogo clínico/i);
    await usuario.type(buscador, 'sueño');

    await usuario.click(await screen.findByRole('button', { name: /limpiar búsqueda/i }));

    expect(buscador).toHaveValue('');
  });

  test('mi biblioteca vuelve al catálogo completo', async () => {
    const { usuario } = renderConPlataforma(<App />);
    const barra = screen.getByRole('navigation', { name: /condiciones clínicas/i });
    await usuario.click(within(barra).getByRole('button', { name: 'TDAH' }));
    await screen.findByRole('heading', { level: 1 });

    await usuario.click(screen.getByRole('button', { name: /mi biblioteca/i }));

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/lo que explico/i),
    );
  });

  test('el logotipo devuelve a la portada', async () => {
    const { usuario } = renderConPlataforma(<App />);

    await usuario.click(screen.getByRole('button', { name: /neurovod/i }));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/lo que explico/i);
  });
});

describe('panel de filtros', () => {
  test('el buscador del panel filtra el catálogo', async () => {
    const { usuario } = renderConPlataforma(<App />);
    await usuario.click(screen.getByRole('button', { name: /filtros del catálogo/i }));
    const panel = await screen.findByRole('region', { name: /filtros del catálogo/i });

    await usuario.type(within(panel).getByLabelText(/síntoma o tema/i), 'sueño');

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/para tu búsqueda/i);
  });

  test('el buscador del panel se vacía con su propio botón', async () => {
    const { usuario } = renderConPlataforma(<App />);
    await usuario.click(screen.getByRole('button', { name: /filtros del catálogo/i }));
    const panel = await screen.findByRole('region', { name: /filtros del catálogo/i });
    const campo = within(panel).getByLabelText(/síntoma o tema/i);
    await usuario.type(campo, 'sueño');

    await usuario.click(await within(panel).findByRole('button', { name: /borrar lo buscado/i }));

    expect(campo).toHaveValue('');
  });

  test('el buscador del panel y el de la barra superior comparten lo escrito', async () => {
    const { usuario } = renderConPlataforma(<App />);
    await usuario.type(screen.getByLabelText(/buscar en el catálogo clínico/i), 'sueño');

    await usuario.click(screen.getByRole('button', { name: /filtros del catálogo/i }));
    const panel = await screen.findByRole('region', { name: /filtros del catálogo/i });

    expect(within(panel).getByLabelText(/síntoma o tema/i)).toHaveValue('sueño');
  });

  test('el botón de limpiar aparece al filtrar y restablece todo', async () => {
    const { usuario } = renderConPlataforma(<App />);
    await usuario.click(screen.getByRole('button', { name: /filtros del catálogo/i }));
    const panel = await screen.findByRole('region', { name: /filtros del catálogo/i });
    await usuario.click(within(panel).getByRole('button', { name: /^tdah$/i }));

    await usuario.click(await within(panel).findByRole('button', { name: /limpiar/i }));

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/lo que explico/i),
    );
  });

  test('filtrar por año de edición acota el catálogo', async () => {
    const { usuario } = renderConPlataforma(<App />);
    await usuario.click(screen.getByRole('button', { name: /filtros del catálogo/i }));
    const panel = await screen.findByRole('region', { name: /filtros del catálogo/i });

    await usuario.click(within(panel).getByRole('button', { name: '2024' }));

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/programa/i);
  });

  test('filtrar por edad del paciente acota el catálogo', async () => {
    const { usuario } = renderConPlataforma(<App />);
    await usuario.click(screen.getByRole('button', { name: /filtros del catálogo/i }));
    const panel = await screen.findByRole('region', { name: /filtros del catálogo/i });

    await usuario.click(within(panel).getByRole('button', { name: /preescolar/i }));

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/programa/i);
  });
});

describe('compra desde la ficha del catálogo', () => {
  test('desbloquear abre la pasarela y tras pagar se puede ver la clase', async () => {
    const { usuario } = renderConPlataforma(<App />);

    const fichas = screen.getAllByRole('button', { name: /desbloquear módulo/i });
    await usuario.click(fichas[0]);
    const pasarela = await screen.findByRole('dialog');

    await usuario.click(within(pasarela).getByRole('button', { name: /pagar/i }));
    await screen.findByText(/pago acreditado/i, {}, { timeout: 5000 });
    await usuario.click(screen.getByRole('button', { name: /ver la primera clase/i }));

    expect(await screen.findByRole('button', { name: /cerrar el reproductor/i })).toBeInTheDocument();
  });

  test('la transferencia permite copiar el alias', async () => {
    // userEvent.setup() instala su propio portapapeles, así que se lee de ahí.
    const { usuario } = renderConPlataforma(<App />);

    const fichas = screen.getAllByRole('button', { name: /desbloquear módulo/i });
    await usuario.click(fichas[0]);
    const pasarela = await screen.findByRole('dialog');
    await usuario.click(within(pasarela).getByRole('radio', { name: /transferencia/i }));

    await usuario.click(await within(pasarela).findByRole('button', { name: /copiar alias/i }));

    expect(await screen.findByRole('button', { name: /copiado/i })).toBeInTheDocument();
    await expect(navigator.clipboard.readText()).resolves.toBe('NEURO.DESARROLLO.MP');
  });

  test('se puede cerrar la pasarela sin comprar', async () => {
    const { usuario } = renderConPlataforma(<App />);
    const fichas = screen.getAllByRole('button', { name: /desbloquear módulo/i });
    await usuario.click(fichas[0]);
    await screen.findByRole('dialog');

    await usuario.click(screen.getByRole('button', { name: /cerrar ventana/i }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
