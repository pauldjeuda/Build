import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../../layouts/AuthLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { loginSuccess } from '../store/authSlice';

const DEMO_USERS = {
  'dg@buildpro.cm':   { name: 'Directeur Général',    role: 'dg',           token: 'demo-dg'   },
  'daf@buildpro.cm':  { name: 'Dir. Administrative',  role: 'daf',          token: 'demo-daf'  },
  'cdt@buildpro.cm':  { name: 'Chef de Travaux',       role: 'cdt',          token: 'demo-cdt'  },
  'chef@buildpro.cm': { name: 'Chef Chantier',         role: 'chef_chantier',token: 'demo-chef' },
};

export default function LoginPage() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const user = DEMO_USERS[email.toLowerCase()];
    if (user && password === 'buildpro2025') {
      dispatch(loginSuccess({ email, ...user }));
      toast.success(`Bienvenue, ${user.name} !`);
      navigate('/dashboard/dg');
    } else {
      toast.error('Identifiants incorrects');
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Connexion</h2>
        <p className="text-sm text-slate-500">Accédez à votre espace de gestion</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Adresse email"
          type="email"
          placeholder="vous@buildpro.cm"
          icon={<Mail size={15} />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email requis',
            pattern:  { value: /\S+@\S+\.\S+/, message: 'Email invalide' },
          })}
        />

        <div>
          <Input
            label="Mot de passe"
            type={showPwd ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<Lock size={15} />}
            suffix={
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            }
            error={errors.password?.message}
            {...register('password', { required: 'Mot de passe requis' })}
          />
        </div>

        <Button type="submit" loading={loading} className="w-full !py-3 mt-2 text-sm">
          Se connecter
        </Button>
      </form>

      {/* Demo accounts */}
      <div className="mt-6 rounded-2xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Comptes démo — mot de passe : <code className="font-mono text-primary-600">buildpro2025</code>
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {Object.entries(DEMO_USERS).map(([email, u]) => (
            <button
              key={email}
              type="button"
              onClick={() => {
                document.querySelector('input[type="email"]').value = email;
                document.querySelector('input[name="email"]').value = email;
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors text-left group"
            >
              <div>
                <p className="text-xs font-semibold text-slate-700">{u.name}</p>
                <p className="text-xs text-slate-400 font-mono">{email}</p>
              </div>
              <span className="text-xs text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Utiliser →
              </span>
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
