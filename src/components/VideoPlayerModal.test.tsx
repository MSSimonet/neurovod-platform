import React, { useEffect } from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { screen, within, fireEvent, waitFor } from '@testing-library/react';
import { renderConPlataforma } from '../test/render';
import { VideoPlayerModal } from './VideoPlayerModal';
import { usePlatform } from '../context/PlatformContext';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const MODULO = 'tdah-infancia-integral';

const Reproductor = ({ onCerrado }: { onCerrado?: (cerrado: boolean) => void }) => {
  const { modules, setActiveVideoEpisode, activeVideoEpisode } = usePlatform();
  useEffect(() => {
    const mod = modules.find((m) => m.id === MODULO);
    if (mod) setActiveVideoEpisode({ module: mod, episode: mod.episodes[0] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    onCerrado?.(activeVideoEpisode === null);
  });
  return <VideoPlayerModal />;
};

const montarReproductor = () => {
  const estado = { cerrado: false };
  const utilidades = renderConPlataforma(
    <Reproductor onCerrado={(c) => (estado.cerrado = c)} />,
  );
  return { ...utilidades, estado };
};

/** jsdom no carga medios: se simula que el video informó su duración. */
const simularMetadatos = (duracion = 120) => {
  const video = document.querySelector('video')!;
  Object.defineProperty(video, 'duration', { configurable: true, value: duracion });
  fireEvent.loadedMetadata(video);
  return video;
};

beforeEach(() => localStorage.clear());

describe('presentación de la clase', () => {
  test('anuncia el programa, el número de clase y su título', async () => {
    montarReproductor();

    expect(await screen.findByText(/manejo integral del tdah.*clase 1/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/episodio 1/i);
  });

  test('carga el origen de video de la clase', async () => {
    montarReproductor();

    await waitFor(() => expect(document.querySelector('video')).toBeInTheDocument());
    expect(document.querySelector('video')).toHaveAttribute('src');
  });
});

describe('controles de reproducción', () => {
  test('ofrece reproducir, retroceder y adelantar', async () => {
    montarReproductor();

    expect(await screen.findByRole('button', { name: /reproducir|pausar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retroceder diez segundos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /adelantar diez segundos/i })).toBeInTheDocument();
  });

  test('adelantar diez segundos mueve la línea de tiempo', async () => {
    const { usuario } = montarReproductor();
    const video = simularMetadatos(120);
    video.currentTime = 10;
    fireEvent.timeUpdate(video);

    await usuario.click(screen.getByRole('button', { name: /adelantar diez segundos/i }));

    expect(video.currentTime).toBe(20);
  });

  test('retroceder no pasa por debajo del inicio', async () => {
    const { usuario } = montarReproductor();
    const video = simularMetadatos(120);
    video.currentTime = 3;
    fireEvent.timeUpdate(video);

    await usuario.click(screen.getByRole('button', { name: /retroceder diez segundos/i }));

    expect(video.currentTime).toBe(0);
  });

  test('permite silenciar y volver a activar el sonido', async () => {
    const { usuario } = montarReproductor();
    simularMetadatos();

    await usuario.click(await screen.findByRole('button', { name: /silenciar/i }));

    expect(await screen.findByRole('button', { name: /activar sonido/i })).toBeInTheDocument();
  });

  test('ofrece cinco velocidades de reproducción', async () => {
    montarReproductor();

    expect(await screen.findByRole('button', { name: '0.75x' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2x' })).toBeInTheDocument();
  });

  test('cambiar la velocidad la aplica al video', async () => {
    const { usuario } = montarReproductor();
    const video = simularMetadatos();

    await usuario.click(screen.getByRole('button', { name: '1.5x' }));

    expect(video.playbackRate).toBe(1.5);
  });
});

describe('índice lateral', () => {
  test('se abre y ofrece capítulos, clases y material', async () => {
    const { usuario } = montarReproductor();

    await usuario.click(await screen.findByRole('button', { name: /índice/i }));

    expect(await screen.findByRole('button', { name: /capítulos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^clases$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^material$/i })).toBeInTheDocument();
  });

  test('saltar a un capítulo mueve el video a ese minuto', async () => {
    const { usuario } = montarReproductor();
    const video = simularMetadatos(600);
    await usuario.click(screen.getByRole('button', { name: /índice/i }));

    const capitulos = await screen.findAllByRole('listitem');
    const salto = within(capitulos[1]).getByRole('button');
    await usuario.click(salto);

    expect(video.currentTime).toBeGreaterThan(0);
  });

  test('la pestaña de clases lista toda la playlist', async () => {
    const { usuario } = montarReproductor();
    await usuario.click(await screen.findByRole('button', { name: /índice/i }));

    await usuario.click(screen.getByRole('button', { name: /^clases$/i }));

    expect(await screen.findByText(/episodio 2/i)).toBeInTheDocument();
  });

  test('la pestaña de material ofrece la descarga del PDF', async () => {
    const { usuario } = montarReproductor();
    await usuario.click(await screen.findByRole('button', { name: /índice/i }));

    await usuario.click(screen.getByRole('button', { name: /^material$/i }));

    expect(await screen.findByRole('link', { name: /pdf/i })).toBeInTheDocument();
  });
});

describe('progreso y cierre', () => {
  test('guarda el avance de la clase mientras se mira', async () => {
    montarReproductor();
    const video = simularMetadatos(200);

    video.currentTime = 50;
    fireEvent.timeUpdate(video);

    await waitFor(() => {
      const guardado = JSON.parse(localStorage.getItem('neurovod_progress') ?? '{}');
      expect(Object.values(guardado).some((p) => (p as { percent: number }).percent === 25)).toBe(
        true,
      );
    });
  });

  test('retoma donde quedó la clase', async () => {
    localStorage.setItem(
      'neurovod_progress',
      JSON.stringify({ 'tdah-ep-1': { seconds: 60, percent: 30, completed: false } }),
    );

    montarReproductor();
    const video = simularMetadatos(200);

    expect(video.currentTime).toBe(60);
  });

  test('el botón de cerrar vuelve a la plataforma', async () => {
    const { usuario, estado } = montarReproductor();

    await usuario.click(await screen.findByRole('button', { name: /cerrar el reproductor/i }));

    await waitFor(() => expect(estado.cerrado).toBe(true));
  });

  test('la tecla Escape también cierra', async () => {
    const { usuario, estado } = montarReproductor();
    await screen.findByRole('button', { name: /cerrar el reproductor/i });

    await usuario.keyboard('{Escape}');

    await waitFor(() => expect(estado.cerrado).toBe(true));
  });
});

describe('cuando el video no carga', () => {
  test('explica qué pasó y ofrece reintentar en lugar de quedar congelado', async () => {
    montarReproductor();
    const video = document.querySelector('video')!;

    fireEvent.error(video);

    expect(await screen.findByText(/no se pudo cargar/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /volver al catálogo/i })).toBeInTheDocument();
  });

  test('reintentar vuelve a pedir el video', async () => {
    const { usuario } = montarReproductor();
    const video = document.querySelector('video')!;
    fireEvent.error(video);
    await screen.findByText(/no se pudo cargar/i);

    await usuario.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(video.load).toHaveBeenCalled();
    expect(screen.queryByText(/no se pudo cargar/i)).not.toBeInTheDocument();
  });
});
