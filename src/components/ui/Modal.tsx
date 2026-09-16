import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  onClose: () => void;
  labelledBy: string;
  /** Ancho máximo del panel. Por defecto el de una ficha clínica. */
  width?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const WIDTHS: Record<NonNullable<ModalProps['width']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
};

/**
 * Contenedor de ventana modal. Velo opaco sin desenfoque, panel blanco de
 * esquinas finas y cierre por tecla Escape o clic en el velo.
 */
export const Modal = ({ onClose, labelledBy, width = 'md', children }: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // `onClose` llega como función nueva en cada render del componente padre.
  // Guardarla en una referencia evita que los efectos de abajo dependan de
  // ella y se vuelvan a ejecutar con cada tecla que se escribe.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Enfocar el panel y bloquear el scroll son cosas de la apertura. Si esto
  // corriera en cada render, el foco volvería al panel tras la primera letra
  // y ningún formulario del modal se podría completar.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      className="veil fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-0 sm:p-6 animate-veil"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`relative w-full ${WIDTHS[width]} bg-card border border-rule-strong shadow-overlay my-0 sm:my-8 animate-rise focus:outline-none`}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar ventana"
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-xs bg-card border border-rule text-ink-secondary hover:bg-subtle hover:text-ink transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
};
