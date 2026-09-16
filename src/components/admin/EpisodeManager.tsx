import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { ResourceType } from '../../types';
import { ChevronUp, ChevronDown, Trash2, Plus, Link2 } from 'lucide-react';

interface EpisodeManagerProps {
  moduleId: string;
  onNotify: (message: string) => void;
}

const RESOURCE_TYPES: { value: ResourceType; label: string }[] = [
  { value: 'pdf', label: 'Guía clínica' },
  { value: 'checklist', label: 'Checklist imprimible' },
  { value: 'guide', label: 'Modelo de informe' },
];

export const EpisodeManager = ({ moduleId, onNotify }: EpisodeManagerProps) => {
  const {
    modules,
    reorderEpisode,
    addEpisode,
    deleteEpisode,
    updateEpisodeVideoUrl,
    addPdfResource,
    deletePdfResource,
  } = usePlatform();

  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState(30);
  const [newSynopsis, setNewSynopsis] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('pdf');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceEpisodeId, setResourceEpisodeId] = useState('');

  const module = modules.find((m) => m.id === moduleId);
  if (!module) return null;

  const targetEpisodeId = resourceEpisodeId || module.episodes[0]?.id || '';

  const handleAddEpisode = (event: React.FormEvent) => {
    event.preventDefault();
    addEpisode(moduleId, {
      title: newTitle,
      durationMinutes: newDuration,
      synopsis: newSynopsis,
      videoUrl: newVideoUrl,
    });
    setNewTitle('');
    setNewSynopsis('');
    setNewVideoUrl('');
    onNotify('Clase agregada al final de la playlist.');
  };

  const handleAddResource = (event: React.FormEvent) => {
    event.preventDefault();
    if (!targetEpisodeId) return;
    addPdfResource(moduleId, targetEpisodeId, {
      title: resourceTitle,
      type: resourceType,
      size: '1.2 MB',
      downloadUrl: resourceUrl,
    });
    setResourceTitle('');
    setResourceUrl('');
    onNotify('Material vinculado a la clase.');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Orden y origen de las clases */}
      <div className="xl:col-span-7">
        <div className="border border-rule bg-card">
          <div className="flex items-center justify-between border-b border-rule px-5 py-3">
            <p className="kicker">Playlist del programa</p>
            <span className="tabular text-2xs text-ink-muted">
              {String(module.episodes.length).padStart(2, '0')} CLASES
            </span>
          </div>

          <ul>
            {module.episodes.map((episode, index) => (
              <li key={episode.id} className="border-b border-rule last:border-b-0 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="tabular text-2xs text-ink-muted pt-1">
                      {String(episode.episodeNumber).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-ink truncate">{episode.title}</p>
                      <p className="tabular text-2xs text-ink-muted mt-0.5">
                        {episode.durationMinutes} MIN · {episode.chapters.length} CAPÍTULOS ·{' '}
                        {(episode.resources ?? []).length} PDF
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => reorderEpisode(moduleId, index, 'up')}
                      disabled={index === 0}
                      aria-label="Subir la clase"
                      className="btn btn-secondary px-2 py-1.5"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => reorderEpisode(moduleId, index, 'down')}
                      disabled={index === module.episodes.length - 1}
                      aria-label="Bajar la clase"
                      className="btn btn-secondary px-2 py-1.5"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        deleteEpisode(moduleId, episode.id);
                        onNotify('Clase eliminada del programa.');
                      }}
                      aria-label="Eliminar la clase"
                      className="btn btn-secondary px-2 py-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Origen del video */}
                <div className="mt-3 flex items-center gap-2">
                  <Link2 className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />
                  <input
                    value={episode.videoUrl}
                    onChange={(e) => updateEpisodeVideoUrl(moduleId, episode.id, e.target.value)}
                    aria-label={`Origen del video de la clase ${episode.episodeNumber}`}
                    className="field py-1.5 text-2xs"
                  />
                </div>

                {/* Material adjunto */}
                {(episode.resources ?? []).length > 0 && (
                  <ul className="mt-3 border-t border-rule">
                    {(episode.resources ?? []).map((resource) => (
                      <li
                        key={resource.title}
                        className="flex items-center justify-between gap-3 border-b border-rule py-2"
                      >
                        <span className="text-2xs text-ink-secondary truncate">
                          {resource.title}
                        </span>
                        <button
                          onClick={() => {
                            deletePdfResource(moduleId, episode.id, resource.title);
                            onNotify('Material desvinculado.');
                          }}
                          aria-label={`Quitar ${resource.title}`}
                          className="text-ink-muted hover:text-ink shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Alta de clase y de material */}
      <div className="xl:col-span-5 space-y-6">
        <form onSubmit={handleAddEpisode} className="border border-rule bg-card">
          <div className="border-b border-rule px-5 py-3">
            <p className="kicker">Nueva clase</p>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="label" htmlFor="ep-title">Título de la clase</label>
              <input
                id="ep-title"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Intervenciones en la mesa familiar"
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor="ep-duration">Duración en minutos</label>
              <input
                id="ep-duration"
                type="number"
                min={5}
                max={240}
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                className="field tabular"
              />
            </div>
            <div>
              <label className="label" htmlFor="ep-url">Origen del video</label>
              <input
                id="ep-url"
                type="url"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder="https://cdn.neurovod.med.ar/clase/master.m3u8"
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor="ep-synopsis">Qué va a aprender la familia</label>
              <textarea
                id="ep-synopsis"
                rows={3}
                value={newSynopsis}
                onChange={(e) => setNewSynopsis(e.target.value)}
                className="field resize-y"
              />
            </div>
          </div>
          <div className="border-t border-rule px-5 py-4">
            <button type="submit" className="btn btn-primary">
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              Publicar la clase
            </button>
          </div>
        </form>

        <form onSubmit={handleAddResource} className="border border-rule bg-card">
          <div className="border-b border-rule px-5 py-3">
            <p className="kicker">Vincular material en PDF</p>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="label" htmlFor="res-episode">Clase asociada</label>
              <select
                id="res-episode"
                value={targetEpisodeId}
                onChange={(e) => setResourceEpisodeId(e.target.value)}
                className="field"
              >
                {module.episodes.map((episode) => (
                  <option key={episode.id} value={episode.id}>
                    {String(episode.episodeNumber).padStart(2, '0')} · {episode.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="res-title">Nombre del documento</label>
              <input
                id="res-title"
                required
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                placeholder="Guía de adecuaciones escolares"
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor="res-type">Tipo de material</label>
              <select
                id="res-type"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value as ResourceType)}
                className="field"
              >
                {RESOURCE_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="res-url">Enlace del archivo</label>
              <input
                id="res-url"
                type="url"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="https://..."
                className="field"
              />
            </div>
          </div>
          <div className="border-t border-rule px-5 py-4">
            <button type="submit" className="btn btn-primary">
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              Vincular el documento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
