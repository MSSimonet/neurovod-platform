import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  ModuleItem,
  Episode,
  EpisodeResource,
  FilterState,
  ModuleDraft,
  Sale,
} from '../types';
import { sampleModules, leadDoctor } from '../data/catalog';
import { AppRoute, useRoute } from '../lib/useRoute';

export type UserRole = 'Padre / Madre' | 'Docente' | 'Terapeuta' | 'Médico / Administrador';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  childProfile?: string;
}

export interface WatchEntry {
  seconds: number;
  percent: number;
  completed: boolean;
}

interface PlatformContextType {
  // Catalogo y accesos
  modules: ModuleItem[];
  purchasedModuleIds: string[];
  isPurchased: (moduleId: string) => boolean;
  purchaseModule: (moduleId: string) => void;

  // Ventas y accesos manuales
  sales: Sale[];
  registerSale: (sale: Omit<Sale, 'id'>) => void;
  grantManualAccess: (moduleId: string, email: string) => void;
  revokeAccess: (moduleId: string) => void;

  // Sesion
  user: UserProfile | null;
  login: (role?: UserRole) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Navegacion
  route: AppRoute;
  navigate: (to: AppRoute) => void;

  // Administracion del catalogo
  createModule: (draft: ModuleDraft) => void;
  updateModule: (moduleId: string, draft: ModuleDraft) => void;
  deleteModule: (moduleId: string) => void;
  updateModulePrice: (moduleId: string, newPriceArs: number) => void;
  updateDoctorConsultFee: (newFeeArs: number) => void;
  reorderEpisode: (moduleId: string, episodeIndex: number, direction: 'up' | 'down') => void;
  addEpisode: (
    moduleId: string,
    newEp: { title: string; durationMinutes: number; synopsis: string; videoUrl: string },
  ) => void;
  updateEpisodeVideoUrl: (moduleId: string, episodeId: string, videoUrl: string) => void;
  deleteEpisode: (moduleId: string, episodeId: string) => void;
  addPdfResource: (moduleId: string, episodeId: string, resource: EpisodeResource) => void;
  deletePdfResource: (moduleId: string, episodeId: string, resourceTitle: string) => void;

  // Ventanas de contenido
  activeDetailModule: ModuleItem | null;
  setActiveDetailModule: (mod: ModuleItem | null) => void;
  activeVideoEpisode: { module: ModuleItem; episode: Episode } | null;
  setActiveVideoEpisode: (data: { module: ModuleItem; episode: Episode } | null) => void;
  activeCheckoutModule: ModuleItem | null;
  setActiveCheckoutModule: (mod: ModuleItem | null) => void;

  // Progreso de visualizacion
  watchProgress: Record<string, WatchEntry>;
  updateWatchProgress: (episodeId: string, seconds: number, totalSeconds: number) => void;

  // Filtros
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Herramientas de demostracion
  resetDemoPurchases: () => void;
  unlockAllDemo: () => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  condition: 'all',
  contentType: 'all',
  year: 'all',
  targetAudience: 'all',
};

const STORAGE = {
  modules: 'neurovod_custom_modules',
  purchases: 'neurovod_purchases',
  progress: 'neurovod_progress',
  sales: 'neurovod_sales',
} as const;

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`No se pudo guardar "${key}" en el almacenamiento local.`, error);
  }
};

const seedSales: Sale[] = [
  {
    id: 'MP-884120933',
    moduleId: 'tdah-infancia-integral',
    moduleTitle: 'Manejo Integral del TDAH en la Infancia',
    buyerEmail: 'lucia.ferrer@gmail.com',
    amountArs: 50000,
    method: 'Dinero en cuenta de Mercado Pago',
    processedAt: '2026-09-12T13:24:00.000Z',
    kind: 'pago',
  },
  {
    id: 'MP-884118207',
    moduleId: 'guia-sueno-neurodivergente',
    moduleTitle: 'Guía Rápida: Higiene del Sueño en Neurodivergentes',
    buyerEmail: 'martin.aguirre@outlook.com',
    amountArs: 15000,
    method: 'Tarjeta en 3 cuotas sin interes',
    processedAt: '2026-09-11T19:05:00.000Z',
    kind: 'pago',
  },
  {
    id: 'BECA-000041',
    moduleId: 'autismo-desregulacion-colapsos',
    moduleTitle: 'Autismo (TEA): Desregulación y Colapsos Sensoriales',
    buyerEmail: 'equipo.orientacion@escuela14.edu.ar',
    amountArs: 0,
    method: 'Acceso otorgado por el profesional',
    processedAt: '2026-09-09T10:40:00.000Z',
    kind: 'beca',
  },
];

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

