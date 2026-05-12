import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerRestaurant, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({
    restaurantName: '',
    description: '',
    restaurantPhone: '',
    address: '',
    firstName: '',
    lastName: '',
    email: '',
    ownerPhone: '',
    password: '',
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();
    await registerRestaurant({
      rol: 2,
      restaurant: {
        nombre: form.restaurantName,
        descripcion: form.description,
        telefono: form.restaurantPhone,
        direccion: form.address,
      },
      owner: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.ownerPhone,
        passwordRaw: form.password,
      },
    });
    navigate('/dashboard', { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#fff7ed] px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl lg:sticky lg:top-10 lg:h-[calc(100vh-5rem)]">
          <div className="mb-12 flex items-center gap-3">
            <div className="rounded-2xl bg-primary p-3">
              <Building2 size={28} />
            </div>
            <span className="text-xl font-bold">MesoQuick Empresas</span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200">Registro</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">Crea tu cuenta y empieza a gestionar tu negocio.</h1>
          <p className="mt-5 text-slate-300">
            Registra los datos principales de tu negocio para acceder al panel de administración.
          </p>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-xl md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Crear cuenta de negocio</h2>
            <p className="mt-2 text-sm text-slate-500">Completa los datos del negocio y del propietario.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <h3 className="mb-4 text-lg font-bold text-slate-900">Datos del negocio</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField label="Nombre comercial" value={form.restaurantName} onChange={(value) => updateField('restaurantName', value)} />
                <TextField label="Teléfono del negocio" value={form.restaurantPhone} onChange={(value) => updateField('restaurantPhone', value)} />
                <TextField label="Dirección" value={form.address} onChange={(value) => updateField('address', value)} className="md:col-span-2" />
                <TextArea label="Descripción" value={form.description} onChange={(value) => updateField('description', value)} className="md:col-span-2" />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-bold text-slate-900">Propietario</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField label="Nombre" value={form.firstName} onChange={(value) => updateField('firstName', value)} />
                <TextField label="Apellido" value={form.lastName} onChange={(value) => updateField('lastName', value)} />
                <TextField label="Correo" type="email" value={form.email} onChange={(value) => updateField('email', value)} />
                <TextField label="Teléfono personal" value={form.ownerPhone} onChange={(value) => updateField('ownerPhone', value)} />
                <TextField label="Contraseña" type="password" value={form.password} onChange={(value) => updateField('password', value)} className="md:col-span-2" />
              </div>
            </div>

            <button
              className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar negocio'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{' '}
            <Link className="font-bold text-primary hover:text-primary-dark" to="/login">
              Inicia sesión
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: string;
}

const TextField = ({ label, value, onChange, className = '', type = 'text' }: FieldProps) => (
  <label className={`block ${className}`}>
    <span className="text-sm font-semibold text-slate-700">{label}</span>
    <input
      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-orange-100"
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required
    />
  </label>
);

const TextArea = ({ label, value, onChange, className = '' }: FieldProps) => (
  <label className={`block ${className}`}>
    <span className="text-sm font-semibold text-slate-700">{label}</span>
    <textarea
      className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-orange-100"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required
    />
  </label>
);
