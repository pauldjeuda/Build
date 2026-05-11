import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthLayout from '../../../layouts/AuthLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { loginSuccess } from '../store/authSlice';
import { getDashboardPath, getRoleLabel } from '../../../utils/permissions';
import { authService } from '../../../services/auth.service';

// §10 — Les 7 rôles MVP + démo
const CREDENTIALS = {
  'dg@buildpro.cm':  { name: 'Directeur Général',      role: 'dg',  token: 'demo-dg'  },
  'daf@buildpro.cm': { name: 'Aminata Diallo',          role: 'daf', token: 'demo-daf' },
  'cdt@buildpro.cm': { name: 'Jean-Marc Mbarga',        role: 'cdt', token: 'demo-cdt' },
  'cdc@buildpro.cm': { name: 'Paul Ngono',              role: 'cdc', token: 'demo-cdc' },
  'gst@buildpro.cm': { name: 'Serge Atangana',          role: 'gst', token: 'demo-gst' },
  'log@buildpro.cm': { name: 'Alice Tchouateu',         role: 'log', token: 'demo-log' },
  'hse@buildpro.cm': { name: 'Bertrand Mfou',           role: 'hse', token: 'demo-hse' },
};

const ROLE_COLORS = {
  dg:  'bg-primary-500',
  daf: 'bg-gold-500',
  cdt: 'bg-emerald-500',
  cdc: 'bg-orange-500',
  gst: 'bg-violet-500',
  log: 'bg-cyan-500',
  hse: 'bg-red-500',
};

const DEMO_USERS = Object.entries(CREDENTIALS).map(([email, u]) => ({
  email,
  ...u,
  color: ROLE_COLORS[u.role],
  roleLabel: getRoleLabel(u.role),
}));

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading,  setLoading]  = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      // Try real API first
      const res = await authService.login({ email: email.toLowerCase(), password });
      const { token, user } = res.data ?? res;
      dispatch(loginSuccess({ ...user, token }));
      toast.success(`Bienvenue, ${user.name} !`);
      navigate(getDashboardPath(user.role));
    } catch {
      // Fallback to demo mode when backend is not running
      const cred = CREDENTIALS[email.toLowerCase()];
      if (cred && (password === 'password123' || password === 'buildpro2025')) {
        dispatch(loginSuccess({ email, ...cred }));
        toast.success(`Bienvenue, ${cred.name} ! (mode démo)`);
        navigate(getDashboardPath(cred.role));
      } else {
        toast.error('Identifiants incorrects');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (u) => {
    setValue('email', u.email);
    setValue('password', 'password123');
  };

  return (
    <AuthLayout>
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-5 bg-gold-500" />
          <span className="font-display text-gold-600 text-[10px] font-bold uppercase tracking-widest">Espace sécurisé</span>
        </div>
        <h2 className="font-display text-2xl font-black text-obsidian-900 tracking-tight mb-1.5">Connexion</h2>
        <p className="font-sans text-sm text-obsidian-400">Accédez à votre espace de gestion BTP</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          id="email" label="Adresse email" type="email"
          placeholder="vous@buildpro.cm"
          icon={<Mail size={14} className="text-obsidian-300" />}
          error={errors.email?.message}
          autoComplete="email"
          {...register('email', {
            required: 'Email requis',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Email invalide' },
          })}
        />
        <Input
          id="password" label="Mot de passe"
          type={showPwd ? 'text' : 'password'}
          placeholder="••••••••"
          icon={<Lock size={14} className="text-obsidian-300" />}
          autoComplete="current-password"
          suffix={
            <button type="button" onClick={() => setShowPwd((v) => !v)}
              className="text-obsidian-300 hover:text-obsidian-600 transition-colors" tabIndex={-1}>
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          }
          error={errors.password?.message}
          {...register('password', { required: 'Mot de passe requis' })}
        />
        <Button type="submit" loading={loading} iconRight={!loading && <ArrowRight size={15} />} className="w-full !py-3 text-sm mt-1">
          Se connecter
        </Button>
      </form>

      {/* §10 — Les 7 comptes démo */}
      <div className="mt-6 rounded-2xl border border-[#E8E2D9] overflow-hidden">
        <div className="bg-canvas px-4 py-2.5" style={{ borderBottom: '1px solid #E8E2D9' }}>
          <p className="font-display text-[10px] font-semibold text-obsidian-400 uppercase tracking-widest">
            7 rôles MVP · <code className="font-mono text-gold-600 normal-case">password123</code>
          </p>
        </div>
        <div className="divide-y divide-[#F4F1EB] max-h-72 overflow-y-auto">
          {DEMO_USERS.map((u) => (
            <button
              key={u.email} type="button" onClick={() => fillDemo(u)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-canvas transition-colors text-left group"
            >
              <div className={`w-7 h-7 rounded-lg ${u.color} flex items-center justify-center shrink-0`}>
                <span className="font-display font-bold text-white text-xs">{u.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-xs font-semibold text-obsidian-800">{u.name}</p>
                <p className="font-mono text-[10px] text-obsidian-400 truncate">{u.roleLabel}</p>
              </div>
              <ArrowRight size={13} className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
