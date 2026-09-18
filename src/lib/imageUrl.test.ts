import { describe, expect, test } from 'vitest';
import { imageAt, retratoSrcSet, ANCHOS_RETRATO } from './imageUrl';

const PORTADA = 'https://images.unsplash.com/photo-123?q=80&w=800&auto=format&fit=crop';

describe('imageAt', () => {
  test('reemplaza el ancho pedido a Unsplash', () => {
    const resultado = imageAt(PORTADA, 112);

    expect(new URL(resultado).searchParams.get('w')).toBe('112');
  });

  test('conserva el resto de los parámetros de recorte y calidad', () => {
    const resultado = new URL(imageAt(PORTADA, 112));

    expect(resultado.searchParams.get('q')).toBe('80');
    expect(resultado.searchParams.get('auto')).toBe('format');
    expect(resultado.searchParams.get('fit')).toBe('crop');
  });

  test('agrega el ancho cuando la URL de Unsplash no lo traía', () => {
    const resultado = imageAt('https://images.unsplash.com/photo-123', 64);

    expect(new URL(resultado).searchParams.get('w')).toBe('64');
  });

  test('devuelve intacta la imagen de otro origen', () => {
    const otra = 'https://ejemplo.test/portada.jpg?w=800';

    expect(imageAt(otra, 112)).toBe(otra);
  });

  test('devuelve intacta una URL que no se puede parsear', () => {
    expect(imageAt('/local/portada.jpg', 112)).toBe('/local/portada.jpg');
  });
});

describe('imageAt con el retrato del profesional', () => {
  const RETRATO = '/dr/retrato-1400.webp';

  test('para un avatar chico devuelve la versión más liviana', () => {
    expect(imageAt(RETRATO, 64)).toBe('/dr/retrato-192.webp');
  });

  test('elige el ancho más chico que alcanza a cubrir el hueco', () => {
    expect(imageAt(RETRATO, 192)).toBe('/dr/retrato-192.webp');
    expect(imageAt(RETRATO, 200)).toBe('/dr/retrato-384.webp');
    expect(imageAt(RETRATO, 900)).toBe('/dr/retrato-1000.webp');
  });

  test('no inventa un ancho mayor al que existe', () => {
    expect(imageAt(RETRATO, 5000)).toBe(`/dr/retrato-${ANCHOS_RETRATO[ANCHOS_RETRATO.length - 1]}.webp`);
  });

  test('deja pasar otra imagen local sin tocarla', () => {
    expect(imageAt('/dr/otra-cosa.png', 64)).toBe('/dr/otra-cosa.png');
  });
});

describe('retratoSrcSet', () => {
  test('ofrece cada ancho generado con su descriptor', () => {
    const lista = retratoSrcSet().split(', ');

    expect(lista).toHaveLength(ANCHOS_RETRATO.length);
    expect(lista[0]).toBe('/dr/retrato-192.webp 192w');
    expect(lista.at(-1)).toBe('/dr/retrato-1400.webp 1400w');
  });
});
