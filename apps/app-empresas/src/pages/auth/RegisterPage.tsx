import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Sofa } from 'lucide-react';
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
    <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <Sofa size={32} className="text-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-primary">MesoFood</h1>
          <p className="text-gray-500 mt-1">Crea tu cuenta empresarial</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Registrar negocio</h2>
            <p className="text-sm text-gray-500 mt-1">Completa los datos del negocio y del propietario.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <h3 className="mb-4 text-lg font-bold text-primary flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full inline-block" />
                Datos del negocio
              </h3>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField label="Nombre comercial" value={form.restaurantName} onChange={(value) => updateField('restaurantName', value)} />
                <TextField label="Teléfono del negocio" value={form.restaurantPhone} onChange={(value) => updateField('restaurantPhone', value)} />
                <TextField label="Dirección" value={form.address} onChange={(value) => updateField('address', value)} className="md:col-span-2" />
                <TextArea label="Descripción" value={form.description} onChange={(value) => updateField('description', value)} className="md:col-span-2" />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-bold text-primary flex items-center gap-2">
                <span className="w-1.5 h-6 bg-tertiary rounded-full inline-block" />
                Propietario
              </h3>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField label="Nombre" value={form.firstName} onChange={(value) => updateField('firstName', value)} />
                <TextField label="Apellido" value={form.lastName} onChange={(value) => updateField('lastName', value)} />
                <TextField label="Correo" type="email" value={form.email} onChange={(value) => updateField('email', value)} />
                <TextField label="Teléfono personal" value={form.ownerPhone} onChange={(value) => updateField('ownerPhone', value)} />
                <TextField label="Contraseña" type="password" value={form.password} onChange={(value) => updateField('password', value)} className="md:col-span-2" />
              </div>
            </div>

            <button
              className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar negocio'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link className="font-bold text-primary hover:text-primary/80" to="/login">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
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
    <span className="text-sm font-semibold text-gray-700">{label}</span>
    <input
      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required
    />
  </label>
);

const TextArea = ({ label, value, onChange, className = '' }: FieldProps) => (
  <label className={`block ${className}`}>
    <span className="text-sm font-semibold text-gray-700">{label}</span>
    <textarea
      className="mt-2 min-h-28 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required
    />
  </label>
);
