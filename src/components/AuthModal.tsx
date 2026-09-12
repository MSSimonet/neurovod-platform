import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import {
  X, Mail, Lock, Eye, EyeOff, User, Sparkles, ShieldCheck,
  CheckCircle2, ArrowRight, MessageSquare, GraduationCap, HeartHandshake
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, user, login, logout } = usePlatform();
  const [tab, setTab] = useState<'login' | 'register' | 'profiles'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('carolina.gomez@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Carolina Gómez');
  const [selectedRole, setSelectedRole] = useState<'Padre / Madre' | 'Docente' | 'Terapeuta'>('Padre / Madre');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
  };

  const handleQuickDemoLogin = (role: 'Padre / Madre' | 'Docente' | 'Terapeuta') => {
    login(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-[#0F172A] rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl shadow-cyan-950/40 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Cerrar ventana de autenticación"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="pt-8 pb-4 px-6 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Portal Médico Seguro
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            NEURO<span className="text-cyan-400">VOD</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Acceso exclusivo a módulos médicos y psicoeducación en neurodesarrollo
          </p>
        </div>

        {/* User Currently Logged In View */}
        {user ? (
          <div className="p-6 space-y-6">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500 shadow-md"
              />
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  {user.name}
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xs font-semibold text-cyan-300">{user.role}</div>
                <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{user.email}</div>
              </div>
            </div>

            {user.childProfile && (
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-900/50 text-xs text-cyan-200 space-y-1">
                <span className="font-bold text-cyan-300">Perfil del Paciente Asociado:</span>
                <p className="text-slate-300">{user.childProfile}</p>
              </div>
            )}

            {/* Profile Switcher (Netflix style) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Cambiar Perfil de Acceso (Modo Demo):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleQuickDemoLogin('Padre / Madre')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    user.role === 'Padre / Madre'
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <User className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                  <span className="text-[11px] block">Familia</span>
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('Docente')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    user.role === 'Docente'
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 mx-auto mb-1 text-teal-400" />
                  <span className="text-[11px] block">Docente</span>
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('Terapeuta')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    user.role === 'Terapeuta'
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                  <span className="text-[11px] block">Terapeuta</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Continuar en la Plataforma
              </button>
              <button
                onClick={logout}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        ) : (
          /* Login & Register Tabs */
          <div className="p-6 space-y-5">
            {/* Tabs */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  tab === 'login'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  tab === 'register'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Crear Cuenta Familiar
              </button>
            </div>

            {/* Quick 1-Click Demo Logins Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/40 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Prueba Rápida de Presentación (1 Clic):
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                  DEMO
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickDemoLogin('Padre / Madre')}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-slate-200 text-[11px] font-semibold transition-colors text-center"
                >
                  Padre de Familia
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('Docente')}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-slate-200 text-[11px] font-semibold transition-colors text-center"
                >
                  Docente Escolar
                </button>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre Completo:
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Carolina Gómez"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="familia@ejemplo.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Contraseña:
                  </label>
                  {tab === 'login' && (
                    <a href="#" className="text-[11px] text-cyan-400 hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Rol / Vínculo:
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Padre / Madre">Padre, Madre o Tutor Legal</option>
                    <option value="Docente">Docente / Equipo de Orientación Escolar</option>
                    <option value="Terapeuta">Terapeuta Ocupacional / Psicopedagogo</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:opacity-95 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
              >
                {tab === 'login' ? 'Entrar a la Plataforma' : 'Crear Cuenta y Comenzar'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Alternative Direct Logins */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2 text-center">
              <p className="text-[11px] text-slate-500">O accede directamente con:</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('Padre / Madre')}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('Padre / Madre')}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
