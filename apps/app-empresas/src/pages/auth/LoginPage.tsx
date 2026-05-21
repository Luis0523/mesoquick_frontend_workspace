import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sofa } from 'lucide-react';
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
    <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <Sofa size={32} className="text-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-primary">MesoFood</h1>
          <p className="text-gray-500 mt-1">Panel Empresarial</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Inicia sesión</h2>
            <p className="text-sm text-gray-500 mt-1">
              {isMockAuth
                ? `Modo desarrollo: usa ${ENV.TEST_USER_EMAIL}`
                : 'Usa tu correo y contraseña registrados.'}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Correo</span>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Contraseña</span>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <button
              className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Ingresando...' : 'Entrar al panel'}
            </button>
          </form>

          {isMockAuth && (
            <button
              className="mt-3 w-full rounded-xl border border-primary/20 px-4 py-3 font-bold text-primary transition hover:bg-primary/5"
              type="button"
              onClick={() => {
                setEmail(ENV.TEST_USER_EMAIL);
                setPassword(ENV.TEST_USER_PASSWORD);
              }}
            >
              Usar credenciales de prueba
            </button>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Aún no tienes cuenta?{' '}
            <Link className="font-bold text-primary hover:text-primary/80" to="/register">
              Registra tu negocio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
