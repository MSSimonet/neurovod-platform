import React, { useState } from 'react';
import { usePlatform, UserRole } from '../context/PlatformContext';
import { Modal } from './ui/Modal';
import { Eye, EyeOff, LogOut } from 'lucide-react';

const DEMO_ROLES: { role: Exclude<UserRole, 'Médico / Administrador'>; label: string }[] = [
  { role: 'Padre / Madre', label: 'Familia' },
  { role: 'Docente', label: 'Docente' },
  { role: 'Terapeuta', label: 'Terapeuta' },
];

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, user, login, logout, purchasedModuleIds } =
    usePlatform();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Padre / Madre');

  if (!isAuthModalOpen) return null;

  const close = () => setIsAuthModalOpen(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login(role);
  };

  /* ---------------- Sesión activa ---------------- */
  if (user) {
    return (
      <Modal onClose={close} labelledBy="perfil" width="sm">
        <div className="p-8">
          <p className="kicker">Sesión activa</p>

          <div className="mt-5 flex items-center gap-4 border-y border-rule py-5">
            <img
              src={user.avatarUrl}
              alt=""
              className="w-14 h-14 rounded-xs object-cover border border-rule"
            />
            <div className="min-w-0">
              <h2 id="perfil" className="text-xl leading-tight">{user.name}</h2>
              <p className="text-[13px] text-ink-secondary">{user.role}</p>
              <p className="tabular text-2xs text-ink-muted truncate">{user.email}</p>
            </div>
          </div>

          {user.childProfile && (
            <div className="mt-5">
              <p className="label">Paciente asociado</p>
              <p className="text-[13px] leading-relaxed text-ink-secondary">{user.childProfile}</p>
            </div>
          )}

          <dl className="mt-5 flex items-baseline justify-between border-t border-rule pt-4 text-[13px]">
            <dt className="text-ink-secondary">Módulos habilitados</dt>
            <dd className="tabular text-ink">{purchasedModuleIds.length}</dd>
          </dl>

          <div className="mt-6">
            <p className="label">Cambiar de perfil</p>
            <div className="rule-grid grid-cols-3">
              {DEMO_ROLES.map((option) => (
                <button
                  key={option.role}
                  onClick={() => login(option.role)}
                  className={`rule-cell py-3 text-[13px] transition-colors ${
                    user.role === option.role
                      ? 'bg-accent-surface text-accent font-semibold'
                      : 'text-ink-secondary hover:bg-subtle'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button onClick={close} className="btn btn-primary flex-1 py-3">
              Seguir en la plataforma
            </button>
            <button onClick={logout} className="btn btn-secondary py-3">
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              Salir
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  /* ---------------- Ingreso y alta ---------------- */
  return (
    <Modal onClose={close} labelledBy="acceso" width="sm">
      <form onSubmit={handleSubmit} className="p-8">
        <p className="kicker">Acceso a la plataforma</p>
        <h2 id="acceso" className="mt-2 text-3xl leading-tight">
          {mode === 'login' ? 'Ingresá a tu cuenta' : 'Creá tu cuenta familiar'}
        </h2>

        <div className="mt-6 flex border-b border-rule">
          {(['login', 'register'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                mode === value
                  ? 'border-accent text-accent'
                  : 'border-transparent text-ink-secondary hover:text-ink'
              }`}
            >
              {value === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="label" htmlFor="auth-name">Nombre y apellido</label>
              <input
                id="auth-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field"
              />
            </div>
          )}

          <div>
            <label className="label" htmlFor="auth-email">Correo electrónico</label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="familia@ejemplo.com"
              className="field"
            />
          </div>

          <div>
            <label className="label" htmlFor="auth-password">Contraseña</label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="auth-role">Tu vínculo con el paciente</label>
            <select
              id="auth-role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="field"
            >
              <option value="Padre / Madre">Madre, padre o tutor legal</option>
              <option value="Docente">Docente o equipo de orientación escolar</option>
              <option value="Terapeuta">Terapeuta ocupacional o psicopedagogía</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full mt-6 py-3">
          {mode === 'login' ? 'Ingresar' : 'Crear la cuenta'}
        </button>

        <div className="mt-6 border-t border-rule pt-4">
          <p className="label">Acceso rápido para la demostración</p>
          <div className="rule-grid grid-cols-3">
            {DEMO_ROLES.map((option) => (
              <button
                key={option.role}
                type="button"
                onClick={() => login(option.role)}
                className="rule-cell py-2.5 text-[13px] text-ink-secondary hover:bg-subtle transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};
