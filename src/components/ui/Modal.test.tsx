import React, { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

/** Modal con un campo controlado, como los de la pasarela y el ingreso. */
const ModalConFormulario = ({ onClose = () => {} }: { onClose?: () => void }) => {
  const [valor, setValor] = useState('');
  return (
    // onClose se recrea en cada render a propósito: así lo usan los modales reales.
    <Modal onClose={() => onClose()} labelledBy="titulo">
      <h2 id="titulo">Ventana de prueba</h2>
      <label htmlFor="campo">Cupón</label>
      <input id="campo" value={valor} onChange={(e) => setValor(e.target.value)} />
    </Modal>
  );
};

describe('escritura dentro de una ventana modal', () => {
  /**
   * Regresión. El efecto que enfocaba el panel dependía de `onClose`, que
   * llega como función nueva en cada render. Se reejecutaba con cada tecla y
   * devolvía el foco al panel, así que ningún campo aceptaba más de una letra.
   */
  test('el campo conserva el texto completo y no pierde el foco', async () => {
    const usuario = userEvent.setup();
    render(<ModalConFormulario />);

    const campo = screen.getByLabelText('Cupón');
    await usuario.type(campo, 'DOCTOR2026');

    expect(campo).toHaveValue('DOCTOR2026');
    expect(campo).toHaveFocus();
  });
});

describe('cierre de la ventana', () => {
  test('la tecla Escape cierra', async () => {
    const cerrar = vi.fn();
    const usuario = userEvent.setup();
    render(<ModalConFormulario onClose={cerrar} />);

    await usuario.keyboard('{Escape}');

    expect(cerrar).toHaveBeenCalledTimes(1);
  });

  test('Escape sigue cerrando después de escribir', async () => {
    const cerrar = vi.fn();
    const usuario = userEvent.setup();
    render(<ModalConFormulario onClose={cerrar} />);

    await usuario.type(screen.getByLabelText('Cupón'), 'algo');
    await usuario.keyboard('{Escape}');

    expect(cerrar).toHaveBeenCalledTimes(1);
  });

  test('el botón de cerrar está rotulado para lectores de pantalla', async () => {
    const cerrar = vi.fn();
    const usuario = userEvent.setup();
    render(<ModalConFormulario onClose={cerrar} />);

    await usuario.click(screen.getByRole('button', { name: /cerrar ventana/i }));

    expect(cerrar).toHaveBeenCalledTimes(1);
  });
});

describe('semántica accesible', () => {
  test('se anuncia como diálogo modal y toma su nombre del titular', () => {
    render(<ModalConFormulario />);

    const dialogo = screen.getByRole('dialog');
    expect(dialogo).toHaveAttribute('aria-modal', 'true');
    expect(dialogo).toHaveAccessibleName('Ventana de prueba');
  });

  test('bloquea el scroll del fondo mientras está abierta y lo devuelve al cerrar', () => {
    const { unmount } = render(<ModalConFormulario />);
    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
