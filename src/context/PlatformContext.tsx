import React, { createContext, useContext, useState, useEffect } from 'react';
import { ModuleItem, Episode, FilterState } from '../types';
import { sampleModules } from '../data/catalog';
import confetti from 'canvas-confetti';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Padre / Madre' | 'Docente' | 'Terapeuta' | 'Médico / Administrador';
  avatarUrl: string;
  childProfile?: string;
}

interface PlatformContextType {
  modules: ModuleItem[];
  purchasedModuleIds: string[];
  purchaseModule: (moduleId: string) => void;
  isPurchased: (moduleId: string) => boolean;
  
  // User Authentication
  user: UserProfile | null;
  login: (role?: 'Padre / Madre' | 'Docente' | 'Terapeuta' | 'Médico / Administrador') => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Admin Section
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  updateModulePrice: (moduleId: string, newPriceArs: number) => void;
  updateDoctorConsultFee: (newFeeArs: number) => void;
  reorderEpisode: (moduleId: string, episodeIndex: number, direction: 'up' | 'down') => void;
  addEpisode: (moduleId: string, newEp: { title: string; durationMinutes: number; synopsis: string; videoUrl: string }) => void;
  deleteEpisode: (moduleId: string, episodeId: string) => void;
  addPdfResource: (moduleId: string, episodeId: string, resource: { title: string; type: 'pdf' | 'checklist' | 'guide'; size: string }) => void;
  deletePdfResource: (moduleId: string, episodeId: string, resourceTitle: string) => void;

  // Modals & Navigation
  activeDetailModule: ModuleItem | null;
  setActiveDetailModule: (mod: ModuleItem | null) => void;
  
  activeVideoEpisode: { module: ModuleItem; episode: Episode } | null;
  setActiveVideoEpisode: (data: { module: ModuleItem; episode: Episode } | null) => void;
  
  activeCheckoutModule: ModuleItem | null;
  setActiveCheckoutModule: (mod: ModuleItem | null) => void;
  
  // Watch Progress
  watchProgress: Record<string, { seconds: number; percent: number; completed: boolean }>;
  updateWatchProgress: (episodeId: string, seconds: number, totalSeconds: number) => void;
  
  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;

