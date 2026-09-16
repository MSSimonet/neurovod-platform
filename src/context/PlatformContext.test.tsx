import React from 'react';
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { PlatformProvider, usePlatform } from './PlatformContext';
import { ModuleDraft } from '../types';

// El confeti dibuja sobre un canvas que jsdom no implementa.
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const envolver = ({ children }: { children: React.ReactNode }) => (
  <PlatformProvider>{children}</PlatformProvider>
);

const montar = () => renderHook(() => usePlatform(), { wrapper: envolver });

const borrador = (extra: Partial<ModuleDraft> = {}): ModuleDraft => ({
  title: 'Rutinas de mañana en el hogar',
  subtitle: 'Cómo sostener la secuencia sin pelear cada día',
  description: 'Protocolo de anticipación para el arranque del día.',
  condition: 'TDAH',
  contentType: 'Modulo',
  targetAudience: 'Escolar (6-12 años)',
  priceArs: 42000,
  thumbnailUrl: 'https://ejemplo.test/portada.jpg',
  videoUrl: 'https://ejemplo.test/clase.mp4',
  pdfTitle: 'Checklist de rutina matinal',
  pdfUrl: 'https://ejemplo.test/checklist.pdf',
  ...extra,
});

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  localStorage.clear();
});

describe('accesos a los módulos', () => {
  test('arranca con la guía de sueño habilitada como muestra', () => {
    const { result } = montar();

    expect(result.current.isPurchased('guia-sueno-neurodivergente')).toBe(true);
  });

  test('comprar un módulo lo habilita', () => {
    const { result } = montar();
    expect(result.current.isPurchased('tdah-infancia-integral')).toBe(false);

    act(() => result.current.purchaseModule('tdah-infancia-integral'));

    expect(result.current.isPurchased('tdah-infancia-integral')).toBe(true);
  });

  test('comprar dos veces el mismo módulo no lo duplica', () => {
    const { result } = montar();

    act(() => result.current.purchaseModule('tdah-infancia-integral'));
    act(() => result.current.purchaseModule('tdah-infancia-integral'));

    const apariciones = result.current.purchasedModuleIds.filter(
      (id) => id === 'tdah-infancia-integral',
    );
    expect(apariciones).toHaveLength(1);
  });

  test('los accesos sobreviven al recargar la página', async () => {
    const primera = montar();
    act(() => primera.result.current.purchaseModule('congreso-neurodesarrollo-2025'));
    await waitFor(() =>
      expect(localStorage.getItem('neurovod_purchases')).toContain('congreso-neurodesarrollo-2025'),
    );
    primera.unmount();

    const segunda = montar();

    expect(segunda.result.current.isPurchased('congreso-neurodesarrollo-2025')).toBe(true);
  });

  test('dar de baja un acceso lo quita', () => {
    const { result } = montar();

    act(() => result.current.revokeAccess('guia-sueno-neurodivergente'));

    expect(result.current.isPurchased('guia-sueno-neurodivergente')).toBe(false);
  });
});

describe('ventas y becas', () => {
  test('registra la venta con un comprobante de Mercado Pago', () => {
    const { result } = montar();
    const previas = result.current.sales.length;

    act(() =>
      result.current.registerSale({
        moduleId: 'tdah-infancia-integral',
        moduleTitle: 'Manejo Integral del TDAH en la Infancia',
        buyerEmail: 'familia@ejemplo.com',
        amountArs: 50000,
        method: 'Dinero en cuenta de Mercado Pago',
        processedAt: new Date().toISOString(),
        kind: 'pago',
      }),
    );

    expect(result.current.sales).toHaveLength(previas + 1);
    expect(result.current.sales[0].id).toMatch(/^MP-/);
    expect(result.current.sales[0].amountArs).toBe(50000);
  });

  test('otorgar una beca habilita el módulo y lo asienta sin cobro', () => {
    const { result } = montar();

    act(() => result.current.grantManualAccess('tdah-infancia-integral', 'escuela@ejemplo.edu.ar'));

    expect(result.current.isPurchased('tdah-infancia-integral')).toBe(true);
    const asiento = result.current.sales[0];
    expect(asiento.kind).toBe('beca');
    expect(asiento.amountArs).toBe(0);
    expect(asiento.id).toMatch(/^BECA-/);
    expect(asiento.buyerEmail).toBe('escuela@ejemplo.edu.ar');
  });

  test('una beca sobre un módulo inexistente no registra nada', () => {
    const { result } = montar();
    const previas = result.current.sales.length;

    act(() => result.current.grantManualAccess('modulo-que-no-existe', 'a@b.com'));

    expect(result.current.sales).toHaveLength(previas);
  });

  test('las becas no suman a lo facturado', () => {
    const { result } = montar();

    act(() => result.current.grantManualAccess('tdah-infancia-integral', 'escuela@ejemplo.edu.ar'));

    const facturado = result.current.sales
      .filter((v) => v.kind === 'pago')
      .reduce((suma, v) => suma + v.amountArs, 0);
    const conBeca = result.current.sales.reduce((suma, v) => suma + v.amountArs, 0);
    expect(facturado).toBe(conBeca);
  });
});

