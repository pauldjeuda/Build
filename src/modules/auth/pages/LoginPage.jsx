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

const DEMO_USERS = [
  { email: 'dg@buildpro.cm',   name: 'Directeur Général',   role: 'dg',           color: 'bg-primary-500' },
  { email: 'daf@buildpro.cm',  name: 'Dir. Administrative', role: 'daf',          color: 'bg-gold-500'    },
  { email: 'cdt@buildpro.cm',  name: 'Chef de Travaux',     role: 'cdt',          color: 'bg-emerald-500' },
  { email: 'chef@buildpro.cm', name: 'Chef Chantier',       role: 'chef_chantier',color: 'bg-orange-500'  },
];

const CREDENTIALS = {
  'dg@buildpro.cm':   { name: 'Directeur Général',   role: 'dg',           token: 'demo-dg'   },
  'daf@buildpro.cm':  { name: 'Dir. Administrative', role: 'daf',          token: 'demo-daf'  },
  'cdt@buildpro.cm':  { name: 'Chef de Travaux',     role: 'cdt',          token: 'demo-cdt'  },
  'chef@buildpro.cm': { name: 'Chef Chantier',       role: 'chef_chantier',token: 'demo-chef' },
};

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading,  setLoading]  = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 650));
    const user = CREDENTIALS[email.toLowerCase()];
    if (user && password === 'buildpro2025') {
      dispatch(loginSuccess({ email, ...user }));
      toast.success(`Bienvenue, ${user.name} !`);
      navigate('/dashboard/dg');
    } else {
      toast.error('Identifiants incorrects');
    }
    setLoading(false);
  };

  const fillDemo = (u) => {
    setValue('email', u.email);
    setValue('password', 'buildpro2025');
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-5 bg-gold-500" />
          <span className="font-display text-gold-600 text-[10px] font-bold uppercase tracking-widest">Espace sécurisé</span>
        </div>
        <h2 className="font-display text-2xl font-black text-obsidian-900 tracking-tight mb-1.5">
          Connexion
        </h2>
        <p className="font-sans text-sm text-obsidian-400">Accédez à votre espace de gestion BTP</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          id="email"
          label="Adresse email"
          type="email"
          placeholder="vous@buildpro.cm"
          icon={<Mail size={14} className="text-obsidian-300" />}
          error={errors.email?.message}
          autoComplete="email"
          {...register('email', {
            required: 'Email requis',
            pattern:  { value: /\S+@\S+\.\S+/, message: 'Email invalide' },
          })}
        />

        <Input
          id="password"
          label="Mot de passe"
          type={showPwd ? 'text' : 'password'}
          placeholder="••••••••"
          icon={<Lock size={14} className="text-obsidian-300" />}
          autoComplete="current-password"
          suffix={
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="text-obsidian-300 hover:text-obsidian-600 transition-colors"
              tabIndex={-1}
              aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          }
          error={errors.password?.message}
          {...register('password', { required: 'Mot de passe requis' })}
        />

        <Button
          type="submit"
          loading={loading}
          iconRight={!loading && <ArrowRight size={15} />}
          className="w-full !py-3 text-sm mt-1"
        >
          Se connecter
        </Button>
      </form>

      {/* Demo accounts */}
      <div className="mt-6 rounded-2xl border border-[#E8E2D9] overflow-hidden">
        <div className="bg-canvas px-4 py-2.5" style={{ borderBottom: '1px solid #E8E2D9' }}>
          <p className="font-display text-[10px] font-semibold text-obsidian-400 uppercase tracking-widest">
            Comptes démo · <code className="font-mono text-gold-600 normal-case">buildpro2025</code>
          </p>
        </div>
        <div className="divide-y divide-[#F4F1EB]">
          {DEMO_USERS.map((u) => (
            <button
              key={u.email}
              type="button"
              onClick={() => fillDemo(u)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-canvas transition-colors text-left group"
            >
              <div className={`w-7 h-7 rounded-lg ${u.color} flex items-center justify-center shrink-0`}>
                <span className="font-display font-bold text-white text-xs">{u.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-xs font-semibold text-obsidian-800">{u.name}</p>
                <p className="font-mono text-[10px] text-obsidian-400 truncate">{u.email}</p>
              </div>
              <ArrowRight
                size={13}
                className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              />
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
