import React, { useMemo, useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { ModuleDraft, ModuleItem } from '../types';
import { ModuleForm } from './admin/ModuleForm';
import { EpisodeManager } from './admin/EpisodeManager';
import { conditionTag, CONDITION_META, formatArs, formatDate } from '../lib/format';
import { leadDoctor } from '../data/catalog';
import { ArrowLeft, Pencil, Trash2, Check } from 'lucide-react';
import { imageAt } from '../lib/imageUrl';

type AdminTab = 'catalogo' | 'clases' | 'ventas';

const TABS: { value: AdminTab; label: string }[] = [
  { value: 'catalogo', label: 'Catálogo y precios' },
  { value: 'clases', label: 'Clases y material' },
  { value: 'ventas', label: 'Ventas y accesos' },
];

export const AdminDashboard = () => {
  const {
    modules,
    sales,
    navigate,
    createModule,
    updateModule,
    deleteModule,
    updateModulePrice,
    updateDoctorConsultFee,
    grantManualAccess,
    revokeAccess,
    purchasedModuleIds,
  } = usePlatform();

  const [tab, setTab] = useState<AdminTab>('catalogo');
  const [editing, setEditing] = useState<ModuleItem | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id ?? '');
  const [notice, setNotice] = useState<string | null>(null);
  const [consultFee, setConsultFee] = useState(leadDoctor.inPersonConsultFeeArs);
  const [grantEmail, setGrantEmail] = useState('');
  const [grantModuleId, setGrantModuleId] = useState(modules[0]?.id ?? '');

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3200);
  };

  const revenue = useMemo(
    () => sales.filter((s) => s.kind === 'pago').reduce((sum, s) => sum + s.amountArs, 0),
    [sales],
  );
  const scholarships = useMemo(() => sales.filter((s) => s.kind === 'beca').length, [sales]);
  const totalEpisodes = useMemo(
    () => modules.reduce((sum, mod) => sum + mod.episodes.length, 0),
    [modules],
  );

  const kpis = [
    { label: 'Facturado en ARS', value: formatArs(revenue) },
    { label: 'Operaciones', value: String(sales.length).padStart(2, '0') },
    { label: 'Programas publicados', value: String(modules.length).padStart(2, '0') },
    { label: 'Clases en video', value: String(totalEpisodes).padStart(2, '0') },
  ];

  const handleModuleSubmit = (draft: ModuleDraft) => {
    if (editing) {
      updateModule(editing.id, draft);
      setEditing(null);
      notify('Programa actualizado.');
    } else {
      createModule(draft);
      notify('Programa publicado en el catálogo.');
    }
  };

  const handleGrant = (event: React.FormEvent) => {
    event.preventDefault();
    if (!grantModuleId || !grantEmail) return;
    grantManualAccess(grantModuleId, grantEmail);
    setGrantEmail('');
    notify('Acceso otorgado y registrado como beca.');
  };

  return (
    <div className="min-h-screen bg-app flex flex-col">
      {/* Cabecera del panel */}
      <header className="sticky top-0 z-30 bg-card border-b border-rule">
        <div className="shell flex items-center justify-between gap-4 h-16">
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="font-serif text-xl leading-none text-ink">Panel médico</span>
            <span className="tabular hidden sm:inline text-2xs uppercase tracking-wider text-ink-muted truncate">
              {leadDoctor.name} · MN {leadDoctor.licenseNumber.replace(/\D/g, '')}
            </span>
          </div>

          <button onClick={() => navigate('/')} className="btn btn-secondary">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Volver al sitio
          </button>
        </div>

        <div className="shell">
          <nav className="flex gap-1 -mb-px" aria-label="Secciones del panel">
            {TABS.map((item) => (
              <button
                key={item.value}
                onClick={() => setTab(item.value)}
                className={`px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${
                  tab === item.value
                    ? 'border-accent text-accent'
                    : 'border-transparent text-ink-secondary hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {notice && (
        <div
          role="status"
          className="fixed top-20 right-6 z-40 flex items-center gap-2 border border-ok bg-ok-surface px-4 py-2.5 text-[13px] text-ink animate-rise"
        >
          <Check className="w-4 h-4 text-ok" aria-hidden="true" />
          {notice}
        </div>
      )}

      <main className="flex-1">
        <div className="shell py-8 space-y-8">
          {/* Indicadores */}
          <dl className="rule-grid grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rule-cell px-5 py-4">
                <dt className="text-2xs uppercase tracking-wider text-ink-muted">{kpi.label}</dt>
                <dd className="tabular mt-1 text-2xl text-ink">{kpi.value}</dd>
              </div>
            ))}
          </dl>

          {/* ---------- Catálogo y precios ---------- */}
          {tab === 'catalogo' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-7 space-y-6">
                <div className="border border-rule bg-card">
                  <div className="flex items-center justify-between border-b border-rule px-5 py-3">
                    <p className="kicker">Programas publicados</p>
                    <span className="tabular text-2xs text-ink-muted">
                      {String(modules.length).padStart(2, '0')} FICHAS
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[520px]">
                    <thead>
                      <tr className="border-b border-rule">
                        <th scope="col" className="text-left text-2xs font-semibold uppercase tracking-wider text-ink-muted px-5 py-2.5">Programa</th>
                        <th scope="col" className="text-left text-2xs font-semibold uppercase tracking-wider text-ink-muted px-3 py-2.5 w-40">Precio ARS</th>
                        <th scope="col" className="text-left text-2xs font-semibold uppercase tracking-wider text-ink-muted px-5 py-2.5 w-28 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modules.map((mod) => (
                        <tr key={mod.id} className="border-b border-rule last:border-b-0 align-middle">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={imageAt(mod.thumbnailUrl, 112)}
                                alt=""
                                className="w-14 aspect-[16/9] object-cover rounded-xs border border-rule shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-[13px] font-medium text-ink truncate">{mod.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={conditionTag(mod.condition)}>
                                    {CONDITION_META[mod.condition].label}
                                  </span>
                                  <span className="tabular text-2xs text-ink-muted">
                                    {mod.episodes.length} CLASES
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              step={1000}
                              min={0}
                              defaultValue={mod.priceArs}
                              onBlur={(e) => {
                                const value = Number(e.target.value);
                                if (value !== mod.priceArs) {
                                  updateModulePrice(mod.id, value);
                                  notify(`Precio actualizado a ${formatArs(value)}.`);
                                }
                              }}
                              aria-label={`Precio de ${mod.title}`}
                              className="field tabular py-1.5 min-w-[7rem]"
                            />
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setEditing(mod);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                aria-label={`Editar ${mod.title}`}
                                className="btn btn-secondary px-2 py-1.5"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  deleteModule(mod.id);
                                  notify('Programa retirado del catálogo.');
                                }}
                                aria-label={`Eliminar ${mod.title}`}
                                className="btn btn-secondary px-2 py-1.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Honorario de referencia */}
                <div className="border border-rule bg-card p-5">
                  <p className="kicker">Honorario de consulta presencial</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-secondary">
                    Se usa como referencia de comparación en la pasarela de pago.
                  </p>
                  <div className="mt-4 flex gap-2 max-w-sm">
                    <input
                      type="number"
                      step={1000}
                      min={0}
                      value={consultFee}
                      onChange={(e) => setConsultFee(Number(e.target.value))}
                      aria-label="Honorario de consulta presencial en pesos"
                      className="field tabular"
                    />
                    <button
                      onClick={() => {
                        updateDoctorConsultFee(consultFee);
                        notify(`Honorario actualizado a ${formatArs(consultFee)}.`);
                      }}
                      className="btn btn-primary"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-5">
                <ModuleForm
                  editing={editing}
                  onSubmit={handleModuleSubmit}
                  onCancel={() => setEditing(null)}
                />
              </div>
            </div>
          )}

          {/* ---------- Clases y material ---------- */}
          {tab === 'clases' && (
            <div className="space-y-5">
              <div className="max-w-md">
                <label className="label" htmlFor="admin-module">Programa a administrar</label>
                <select
                  id="admin-module"
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                  className="field"
                >
                  {modules.map((mod) => (
                    <option key={mod.id} value={mod.id}>
                      [{CONDITION_META[mod.condition].label}] {mod.title}
                    </option>
                  ))}
                </select>
              </div>

              <EpisodeManager moduleId={selectedModuleId} onNotify={notify} />
            </div>
          )}

          {/* ---------- Ventas y accesos ---------- */}
          {tab === 'ventas' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-8">
                <div className="border border-rule bg-card">
                  <div className="flex items-center justify-between border-b border-rule px-5 py-3">
                    <p className="kicker">Historial de operaciones</p>
                    <span className="tabular text-2xs text-ink-muted">
                      {scholarships} BECAS OTORGADAS
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[640px]">
                      <thead>
                        <tr className="border-b border-rule">
                          <th scope="col" className="text-left text-2xs font-semibold uppercase tracking-wider text-ink-muted px-5 py-2.5">Comprobante</th>
                          <th scope="col" className="text-left text-2xs font-semibold uppercase tracking-wider text-ink-muted px-3 py-2.5">Programa</th>
                          <th scope="col" className="text-left text-2xs font-semibold uppercase tracking-wider text-ink-muted px-3 py-2.5">Titular</th>
                          <th scope="col" className="text-left text-2xs font-semibold uppercase tracking-wider text-ink-muted px-3 py-2.5">Fecha</th>
                          <th scope="col" className="text-left text-2xs font-semibold uppercase tracking-wider text-ink-muted px-5 py-2.5 text-right">Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sales.map((sale) => (
                          <tr key={sale.id} className="border-b border-rule last:border-b-0">
                            <td className="px-5 py-3">
                              <p className="tabular text-2xs text-ink">{sale.id}</p>
                              <p className="text-2xs text-ink-muted mt-0.5">{sale.method}</p>
                            </td>
                            <td className="px-3 py-3 text-[13px] text-ink-secondary max-w-[220px] truncate">
                              {sale.moduleTitle}
                            </td>
                            <td className="px-3 py-3 text-[13px] text-ink-secondary max-w-[200px] truncate">
                              {sale.buyerEmail}
                            </td>
                            <td className="tabular px-3 py-3 text-2xs text-ink-muted whitespace-nowrap">
                              {formatDate(sale.processedAt)}
                            </td>
                            <td className="px-5 py-3 text-right">
                              {sale.kind === 'beca' ? (
                                <span className="tag tag-general">Beca</span>
                              ) : (
                                <span className="tabular text-[13px] text-ink">
                                  {formatArs(sale.amountArs)}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-4 space-y-6">
                {/* Otorgar acceso manual */}
                <form onSubmit={handleGrant} className="border border-rule bg-card">
                  <div className="border-b border-rule px-5 py-3">
                    <p className="kicker">Otorgar acceso manual</p>
                  </div>
                  <div className="p-5 space-y-4">
                    <p className="text-[13px] leading-relaxed text-ink-secondary">
                      Habilita un programa sin cobro. Queda asentado como beca en el historial.
                    </p>
                    <div>
                      <label className="label" htmlFor="grant-module">Programa</label>
                      <select
                        id="grant-module"
                        value={grantModuleId}
                        onChange={(e) => setGrantModuleId(e.target.value)}
                        className="field"
                      >
                        {modules.map((mod) => (
                          <option key={mod.id} value={mod.id}>{mod.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label" htmlFor="grant-email">Correo del paciente</label>
                      <input
                        id="grant-email"
                        type="email"
                        required
                        value={grantEmail}
                        onChange={(e) => setGrantEmail(e.target.value)}
                        placeholder="familia@ejemplo.com"
                        className="field"
                      />
                    </div>
                  </div>
                  <div className="border-t border-rule px-5 py-4">
                    <button type="submit" className="btn btn-primary">
                      Otorgar el acceso
                    </button>
                  </div>
                </form>

                {/* Accesos activos */}
                <div className="border border-rule bg-card">
                  <div className="border-b border-rule px-5 py-3">
                    <p className="kicker">Accesos habilitados</p>
                  </div>
                  <ul>
                    {purchasedModuleIds.length === 0 && (
                      <li className="px-5 py-4 text-[13px] text-ink-secondary">
                        Todavía no hay módulos habilitados.
                      </li>
                    )}
                    {purchasedModuleIds.map((id) => {
                      const mod = modules.find((m) => m.id === id);
                      if (!mod) return null;
                      return (
                        <li
                          key={id}
                          className="flex items-center justify-between gap-3 border-b border-rule last:border-b-0 px-5 py-3"
                        >
                          <span className="text-[13px] text-ink truncate">{mod.title}</span>
                          <button
                            onClick={() => {
                              revokeAccess(id);
                              notify('Acceso dado de baja.');
                            }}
                            className="btn btn-secondary px-2.5 py-1.5 text-2xs shrink-0"
                          >
                            Dar de baja
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
