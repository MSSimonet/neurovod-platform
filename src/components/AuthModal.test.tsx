import React, { useEffect } from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { screen, within, waitFor } from '@testing-library/react';
import { renderConPlataforma } from '../test/render';
import { AuthModal } from './AuthModal';
import { usePlatform } from '../context/PlatformContext';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const Acceso = ({
  cerrarSesion = false,
  onUsuario,
}: {
  cerrarSesion?: boolean;
  onUsuario?: (nombre: string | null, rol: string | null) => void;
}) => {
  const { setIsAuthModalOpen, logout, user } = usePlatform();
  useEffect(() => {
    if (cerrarSesion) logout();
    setIsAuthModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    onUsuario?.(user?.name ?? null, user?.role ?? null);
  });
  return <AuthModal />;
};

/** Elegir un perfil cierra la ventana, así que el usuario activo se observa aparte. */
const montarAcceso = (props: { cerrarSesion?: boolean } = {}) => {
  const sesion = { nombre: null as string | null, rol: null as string | null };
  const utilidades = renderConPlataforma(
    <Acceso
      {...props}
      onUsuario={(nombre, rol) => {
        sesion.nombre = nombre;
        sesion.rol = rol;
      }}
    />,
  );
  return { ...utilidades, sesion };
};

beforeEach(() => localStorage.clear());

describe('con la sesión iniciada', () => {
  test('muestra el perfil y el paciente asociado', async () => {
    renderConPlataforma(<Acceso />);

    const dialogo = await screen.findByRole('dialog');
    expect(within(dialogo).getByText('Carolina Gómez')).toBeInTheDocument();
    expect(within(dialogo).getByText(/paciente asociado/i)).toBeInTheDocument();
    expect(within(dialogo).getByText(/Mateo/)).toBeInTheDocument();
  });

  test('informa cuántos módulos tiene habilitados', async () => {
    renderConPlataforma(<Acceso />);

    const dialogo = await screen.findByRole('dialog');
    expect(within(dialogo).getByText(/módulos habilitados/i)).toBeInTheDocument();
  });

  test('permite cambiar a perfil de docente', async () => {
    const { usuario, sesion } = montarAcceso();
    await screen.findByRole('dialog');

    await usuario.click(screen.getByRole('button', { name: /^docente$/i }));

    await waitFor(() => expect(sesion.nombre).toMatch(/Valeria Méndez/));
  });

  test('el docente no arrastra el perfil del paciente de otra familia', async () => {
    const { usuario, sesion } = montarAcceso();
    await screen.findByRole('dialog');

    await usuario.click(screen.getByRole('button', { name: /^docente$/i }));

    await waitFor(() => expect(sesion.rol).toBe('Docente'));
    expect(screen.queryByText(/paciente asociado/i)).not.toBeInTheDocument();
  });

  test('cerrar sesión lleva al formulario de ingreso', async () => {
    const { usuario } = renderConPlataforma(<Acceso />);
    await screen.findByRole('dialog');

    await usuario.click(screen.getByRole('button', { name: /salir/i }));

    expect(await screen.findByRole('heading', { name: /ingresá a tu cuenta/i })).toBeInTheDocument();
  });
});

describe('sin sesión iniciada', () => {
  test('ofrece ingresar con correo y contraseña', async () => {
    renderConPlataforma(<Acceso cerrarSesion />);

    expect(await screen.findByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
  });

  test('la contraseña se puede revelar y volver a ocultar', async () => {
    const { usuario } = renderConPlataforma(<Acceso cerrarSesion />);
    const campo = await screen.findByLabelText('Contraseña');
    expect(campo).toHaveAttribute('type', 'password');

    await usuario.click(screen.getByRole('button', { name: /mostrar contraseña/i }));
    expect(campo).toHaveAttribute('type', 'text');

    await usuario.click(screen.getByRole('button', { name: /ocultar contraseña/i }));
    expect(campo).toHaveAttribute('type', 'password');
  });

  test('cambiar a crear cuenta pide el nombre', async () => {
    const { usuario } = renderConPlataforma(<Acceso cerrarSesion />);
    await screen.findByRole('dialog');

    await usuario.click(screen.getByRole('button', { name: /^crear cuenta$/i }));

    expect(await screen.findByLabelText(/nombre y apellido/i)).toBeInTheDocument();
  });

  test('ingresar con el vínculo elegido abre la sesión', async () => {
    const { usuario, sesion } = montarAcceso({ cerrarSesion: true });
    await screen.findByRole('dialog');

    await usuario.type(screen.getByLabelText(/correo electrónico/i), 'familia@ejemplo.com');
    await usuario.type(screen.getByLabelText('Contraseña'), 'unaClave123');
    await usuario.selectOptions(screen.getByLabelText(/vínculo con el paciente/i), 'Terapeuta');
    const enviar = screen
      .getAllByRole('button', { name: /^ingresar$/i })
      .find((b) => b.getAttribute('type') === 'submit')!;
    await usuario.click(enviar);

    await waitFor(() => expect(sesion.nombre).toMatch(/Facundo Ríos/));
  });

  test('el acceso rápido de demostración abre sesión de un clic', async () => {
    const { usuario, sesion } = montarAcceso({ cerrarSesion: true });
    await screen.findByRole('dialog');

    const atajos = screen.getByText(/acceso rápido para la demostración/i).parentElement!;
    await usuario.click(within(atajos).getByRole('button', { name: /familia/i }));

    await waitFor(() => expect(sesion.nombre).toBe('Carolina Gómez'));
  });

  test('el campo de contraseña acepta el texto completo', async () => {
    const { usuario } = renderConPlataforma(<Acceso cerrarSesion />);
    const campo = await screen.findByLabelText('Contraseña');

    await usuario.type(campo, 'unaClaveLarga2026');

    expect(campo).toHaveValue('unaClaveLarga2026');
  });
});