/** Reconstruye las imagenes de origen al releer modulos del almacenamiento local. */
const hydrateModules = (stored: ModuleItem[]): ModuleItem[] =>
  stored.map((mod) => {
    const source = sampleModules.find((s) => s.id === mod.id);
    if (!source) return mod;
    return {
      ...mod,
      thumbnailUrl: source.thumbnailUrl,
      heroBannerUrl: source.heroBannerUrl,
      episodes: mod.episodes.map((ep, index) => ({
        ...ep,
        thumbnailUrl: source.episodes[index]?.thumbnailUrl ?? ep.thumbnailUrl,
      })),
    };
  });

const buildEpisodeFromDraft = (moduleId: string, draft: ModuleDraft): Episode => ({
  id: `${moduleId}-ep-1`,
  episodeNumber: 1,
  title: `Episodio 1: ${draft.title}`,
  durationMinutes: 35,
  synopsis: draft.subtitle || 'Clase clínica cargada desde el panel del profesional.',
  videoUrl: draft.videoUrl,
  thumbnailUrl: draft.thumbnailUrl,
  chapters: [
    { id: `${moduleId}-c1`, timeSeconds: 0, title: '00:00 Apertura de la clase' },
    { id: `${moduleId}-c2`, timeSeconds: 420, title: '07:00 Puntos clínicos centrales' },
  ],
  resources: draft.pdfTitle
    ? [{ title: draft.pdfTitle, type: 'pdf', size: '1.2 MB', downloadUrl: draft.pdfUrl }]
    : [],
});

