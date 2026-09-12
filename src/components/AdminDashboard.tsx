import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import {
  ShieldCheck, DollarSign, Video, FileText, ArrowLeft,
  ChevronUp, ChevronDown, Plus, Trash2, Save, Upload, CheckCircle2,
  TrendingUp, Users, Clock, AlertCircle, Eye, Film, Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    modules,
    updateModulePrice,
    updateDoctorConsultFee,
    reorderEpisode,
    addEpisode,
    deleteEpisode,
    addPdfResource,
    deletePdfResource,
    setIsAdminOpen,
    setActiveVideoEpisode,
    setActiveDetailModule
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'pricing' | 'videos' | 'materials' | 'kpis'>('pricing');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0]?.id || '');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Pricing edit state
  const [editingPrices, setEditingPrices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    modules.forEach(m => { initial[m.id] = m.priceArs; });
    return initial;
  });

  const [inPersonFee, setInPersonFee] = useState<number>(modules[0]?.doctor.inPersonConsultFeeArs || 60000);

  // New Episode form state
  const [newEpTitle, setNewEpTitle] = useState('');
  const [newEpDuration, setNewEpDuration] = useState<number>(30);
  const [newEpSynopsis, setNewEpSynopsis] = useState('');
  const [newEpUrl, setNewEpUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  // New Resource form state
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState<'pdf' | 'checklist' | 'guide'>('pdf');
  const [resSize, setResSize] = useState('1.4 MB');

  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleSavePrice = (moduleId: string) => {
    const price = editingPrices[moduleId];
    if (price && price > 0) {
      updateModulePrice(moduleId, price);
      showToast(`¡Precio actualizado a $${price.toLocaleString('es-AR')} ARS con éxito!`);
    }
  };

  const handleSaveConsultFee = () => {
    updateDoctorConsultFee(inPersonFee);
    showToast(`¡Honorario de consulta presencial actualizado a $${inPersonFee.toLocaleString('es-AR')} ARS!`);
  };

  const handleAddEpisodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEpTitle.trim()) return;
    addEpisode(selectedModuleId, {
      title: newEpTitle,
      durationMinutes: Number(newEpDuration),
      synopsis: newEpSynopsis || 'Explicación médica paso a paso para padres y cuidadores.',
      videoUrl: newEpUrl
    });
    setNewEpTitle('');
    setNewEpSynopsis('');
    showToast('¡Nueva clase en video agregada a la playlist!');
  };

  const handleAddPdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;
    const selectedMod = modules.find(m => m.id === selectedModuleId);
    const targetEp = selectedMod?.episodes[0];
    if (targetEp) {
      addPdfResource(selectedModuleId, targetEp.id, {
        title: resTitle,
        type: resType,
        size: resSize
      });
      setResTitle('');
      showToast('¡Documento PDF vinculado a la playlist del módulo!');
    }
  };

  const currentModule = modules.find(m => m.id === selectedModuleId) || modules[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F17] text-slate-100 overflow-y-auto flex flex-col animate-fade-in">
      {/* Admin Top Navigation Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-cyan-500/30 px-4 sm:px-8 py-3.5 backdrop-blur-xl flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-wide">
                Panel Médico de Control Privado
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase tracking-wider">
                Dr. Julián Rossi (MN 142.890)
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Gestión intuitiva de aranceles, orden de videos, subida de clases y materiales descargables en PDF
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Vista Pública</span>
          </button>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {feedbackMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs shadow-2xl flex items-center gap-2 animate-scale-in">
          <CheckCircle2 className="w-4 h-4" />
          {feedbackMessage}
        </div>
      )}

      {/* Main Body */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6 flex-1">
        {/* Quick KPI Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-white">148 hs</div>
              <div className="text-[11px] text-slate-400">Consultas Ahorradas</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-white">342</div>
              <div className="text-[11px] text-slate-400">Familias Activas</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-emerald-400">$8.450.000</div>
              <div className="text-[11px] text-slate-400">Ingresos ARS / Mes</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-white">{modules.length} Módulos</div>
              <div className="text-[11px] text-slate-400">Publicados en VOD</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab('pricing')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'pricing'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            1. Gestión de Precios & Aranceles
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'videos'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            2. Videos, Clases & Orden de Episodios
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'materials'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            3. Materiales & Subida de PDFs
          </button>
        </div>

        {/* TAB 1: PRICING MANAGER */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong>Política de Precios Privada:</strong> Los precios fijados en esta sección no se muestran en el catálogo público ni en los banners para no desviar la atención médica. Únicamente se calculan y visualizan cuando el familiar decide ingresar a la pasarela de pagos segura de Mercado Pago.
              </div>
            </div>

            {/* In-Person Benchmark Setting */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Honorario de Referencia Consulta Presencial
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Valor actual cobrado en tu consultorio físico (utilizado para el comparador de ahorro en la pasarela).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-mono">$</span>
                <input
                  type="number"
                  value={inPersonFee}
                  onChange={(e) => setInPersonFee(Number(e.target.value))}
                  className="w-32 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleSaveConsultFee}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Guardar
                </button>
              </div>
            </div>

            {/* Modules Pricing Table */}
            <div className="overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">
                  Lista de Módulos & Aranceles por Contenido
                </h4>
                <span className="text-xs text-slate-400">
                  {modules.length} programas médicos configurados
                </span>
              </div>

              <div className="divide-y divide-slate-800">
                {modules.map((m) => (
                  <div key={m.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.thumbnailUrl}
                        alt={m.title}
                        className="w-14 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800">
                            {m.condition}
                          </span>
                          <span className="text-xs text-slate-400">
                            {m.contentType} • {m.episodesCount} episodios
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white mt-0.5">{m.title}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">$</span>
                        <input
                          type="number"
                          step="1000"
                          value={editingPrices[m.id] ?? m.priceArs}
                          onChange={(e) => setEditingPrices(prev => ({ ...prev, [m.id]: Number(e.target.value) }))}
                          className="w-32 bg-slate-950 border border-slate-700 rounded-xl pl-6 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 font-bold"
                        />
                      </div>
                      <button
                        onClick={() => handleSavePrice(m.id)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold text-xs transition-colors flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Guardar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VIDEOS & EPISODES MANAGER */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            {/* Left Column: Module Selection & Episode Reorder */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <label className="block text-xs font-bold uppercase text-slate-300">
                  Selecciona el Módulo a Administrar:
                </label>
                <select
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.condition}] {m.title} ({m.episodes.length} episodios)
                    </option>
                  ))}
                </select>
              </div>

              {/* Episodes List with Move Up/Down Controls */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Orden Secuencial de la Playlist ({currentModule.episodes.length} clases)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Usa las flechas ▲ ▼ para cambiar la secuencia en la que los padres ven las clases.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {currentModule.episodes.map((ep, index) => (
                    <div
                      key={ep.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center font-bold text-xs text-cyan-300 shrink-0">
                          {ep.episodeNumber}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-white truncate">{ep.title}</div>
                          <div className="text-[10px] text-slate-400">{ep.durationMinutes} min • {ep.chapters.length} capítulos</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          disabled={index === 0}
                          onClick={() => reorderEpisode(currentModule.id, index, 'up')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Mover arriba"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={index === currentModule.episodes.length - 1}
                          onClick={() => reorderEpisode(currentModule.id, index, 'down')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Mover abajo"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEpisode(currentModule.id, ep.id)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 transition-colors ml-1"
                          title="Eliminar episodio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Add New Episode Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleAddEpisodeSubmit} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
                  <Plus className="w-4 h-4" />
                  Cargar Nueva Clase o Episodio
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Título de la Clase Médica:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Intervenciones conductuales en la cena familiar"
                    value={newEpTitle}
                    onChange={(e) => setNewEpTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Duración (minutos):
                    </label>
                    <input
                      type="number"
                      required
                      min={5}
                      max={180}
                      value={newEpDuration}
                      onChange={(e) => setNewEpDuration(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Servidor CDN / Video:
                    </label>
                    <select
                      value={newEpUrl}
                      onChange={(e) => setNewEpUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4">CDN Servidor 1 (HD)</option>
                      <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4">CDN Servidor 2 (4K)</option>
                      <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4">Vimeo Pro Privado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sinopsis Clínica para los Padres:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Qué aprenderá la familia en este video..."
                    value={newEpSynopsis}
                    onChange={(e) => setNewEpSynopsis(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Publicar Episodio en este Módulo
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: MATERIALS & PDF UPLOAD */}
        {activeTab === 'materials' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            {/* Left: Attached PDFs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <label className="block text-xs font-bold uppercase text-slate-300">
                  Selecciona el Módulo:
                </label>
                <select
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.condition}] {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
                <h4 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
                  Guías y Documentos Actualmente Vinculados
                </h4>

                <div className="space-y-2">
                  {currentModule.episodes.flatMap(e => e.resources || []).length > 0 ? (
                    currentModule.episodes.flatMap(e => e.resources || []).map((res, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{res.title}</div>
                            <div className="text-[10px] text-slate-400 uppercase">{res.type} • {res.size}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => deletePdfResource(currentModule.id, currentModule.episodes[0].id, res.title)}
                          className="p-1.5 text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="Eliminar PDF"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No hay PDFs adjuntos aún en este módulo. Usa el panel de la derecha para cargar uno.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Upload New PDF */}
            <div className="lg:col-span-5">
              <form onSubmit={handleAddPdfSubmit} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
                  <Upload className="w-4 h-4" />
                  Subir Nueva Guía o PDF Clínico
                </div>

                {/* Simulated Drag & Drop Zone */}
                <div className="p-6 rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/80 bg-slate-950 text-center cursor-pointer transition-colors">
                  <FileText className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-xs font-bold text-white">Haz clic o arrastra un archivo PDF</div>
                  <div className="text-[10px] text-slate-400 mt-1">Soporta .PDF, .DOCX hasta 25 MB</div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre del Documento para los Padres:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Guía de Adecuaciones Escolares para Docentes (PDF)"
                    value={resTitle}
                    onChange={(e) => setResTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tipo de Archivo:
                    </label>
                    <select
                      value={resType}
                      onChange={(e) => setResType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="pdf">Guía Clínica (PDF)</option>
                      <option value="checklist">Checklist Imprimible</option>
                      <option value="guide">Modelo de Informe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tamaño Estimado:
                    </label>
                    <input
                      type="text"
                      value={resSize}
                      onChange={(e) => setResSize(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Adjuntar Recurso al Módulo
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