describe('administración del catálogo', () => {
  test('crear un programa lo publica al principio del catálogo', () => {
    const { result } = montar();
    const previos = result.current.modules.length;

    act(() => result.current.createModule(borrador()));

    expect(result.current.modules).toHaveLength(previos + 1);
    const nuevo = result.current.modules[0];
    expect(nuevo.title).toBe('Rutinas de mañana en el hogar');
    expect(nuevo.priceArs).toBe(42000);
    expect(nuevo.episodes).toHaveLength(1);
  });

  test('el programa nuevo adjunta el PDF cargado en el formulario', () => {
    const { result } = montar();

    act(() => result.current.createModule(borrador()));

    const recursos = result.current.modules[0].episodes[0].resources ?? [];
    expect(recursos).toHaveLength(1);
    expect(recursos[0].title).toBe('Checklist de rutina matinal');
  });

  test('un programa sin PDF queda sin material adjunto', () => {
    const { result } = montar();

    act(() => result.current.createModule(borrador({ pdfTitle: '', pdfUrl: '' })));

    expect(result.current.modules[0].episodes[0].resources).toHaveLength(0);
  });

  test('editar un programa actualiza título, precio y origen del video', () => {
    const { result } = montar();

    act(() =>
      result.current.updateModule(
        'tdah-infancia-integral',
        borrador({ title: 'Título corregido', priceArs: 60000, videoUrl: 'https://nuevo.test/a.mp4' }),
      ),
    );

    const editado = result.current.modules.find((m) => m.id === 'tdah-infancia-integral')!;
    expect(editado.title).toBe('Título corregido');
    expect(editado.priceArs).toBe(60000);
    expect(editado.episodes[0].videoUrl).toBe('https://nuevo.test/a.mp4');
  });

  test('eliminar un programa lo quita y revoca sus accesos', () => {
    const { result } = montar();
    act(() => result.current.purchaseModule('tdah-infancia-integral'));

    act(() => result.current.deleteModule('tdah-infancia-integral'));

    expect(result.current.modules.find((m) => m.id === 'tdah-infancia-integral')).toBeUndefined();
    expect(result.current.isPurchased('tdah-infancia-integral')).toBe(false);
  });

  test('cambiar el precio afecta solo al módulo elegido', () => {
    const { result } = montar();
    const otroAntes = result.current.modules[1].priceArs;

    act(() => result.current.updateModulePrice(result.current.modules[0].id, 33000));

    expect(result.current.modules[0].priceArs).toBe(33000);
    expect(result.current.modules[1].priceArs).toBe(otroAntes);
  });

  test('el honorario de consulta se actualiza en todo el catálogo', () => {
    const { result } = montar();

    act(() => result.current.updateDoctorConsultFee(75000));

    for (const mod of result.current.modules) {
      expect(mod.doctor.inPersonConsultFeeArs).toBe(75000);
    }
  });
});