export const PlatformProvider = ({ children }: { children: React.ReactNode }) => {
  const { route, navigate } = useRoute();

  const [modules, setModules] = useState<ModuleItem[]>(() => {
    const stored = readStorage<ModuleItem[] | null>(STORAGE.modules, null);
    return stored && Array.isArray(stored) && stored.length > 0
      ? hydrateModules(stored)
      : sampleModules;
  });

  const [purchasedModuleIds, setPurchasedModuleIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE.purchases, ['guia-sueno-neurodivergente']),
  );

  const [sales, setSales] = useState<Sale[]>(() => readStorage<Sale[]>(STORAGE.sales, seedSales));

  const [watchProgress, setWatchProgress] = useState<Record<string, WatchEntry>>(() =>
    readStorage<Record<string, WatchEntry>>(STORAGE.progress, {
      'guia-sueno-ep1': { seconds: 720, percent: 45, completed: false },
    }),
  );

  const [user, setUser] = useState<UserProfile | null>({
    id: 'usr-1',
    name: 'Carolina Gómez',
    email: 'carolina.gomez@gmail.com',
    role: 'Padre / Madre',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    childProfile: 'Mateo, 7 años. TDAH con desafío sensorial asociado.',
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeDetailModule, setActiveDetailModule] = useState<ModuleItem | null>(null);
  const [activeVideoEpisode, setActiveVideoEpisode] = useState<{
    module: ModuleItem;
    episode: Episode;
  } | null>(null);
  const [activeCheckoutModule, setActiveCheckoutModule] = useState<ModuleItem | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  useEffect(() => writeStorage(STORAGE.modules, modules), [modules]);
  useEffect(() => writeStorage(STORAGE.purchases, purchasedModuleIds), [purchasedModuleIds]);
  useEffect(() => writeStorage(STORAGE.progress, watchProgress), [watchProgress]);
  useEffect(() => writeStorage(STORAGE.sales, sales), [sales]);

  // Mantiene sincronizadas las ventanas abiertas cuando cambia el catalogo.
  useEffect(() => {
    setActiveDetailModule((current) =>
      current ? modules.find((m) => m.id === current.id) ?? null : null,
    );
    setActiveCheckoutModule((current) =>
      current ? modules.find((m) => m.id === current.id) ?? null : null,
    );
  }, [modules]);

  const login = useCallback((role: UserRole = 'Padre / Madre') => {
    const profiles: Record<UserRole, UserProfile> = {
      'Padre / Madre': {
        id: 'usr-1',
        name: 'Carolina Gómez',
        email: 'carolina.gomez@gmail.com',
        role: 'Padre / Madre',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        childProfile: 'Mateo, 7 años. TDAH con desafío sensorial asociado.',
      },
      Docente: {
        id: 'usr-2',
        name: 'Prof. Valeria Méndez',
        email: 'valeria.escuela@colegio.edu.ar',
        role: 'Docente',
        avatarUrl:
          'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop',
      },
      Terapeuta: {
        id: 'usr-3',
        name: 'Lic. Facundo Ríos',
        email: 'facundo.to@centroterapeutico.com',
        role: 'Terapeuta',
        avatarUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      },
      'Médico / Administrador': {
        id: 'usr-4',
        name: leadDoctor.name,
        email: 'dr.rossi@neurovod.med.ar',
        role: 'Médico / Administrador',
        avatarUrl: leadDoctor.avatarUrl,
      },
    };
    setUser(profiles[role]);
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const isPurchased = useCallback(
    (moduleId: string) => purchasedModuleIds.includes(moduleId),
    [purchasedModuleIds],
  );

  const purchaseModule = useCallback((moduleId: string) => {
    setPurchasedModuleIds((prev) => (prev.includes(moduleId) ? prev : [...prev, moduleId]));
    try {
      confetti({
        particleCount: 48,
        spread: 52,
        startVelocity: 26,
        ticks: 110,
        origin: { y: 0.5 },
        colors: ['#0284C7', '#059669', '#CBD5E1', '#0F172A'],
      });
    } catch {
      // El confeti es decorativo. Si falla, la compra igual queda registrada.
    }
  }, []);

  const registerSale = useCallback((sale: Omit<Sale, 'id'>) => {
    const prefix = sale.kind === 'beca' ? 'BECA' : 'MP';
    const id = `${prefix}-${Date.now().toString().slice(-9)}`;
    setSales((prev) => [{ ...sale, id }, ...prev]);
  }, []);

  const grantManualAccess = useCallback(
    (moduleId: string, email: string) => {
      const target = modules.find((m) => m.id === moduleId);
      if (!target) return;
      setPurchasedModuleIds((prev) => (prev.includes(moduleId) ? prev : [...prev, moduleId]));
      registerSale({
        moduleId,
        moduleTitle: target.title,
        buyerEmail: email,
        amountArs: 0,
        method: 'Acceso otorgado por el profesional',
        processedAt: new Date().toISOString(),
        kind: 'beca',
      });
    },
    [modules, registerSale],
  );

  const revokeAccess = useCallback((moduleId: string) => {
    setPurchasedModuleIds((prev) => prev.filter((id) => id !== moduleId));
  }, []);

  const createModule = useCallback((draft: ModuleDraft) => {
    const id = `mod-${Date.now()}`;
    const episode = buildEpisodeFromDraft(id, draft);
    const fresh: ModuleItem = {
      id,
      title: draft.title,
      subtitle: draft.subtitle,
      description: draft.description,
      condition: draft.condition,
      contentType: draft.contentType,
      year: new Date().getFullYear(),
      targetAudience: draft.targetAudience,
      rating: 5,
      reviewsCount: 0,
      totalDurationHours: `${episode.durationMinutes} min`,
      episodesCount: 1,
      priceArs: draft.priceArs,
      thumbnailUrl: draft.thumbnailUrl,
      heroBannerUrl: draft.thumbnailUrl,
      doctor: leadDoctor,
      keyLearningPoints: [],
      episodes: [episode],
      tags: [draft.condition.toLowerCase()],
    };
    setModules((prev) => [fresh, ...prev]);
  }, []);

  const updateModule = useCallback((moduleId: string, draft: ModuleDraft) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;
        const episodes = mod.episodes.map((ep, index) =>
          index === 0 ? { ...ep, videoUrl: draft.videoUrl || ep.videoUrl } : ep,
        );
        return {
          ...mod,
          title: draft.title,
          subtitle: draft.subtitle,
          description: draft.description,
          condition: draft.condition,
          contentType: draft.contentType,
          targetAudience: draft.targetAudience,
          priceArs: draft.priceArs,
          thumbnailUrl: draft.thumbnailUrl || mod.thumbnailUrl,
          episodes,
        };
      }),
    );
  }, []);

  const deleteModule = useCallback((moduleId: string) => {
    setModules((prev) => prev.filter((mod) => mod.id !== moduleId));
    setPurchasedModuleIds((prev) => prev.filter((id) => id !== moduleId));
  }, []);

  const updateModulePrice = useCallback((moduleId: string, newPriceArs: number) => {
    setModules((prev) =>
      prev.map((mod) => (mod.id === moduleId ? { ...mod, priceArs: newPriceArs } : mod)),
    );
  }, []);

  const updateDoctorConsultFee = useCallback((newFeeArs: number) => {
    setModules((prev) =>
      prev.map((mod) => ({
        ...mod,
        doctor: { ...mod.doctor, inPersonConsultFeeArs: newFeeArs },
      })),
    );
  }, []);

  const reorderEpisode = useCallback(
    (moduleId: string, episodeIndex: number, direction: 'up' | 'down') => {
      setModules((prev) =>
        prev.map((mod) => {
          if (mod.id !== moduleId) return mod;
          const targetIndex = direction === 'up' ? episodeIndex - 1 : episodeIndex + 1;
          if (targetIndex < 0 || targetIndex >= mod.episodes.length) return mod;

          const reordered = [...mod.episodes];
          [reordered[episodeIndex], reordered[targetIndex]] = [
            reordered[targetIndex],
            reordered[episodeIndex],
          ];
          return {
            ...mod,
            episodes: reordered.map((ep, index) => ({ ...ep, episodeNumber: index + 1 })),
          };
        }),
      );
    },
    [],
  );

  const addEpisode = useCallback(
    (
      moduleId: string,
      data: { title: string; durationMinutes: number; synopsis: string; videoUrl: string },
    ) => {
      setModules((prev) =>
        prev.map((mod) => {
          if (mod.id !== moduleId) return mod;
          const nextNumber = mod.episodes.length + 1;
          const stamp = Date.now();
          const episode: Episode = {
            id: `${moduleId}-ep-${stamp}`,
            episodeNumber: nextNumber,
            title: `Episodio ${nextNumber}: ${data.title}`,
            durationMinutes: data.durationMinutes || 25,
            synopsis: data.synopsis || 'Clase clínica cargada desde el panel del profesional.',
            videoUrl:
              data.videoUrl ||
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnailUrl: mod.thumbnailUrl,
            chapters: [
              { id: `c-${stamp}-1`, timeSeconds: 0, title: '00:00 Apertura de la clase' },
              { id: `c-${stamp}-2`, timeSeconds: 300, title: '05:00 Puntos clínicos centrales' },
            ],
            resources: [],
          };
          const episodes = [...mod.episodes, episode];
          return { ...mod, episodes, episodesCount: episodes.length };
        }),
      );
    },
    [],
  );

  const updateEpisodeVideoUrl = useCallback(
    (moduleId: string, episodeId: string, videoUrl: string) => {
      setModules((prev) =>
        prev.map((mod) =>
          mod.id === moduleId
            ? {
                ...mod,
                episodes: mod.episodes.map((ep) => (ep.id === episodeId ? { ...ep, videoUrl } : ep)),
              }
            : mod,
        ),
      );
    },
    [],
  );

  const deleteEpisode = useCallback((moduleId: string, episodeId: string) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;
        const episodes = mod.episodes
          .filter((ep) => ep.id !== episodeId)
          .map((ep, index) => ({ ...ep, episodeNumber: index + 1 }));
        return { ...mod, episodes, episodesCount: episodes.length };
      }),
    );
  }, []);

  const addPdfResource = useCallback(
    (moduleId: string, episodeId: string, resource: EpisodeResource) => {
      setModules((prev) =>
        prev.map((mod) =>
          mod.id === moduleId
            ? {
                ...mod,
                episodes: mod.episodes.map((ep) =>
                  ep.id === episodeId ? { ...ep, resources: [...(ep.resources ?? []), resource] } : ep,
                ),
              }
            : mod,
        ),
      );
    },
    [],
  );

  const deletePdfResource = useCallback(
    (moduleId: string, episodeId: string, resourceTitle: string) => {
      setModules((prev) =>
        prev.map((mod) =>
          mod.id === moduleId
            ? {
                ...mod,
                episodes: mod.episodes.map((ep) =>
                  ep.id === episodeId
                    ? { ...ep, resources: (ep.resources ?? []).filter((r) => r.title !== resourceTitle) }
                    : ep,
                ),
              }
            : mod,
        ),
      );
    },
    [],
  );

  const updateWatchProgress = useCallback(
    (episodeId: string, seconds: number, totalSeconds: number) => {
      if (!totalSeconds || totalSeconds <= 0) return;
      const percent = Math.min(100, Math.round((seconds / totalSeconds) * 100));
      setWatchProgress((prev) => {
        const current = prev[episodeId];
        if (current && current.percent === percent) return prev;
        return { ...prev, [episodeId]: { seconds, percent, completed: percent >= 90 } };
      });
    },
    [],
  );

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  const resetDemoPurchases = useCallback(() => {
    setPurchasedModuleIds(['guia-sueno-neurodivergente']);
  }, []);

  const unlockAllDemo = useCallback(() => {
    setPurchasedModuleIds(modules.map((m) => m.id));
  }, [modules]);

  return (
    <PlatformContext.Provider
      value={{
        modules,
        purchasedModuleIds,
        isPurchased,
        purchaseModule,
        sales,
        registerSale,
        grantManualAccess,
        revokeAccess,
        user,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        route,
        navigate,
        createModule,
        updateModule,
        deleteModule,
        updateModulePrice,
        updateDoctorConsultFee,
        reorderEpisode,
        addEpisode,
        updateEpisodeVideoUrl,
        deleteEpisode,
        addPdfResource,
        deletePdfResource,
        activeDetailModule,
        setActiveDetailModule,
        activeVideoEpisode,
        setActiveVideoEpisode,
        activeCheckoutModule,
        setActiveCheckoutModule,
        watchProgress,
        updateWatchProgress,
        filters,
        setFilters,
        resetFilters,
        resetDemoPurchases,
        unlockAllDemo,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = (): PlatformContextType => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform debe usarse dentro de un PlatformProvider.');
  }
  return context;
};
