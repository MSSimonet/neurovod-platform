import { describe, expect, test } from 'vitest';
import { imageAt } from './imageUrl';

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