describe('clases de un programa', () => {
  const idModulo = 'tdah-infancia-integral';

  test('agregar una clase la numera al final', () => {
    const { result } = montar();
    const antes = result.current.modules.find((m) => m.id === idModulo)!.episodes.length;

    act(() =>
      result.current.addEpisode(idModulo, {
        title: 'La cena familiar',
        durationMinutes: 28,
        synopsis: 'Intervenciones en la mesa.',
        videoUrl: 'https://ejemplo.test/cena.mp4',
      }),
    );

    const mod = result.current.modules.find((m) => m.id === idModulo)!;
    expect(mod.episodes).toHaveLength(antes + 1);
    expect(mod.episodes[antes].episodeNumber).toBe(antes + 1);
    expect(mod.episodesCount).toBe(antes + 1);
  });

  test('reordenar hacia arriba intercambia y renumera', () => {
    const { result } = montar();
    const original = result.current.modules.find((m) => m.id === idModulo)!.episodes;
    const tituloSegundo = original[1].title;

    act(() => result.current.reorderEpisode(idModulo, 1, 'up'));

    const mod = result.current.modules.find((m) => m.id === idModulo)!;
    expect(mod.episodes[0].title).toBe(tituloSegundo);
    expect(mod.episodes.map((e) => e.episodeNumber)).toEqual(
      mod.episodes.map((_, i) => i + 1),
    );
  });

  test('no se puede subir la primera clase', () => {
    const { result } = montar();
    const antes = result.current.modules.find((m) => m.id === idModulo)!.episodes[0].title;

    act(() => result.current.reorderEpisode(idModulo, 0, 'up'));

    expect(result.current.modules.find((m) => m.id === idModulo)!.episodes[0].title).toBe(antes);
  });

  test('no se puede bajar la última clase', () => {
    const { result } = montar();
    const mod = result.current.modules.find((m) => m.id === idModulo)!;
    const ultimo = mod.episodes.length - 1;
    const antes = mod.episodes[ultimo].title;

    act(() => result.current.reorderEpisode(idModulo, ultimo, 'down'));

    const despues = result.current.modules.find((m) => m.id === idModulo)!;
    expect(despues.episodes[ultimo].title).toBe(antes);
  });

  test('eliminar una clase renumera las restantes', () => {
    const { result } = montar();
    const mod = result.current.modules.find((m) => m.id === idModulo)!;
    const idPrimera = mod.episodes[0].id;

    act(() => result.current.deleteEpisode(idModulo, idPrimera));

    const despues = result.current.modules.find((m) => m.id === idModulo)!;
    expect(despues.episodes.find((e) => e.id === idPrimera)).toBeUndefined();
    expect(despues.episodes.map((e) => e.episodeNumber)).toEqual(
      despues.episodes.map((_, i) => i + 1),
    );
    expect(despues.episodesCount).toBe(despues.episodes.length);
  });

  test('cambiar el origen del video de una clase no toca a las demás', () => {
    const { result } = montar();
    const mod = result.current.modules.find((m) => m.id === idModulo)!;
    const otroAntes = mod.episodes[1].videoUrl;

    act(() =>
      result.current.updateEpisodeVideoUrl(idModulo, mod.episodes[0].id, 'https://cdn.test/x.m3u8'),
    );

    const despues = result.current.modules.find((m) => m.id === idModulo)!;
    expect(despues.episodes[0].videoUrl).toBe('https://cdn.test/x.m3u8');
    expect(despues.episodes[1].videoUrl).toBe(otroAntes);
  });

  test('vincular y quitar un PDF de una clase', () => {
    const { result } = montar();
    const mod = result.current.modules.find((m) => m.id === idModulo)!;
    const idClase = mod.episodes[0].id;

    act(() =>
      result.current.addPdfResource(idModulo, idClase, {
        title: 'Guía para docentes',
        type: 'pdf',
        size: '1.2 MB',
      }),
    );
    const conPdf = result.current.modules.find((m) => m.id === idModulo)!.episodes[0].resources!;
    expect(conPdf.some((r) => r.title === 'Guía para docentes')).toBe(true);

    act(() => result.current.deletePdfResource(idModulo, idClase, 'Guía para docentes'));

    const sinPdf = result.current.modules.find((m) => m.id === idModulo)!.episodes[0].resources!;
    expect(sinPdf.some((r) => r.title === 'Guía para docentes')).toBe(false);
  });
});

