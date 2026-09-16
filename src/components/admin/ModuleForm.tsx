import React, { useEffect, useState } from 'react';
import { ConditionType, ContentType, ModuleDraft, ModuleItem, TargetAudience } from '../../types';

const CONDITIONS: ConditionType[] = ['TDAH', 'Autismo', 'Sensorial', 'General'];
const CONTENT_TYPES: ContentType[] = ['Modulo', 'Guia', 'Tip', 'Congreso'];
const AUDIENCES: TargetAudience[] = [
  'Preescolar (2-5 años)',
  'Escolar (6-12 años)',
  'Adolescentes (13-18 años)',
  'Familias y Cuidadores',
];

const EMPTY_DRAFT: ModuleDraft = {
  title: '',
  subtitle: '',
  description: '',
  condition: 'TDAH',
  contentType: 'Modulo',
  targetAudience: 'Escolar (6-12 años)',
  priceArs: 50000,
  thumbnailUrl: '',
  videoUrl: '',
  pdfTitle: '',
  pdfUrl: '',
};

const toDraft = (module: ModuleItem): ModuleDraft => ({
  title: module.title,
  subtitle: module.subtitle,
  description: module.description,
  condition: module.condition,
  contentType: module.contentType,
  targetAudience: module.targetAudience,
  priceArs: module.priceArs,
  thumbnailUrl: module.thumbnailUrl,
  videoUrl: module.episodes[0]?.videoUrl ?? '',
  pdfTitle: module.episodes[0]?.resources?.[0]?.title ?? '',
  pdfUrl: module.episodes[0]?.resources?.[0]?.downloadUrl ?? '',
});

interface ModuleFormProps {
  /** Módulo en edición. Si es null, el formulario crea uno nuevo. */
  editing: ModuleItem | null;
  onSubmit: (draft: ModuleDraft) => void;
  onCancel: () => void;
}

export const ModuleForm = ({ editing, onSubmit, onCancel }: ModuleFormProps) => {
  const [draft, setDraft] = useState<ModuleDraft>(() => (editing ? toDraft(editing) : EMPTY_DRAFT));

  useEffect(() => {
    setDraft(editing ? toDraft(editing) : EMPTY_DRAFT);
  }, [editing]);

  const set = <K extends keyof ModuleDraft>(key: K, value: ModuleDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(draft);
    if (!editing) setDraft(EMPTY_DRAFT);
  };

  return (
    <form onSubmit={handleSubmit} className="border border-rule bg-card">
      <div className="border-b border-rule px-5 py-3">
        <p className="kicker">{editing ? 'Editar programa' : 'Cargar programa nuevo'}</p>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label className="label" htmlFor="module-title">Título del programa</label>
          <input
            id="module-title"
            required
            value={draft.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Manejo integral del TDAH en la infancia"
            className="field"
          />
        </div>

        <div>
          <label className="label" htmlFor="module-subtitle">Resumen de dos líneas</label>
          <input
            id="module-subtitle"
            required
            value={draft.subtitle}
            onChange={(e) => set('subtitle', e.target.value)}
            placeholder="Qué resuelve, para qué edad y con qué material"
            className="field"
          />
        </div>

        <div>
          <label className="label" htmlFor="module-description">Objetivo clínico</label>
          <textarea
            id="module-description"
            rows={3}
            value={draft.description}
            onChange={(e) => set('description', e.target.value)}
            className="field resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="module-condition">Condición clínica</label>
            <select
              id="module-condition"
              value={draft.condition}
              onChange={(e) => set('condition', e.target.value as ConditionType)}
              className="field"
            >
              {CONDITIONS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="module-format">Formato</label>
            <select
              id="module-format"
              value={draft.contentType}
              onChange={(e) => set('contentType', e.target.value as ContentType)}
              className="field"
            >
              {CONTENT_TYPES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="module-audience">Edad del paciente</label>
            <select
              id="module-audience"
              value={draft.targetAudience}
              onChange={(e) => set('targetAudience', e.target.value as TargetAudience)}
              className="field"
            >
              {AUDIENCES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="module-price">Precio en pesos argentinos</label>
            <input
              id="module-price"
              type="number"
              min={0}
              step={1000}
              required
              value={draft.priceArs}
              onChange={(e) => set('priceArs', Number(e.target.value))}
              className="field tabular"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="module-thumb">Imagen de portada</label>
          <input
            id="module-thumb"
            type="url"
            value={draft.thumbnailUrl}
            onChange={(e) => set('thumbnailUrl', e.target.value)}
            placeholder="https://..."
            className="field"
          />
        </div>

        <div>
          <label className="label" htmlFor="module-video">
            Origen del video (HLS, Vimeo privado o YouTube oculto)
          </label>
          <input
            id="module-video"
            type="url"
            value={draft.videoUrl}
            onChange={(e) => set('videoUrl', e.target.value)}
            placeholder="https://cdn.neurovod.med.ar/clase-01/master.m3u8"
            className="field"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="module-pdf-title">Nombre de la guía en PDF</label>
            <input
              id="module-pdf-title"
              value={draft.pdfTitle}
              onChange={(e) => set('pdfTitle', e.target.value)}
              placeholder="Checklist de rutinas para el hogar"
              className="field"
            />
          </div>
          <div>
            <label className="label" htmlFor="module-pdf-url">Enlace del PDF</label>
            <input
              id="module-pdf-url"
              type="url"
              value={draft.pdfUrl}
              onChange={(e) => set('pdfUrl', e.target.value)}
              placeholder="https://..."
              className="field"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-rule px-5 py-4">
        <button type="submit" className="btn btn-primary">
          {editing ? 'Guardar cambios' : 'Publicar programa'}
        </button>
        {editing && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
};
