import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { ENV } from '@/shared/config/env.config';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const isMockAuth = ENV.AUTH_MODE === 'mock' && !ENV.IS_PRODUCTION;
  const [email, setEmail] = useState(isMockAuth ? ENV.TEST_USER_EMAIL : '');
  const [password, setPassword] = useState(isMockAuth ? ENV.TEST_USER_PASSWORD : '');

  const from = (location.state as LocationState | null)?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();
    await login({ email, password });
    navigate(from, { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white md:grid md:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden bg-[radial-gradient(circle_at_top_left,_#fb923c,_transparent_32%),linear-gradient(135deg,_#111827,_#020617)] p-10 md:flex md:flex-col md:justify-between">
        <div className="flex items-center gap-3 text-orange-100">
          <div className="rounded-2xl bg-white/10 p-3">
            <Store size={28} />
          </div>
          <span className="text-xl font-bold">MesoQuick Empresas</span>
        </div>
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-orange-200">Panel comercial</p>
          <h1 className="text-5xl font-bold leading-tight">Gestiona tu negocio en un solo lugar.</h1>
          <p className="mt-6 text-lg text-slate-300">
            Administra tus productos, horarios y pedidos de forma simple desde tu cuenta.
          </p>
        </div>
        <p className="text-sm text-slate-400">MesoQuick Empresas</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-slate-900 shadow-2xl">
          <div className="mb-8 md:hidden">
            <div className="mb-4 inline-flex rounded-2xl bg-orange-100 p-3 text-primary">
              <Store size={28} />
            </div>
            <h1 className="text-2xl font-bold">MesoQuick Empresas</h1>
          </div>

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Ingreso</p>
            <h2 className="mt-2 text-3xl font-bold">Inicia sesión</h2>
            <p className="mt-2 text-sm text-slate-500">
              {isMockAuth ? `Modo desarrollo: usa ${ENV.TEST_USER_EMAIL} / ${ENV.TEST_USER_PASSWORD}` : 'Usa el correo y contraseña registrados en el broker.'}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Correo</span>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-orange-100"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Contraseña</span>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-orange-100"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <button
              className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Ingresando...' : 'Entrar al panel'}
            </button>
          </form>

          {isMockAuth && (
            <button
              className="mt-3 w-full rounded-xl border border-orange-200 px-4 py-3 font-bold text-primary transition hover:bg-orange-50"
              type="button"
              onClick={() => {
                setEmail(ENV.TEST_USER_EMAIL);
                setPassword(ENV.TEST_USER_PASSWORD);
              }}
            >
              Usar credenciales de prueba
            </button>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Aún no tienes cuenta?{' '}
            <Link className="font-bold text-primary hover:text-primary-dark" to="/register">
              Registra tu negocio
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};
