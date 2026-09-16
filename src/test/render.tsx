import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlatformProvider } from '../context/PlatformContext';

/**
 * Monta un componente dentro del proveedor de la plataforma y devuelve
 * además un usuario simulado listo para interactuar.
 */
export const renderConPlataforma = (ui: React.ReactElement, options?: RenderOptions) => {
  const usuario = userEvent.setup();
  const utilidades = render(ui, { wrapper: PlatformProvider, ...options });
  return { usuario, ...utilidades };
};

export * from '@testing-library/react';