  // Demo Presentation Tools
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

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<ModuleItem[]>(() => {
    try {
      const saved = localStorage.getItem('neurovod_custom_modules');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: ModuleItem) => {
          const sample = sampleModules.find(s => s.id === m.id);
          if (sample) {
            return {
              ...m,
              thumbnailUrl: sample.thumbnailUrl,
              heroBannerUrl: sample.heroBannerUrl,
              episodes: m.episodes.map((ep, idx) => ({
                ...ep,
                thumbnailUrl: sample.episodes[idx]?.thumbnailUrl || ep.thumbnailUrl
              }))
            };
          }
          return m;
        });
      }
      return sampleModules;
    } catch {
      return sampleModules;
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [user, setUser] = useState<UserProfile | null>({
    id: 'usr-1',
    name: 'Carolina Gómez',
    email: 'carolina.gomez@gmail.com',
    role: 'Padre / Madre',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    childProfile: 'Mateo (7 años) • Diagnóstico TDAH & Desafío Sensorial'
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [purchasedModuleIds, setPurchasedModuleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('neurovod_purchases');
      return saved ? JSON.parse(saved) : ['guia-sueno-neurodivergente'];
    } catch {
      return ['guia-sueno-neurodivergente'];
    }
  });

  const [watchProgress, setWatchProgress] = useState<Record<string, { seconds: number; percent: number; completed: boolean }>>(() => {
    try {
      const saved = localStorage.getItem('neurovod_progress');
      return saved ? JSON.parse(saved) : {
        'guia-sueno-ep1': { seconds: 720, percent: 45, completed: false }
      };
    } catch {
      return {};
    }
  });

  const [activeDetailModule, setActiveDetailModule] = useState<ModuleItem | null>(null);
  const [activeVideoEpisode, setActiveVideoEpisode] = useState<{ module: ModuleItem; episode: Episode } | null>(null);
  const [activeCheckoutModule, setActiveCheckoutModule] = useState<ModuleItem | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Persist custom modules to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('neurovod_custom_modules', JSON.stringify(modules));
    } catch (e) {
      console.error('Failed to persist modules', e);
    }
  }, [modules]);

  useEffect(() => {
    try {
      localStorage.setItem('neurovod_purchases', JSON.stringify(purchasedModuleIds));
    } catch (e) {
      console.error('Failed to persist purchases', e);
    }
  }, [purchasedModuleIds]);

  useEffect(() => {
    try {
      localStorage.setItem('neurovod_progress', JSON.stringify(watchProgress));
    } catch (e) {
      console.error('Failed to persist progress', e);
    }
  }, [watchProgress]);

  // Keep active modals updated if module data changes
  useEffect(() => {
    if (activeDetailModule) {
      const updated = modules.find(m => m.id === activeDetailModule.id);
      if (updated) setActiveDetailModule(updated);
    }
    if (activeCheckoutModule) {
      const updated = modules.find(m => m.id === activeCheckoutModule.id);
      if (updated) setActiveCheckoutModule(updated);
    }
  }, [modules]);

  const login = (role: 'Padre / Madre' | 'Docente' | 'Terapeuta' | 'Médico / Administrador' = 'Padre / Madre') => {
    setUser({
      id: 'usr-1',
      name: role === 'Médico / Administrador'
        ? 'Dr. Julián Rossi'
        : role === 'Docente'
        ? 'Prof. Valeria Méndez'
        : role === 'Terapeuta'
        ? 'Lic. Facundo Ríos'
        : 'Carolina Gómez',
      email: role === 'Médico / Administrador'
        ? 'dr.rossi@neurovod.med.ar'
        : role === 'Docente'
        ? 'valeria.escuela@colegio.edu.ar'
        : role === 'Terapeuta'
        ? 'facundo.to@centroterapeutico.com'
        : 'carolina.gomez@gmail.com',
      role,
      avatarUrl: role === 'Médico / Administrador'
        ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop'
        : role === 'Terapeuta'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      childProfile: role === 'Padre / Madre' ? 'Mateo (7 años) • TDAH & Desafío Sensorial' : undefined
    });
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  // Admin Actions
  const updateModulePrice = (moduleId: string, newPriceArs: number) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return { ...m, priceArs: newPriceArs };
      }
      return m;
    }));
  };

  const updateDoctorConsultFee = (newFeeArs: number) => {
    setModules(prev => prev.map(m => ({
      ...m,
      doctor: { ...m.doctor, inPersonConsultFeeArs: newFeeArs }
    })));
  };

  const reorderEpisode = (moduleId: string, episodeIndex: number, direction: 'up' | 'down') => {
    setModules(prev => prev.map(mod => {
      if (mod.id !== moduleId) return mod;
      const targetIndex = direction === 'up' ? episodeIndex - 1 : episodeIndex + 1;
      if (targetIndex < 0 || targetIndex >= mod.episodes.length) return mod;

      const newEpisodes = [...mod.episodes];
      const temp = newEpisodes[episodeIndex];
      newEpisodes[episodeIndex] = newEpisodes[targetIndex];
      newEpisodes[targetIndex] = temp;

      // Update episode numbers sequentially
      const updatedEpisodes = newEpisodes.map((ep, idx) => ({
        ...ep,
        episodeNumber: idx + 1
      }));

      return { ...mod, episodes: updatedEpisodes };
    }));
  };

  const addEpisode = (moduleId: string, newEpData: { title: string; durationMinutes: number; synopsis: string; videoUrl: string }) => {
    setModules(prev => prev.map(mod => {
      if (mod.id !== moduleId) return mod;
      const nextNum = mod.episodes.length + 1;
      const newEpisode: Episode = {
        id: `${moduleId}-ep-${Date.now()}`,
        episodeNumber: nextNum,
        title: `Episodio ${nextNum}: ${newEpData.title}`,
        durationMinutes: newEpData.durationMinutes || 25,
        synopsis: newEpData.synopsis || 'Contenido clínico nuevo subido por el profesional.',
        videoUrl: newEpData.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: mod.thumbnailUrl,
        chapters: [
          { id: `c-${Date.now()}-1`, timeSeconds: 0, title: '00:00 Inicio de clase' },
          { id: `c-${Date.now()}-2`, timeSeconds: 300, title: '05:00 Puntos clínicos centrales' }
        ],
        resources: []
      };

      const updatedEpisodes = [...mod.episodes, newEpisode];
      return {
        ...mod,
        episodes: updatedEpisodes,
        episodesCount: updatedEpisodes.length
      };
    }));
  };

  const deleteEpisode = (moduleId: string, episodeId: string) => {
    setModules(prev => prev.map(mod => {
      if (mod.id !== moduleId) return mod;
      const filtered = mod.episodes.filter(ep => ep.id !== episodeId);
      const renumbered = filtered.map((ep, idx) => ({
        ...ep,
        episodeNumber: idx + 1
      }));
      return {
        ...mod,
        episodes: renumbered,
        episodesCount: renumbered.length
      };
    }));
  };

  const addPdfResource = (moduleId: string, episodeId: string, resource: { title: string; type: 'pdf' | 'checklist' | 'guide'; size: string }) => {
    setModules(prev => prev.map(mod => {
      if (mod.id !== moduleId) return mod;
      const updatedEpisodes = mod.episodes.map(ep => {
        if (ep.id === episodeId) {
          const currentRes = ep.resources || [];
          return {
            ...ep,
            resources: [...currentRes, resource]
          };
        }
        return ep;
      });
      return { ...mod, episodes: updatedEpisodes };
    }));
  };

  const deletePdfResource = (moduleId: string, episodeId: string, resourceTitle: string) => {
    setModules(prev => prev.map(mod => {
      if (mod.id !== moduleId) return mod;
      const updatedEpisodes = mod.episodes.map(ep => {
        if (ep.id === episodeId && ep.resources) {
          return {
            ...ep,
            resources: ep.resources.filter(r => r.title !== resourceTitle)
          };
        }
        return ep;
      });
      return { ...mod, episodes: updatedEpisodes };
    }));
  };

  const purchaseModule = (moduleId: string) => {
    if (!purchasedModuleIds.includes(moduleId)) {
      setPurchasedModuleIds(prev => [...prev, moduleId]);
    }
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#06B6D4', '#10B981', '#38BDF8', '#F59E0B']
      });
    } catch {
      // ignore
    }
  };

  const isPurchased = (moduleId: string) => {
    return purchasedModuleIds.includes(moduleId);
  };

  const updateWatchProgress = (episodeId: string, seconds: number, totalSeconds: number) => {
    const percent = Math.min(100, Math.round((seconds / totalSeconds) * 100));
    setWatchProgress(prev => ({
      ...prev,
      [episodeId]: {
        seconds,
        percent,
        completed: percent >= 90
      }
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setActiveCategory('all');
  };

  const resetDemoPurchases = () => {
    setPurchasedModuleIds(['guia-sueno-neurodivergente']);
    localStorage.removeItem('neurovod_purchases');
  };

  const unlockAllDemo = () => {
    const allIds = modules.map(m => m.id);
    setPurchasedModuleIds(allIds);
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {}
  };

  return (
    <PlatformContext.Provider
      value={{
        modules,
        purchasedModuleIds,
        purchaseModule,
        isPurchased,
        user,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminOpen,
        setIsAdminOpen,
        updateModulePrice,
        updateDoctorConsultFee,
        reorderEpisode,
        addEpisode,
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
        activeCategory,
        setActiveCategory,
        resetDemoPurchases,
        unlockAllDemo
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