describe('progreso de visualización', () => {
  test('calcula el porcentaje visto', () => {
    const { result } = montar();

    act(() => result.current.updateWatchProgress('clase-1', 30, 120));

    expect(result.current.watchProgress['clase-1'].percent).toBe(25);
    expect(result.current.watchProgress['clase-1'].completed).toBe(false);
  });

  test('marca como completada a partir del noventa por ciento', () => {
    const { result } = montar();

    act(() => result.current.updateWatchProgress('clase-1', 115, 120));

    expect(result.current.watchProgress['clase-1'].completed).toBe(true);
  });

  test('no supera el cien por ciento', () => {
    const { result } = montar();

    act(() => result.current.updateWatchProgress('clase-1', 200, 120));

    expect(result.current.watchProgress['clase-1'].percent).toBe(100);
  });

  test('ignora una duración inválida en lugar de dividir por cero', () => {
    const { result } = montar();

    act(() => result.current.updateWatchProgress('clase-1', 30, 0));

    expect(result.current.watchProgress['clase-1']).toBeUndefined();
  });
});

describe('reparación de videos guardados en el navegador', () => {
  /**
   * Google cerró el bucket de muestras y devuelve 403. Quien ya había
   * visitado el sitio conserva esas URLs en su navegador, así que al leer
   * hay que repararlas o la corrección nunca le llega.
   */
  test('reemplaza los orígenes del bucket caído al recuperar el estado', async () => {
    const primera = montar();
    const modulos = JSON.parse(JSON.stringify(primera.result.current.modules));
    modulos[0].episodes[0].videoUrl =
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    localStorage.setItem('neurovod_custom_modules', JSON.stringify(modulos));
    primera.unmount();

    const segunda = montar();

    const urls = segunda.result.current.modules.flatMap((m) => m.episodes.map((e) => e.videoUrl));
    expect(urls.some((u) => u.includes('commondatastorage'))).toBe(false);
  });

  test('respeta un origen cargado por el profesional desde el panel', async () => {
    const propio = 'https://cdn.neurovod.med.ar/clase-01/master.m3u8';
    const primera = montar();
    const modulos = JSON.parse(JSON.stringify(primera.result.current.modules));
    modulos[0].episodes[0].videoUrl = propio;
    localStorage.setItem('neurovod_custom_modules', JSON.stringify(modulos));
    primera.unmount();

    const segunda = montar();

    expect(segunda.result.current.modules[0].episodes[0].videoUrl).toBe(propio);
  });
});

describe('filtros y sesión', () => {
  test('limpiar los filtros los devuelve al estado inicial', () => {
    const { result } = montar();
    act(() => result.current.setFilters((prev) => ({ ...prev, condition: 'TDAH', searchQuery: 'sueño' })));

    act(() => result.current.resetFilters());

    expect(result.current.filters.condition).toBe('all');
    expect(result.current.filters.searchQuery).toBe('');
  });

  test('ingresar como docente cambia el perfil activo', () => {
    const { result } = montar();

    act(() => result.current.login('Docente'));

    expect(result.current.user?.role).toBe('Docente');
    expect(result.current.user?.childProfile).toBeUndefined();
  });

  test('ingresar como familia asocia el perfil del paciente', () => {
    const { result } = montar();

    act(() => result.current.login('Padre / Madre'));

    expect(result.current.user?.childProfile).toContain('Mateo');
  });

  test('cerrar sesión deja la plataforma sin usuario', () => {
    const { result } = montar();

    act(() => result.current.logout());

    expect(result.current.user).toBeNull();
  });
});

describe('herramientas de demostración', () => {
  test('abrir todo habilita el catálogo completo', () => {
    const { result } = montar();

    act(() => result.current.unlockAllDemo());

    expect(result.current.purchasedModuleIds).toHaveLength(result.current.modules.length);
  });

  test('bloquear vuelve al módulo de muestra', () => {
    const { result } = montar();
    act(() => result.current.unlockAllDemo());

    act(() => result.current.resetDemoPurchases());

    expect(result.current.purchasedModuleIds).toEqual(['guia-sueno-neurodivergente']);
  });
});

describe('usePlatform fuera del proveedor', () => {
  test('avisa con un error claro en lugar de devolver indefinido', () => {
    const silencio = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => usePlatform())).toThrow(/PlatformProvider/);

    silencio.mockRestore();
  });
});
