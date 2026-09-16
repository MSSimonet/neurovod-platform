import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Atajos para la reunión de presentación al cliente. No forma parte de la
 * experiencia del paciente y se retira antes de publicar en producción.
 */
export const DemoPresentationToolbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    modules,
    purchasedModuleIds,
    setIsAuthModalOpen,
    setActiveCheckoutModule,
    setActiveDetailModule,
    setActiveVideoEpisode,
    resetDemoPurchases,
    unlockAllDemo,
    navigate,
  } = usePlatform();

  const featured = modules[0];
  if (!featured) return null;

  const shortcuts: { label: string; action: () => void }[] = [
    { label: 'Ingreso', action: () => setIsAuthModalOpen(true) },
    { label: 'Ficha del módulo', action: () => setActiveDetailModule(featured) },
    { label: 'Pasarela de pago', action: () => setActiveCheckoutModule(featured) },
    {
      label: 'Reproductor',
      action: () => setActiveVideoEpisode({ module: featured, episode: featured.episodes[0] }),
    },
    { label: 'Panel médico', action: () => navigate('/admin') },
  ];

  return (
    <aside
      className="fixed bottom-4 right-4 z-40 max-w-[calc(100vw-2rem)]"
      aria-label="Controles de demostración"
    >
      {isOpen ? (
        <div className="w-72 bg-card border border-rule-strong shadow-overlay">
          <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
            <p className="kicker">Modo demostración</p>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Minimizar los controles"
              className="p-1 text-ink-muted hover:text-ink"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <ul>
            {shortcuts.map((shortcut) => (
              <li key={shortcut.label} className="border-b border-rule">
                <button
                  onClick={shortcut.action}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-ink-secondary hover:bg-subtle hover:text-ink transition-colors"
                >
                  {shortcut.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <span className="tabular text-2xs text-ink-muted">
              {purchasedModuleIds.length}/{modules.length} habilitados
            </span>
            <div className="flex gap-1.5">
              <button onClick={resetDemoPurchases} className="btn btn-secondary px-2.5 py-1.5 text-2xs">
                Bloquear
              </button>
              <button onClick={unlockAllDemo} className="btn btn-secondary px-2.5 py-1.5 text-2xs">
                Abrir todo
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-secondary shadow-raised px-3 py-2"
        >
          <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Modo demostración</span>
          <span className="sm:hidden">Demo</span>
        </button>
      )}
    </aside>
  );
};
