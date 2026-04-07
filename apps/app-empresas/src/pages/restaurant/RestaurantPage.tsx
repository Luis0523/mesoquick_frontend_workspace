/**
 * Restaurant Page
 * Página para ver y gestionar información del restaurante
 */

import { useEffect, useState } from 'react';
import { useRestaurantStore } from '@/features/manage-restaurant/model/useRestaurantStore';
import { getCurrentRestaurantId } from '@/shared/mocks/mockAuth';
import { Edit2, Save, X, Toggle } from 'lucide-react';
import type { UpdateRestaurantDTO } from '@/entities/restaurant/model/types';

export const RestaurantPage = () => {
  const { 
    restaurant, 
    isLoading, 
    error, 
    fetchRestaurant, 
    updateRestaurant,
    toggleAvailability 
  } = useRestaurantStore();
  
  const restaurantId = getCurrentRestaurantId();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateRestaurantDTO>({});

  useEffect(() => {
    fetchRestaurant(restaurantId);
  }, [fetchRestaurant, restaurantId]);

  useEffect(() => {
    if (restaurant) {
      setFormData({
        nombre: restaurant.nombre,
        direccion: restaurant.direccion,
        telefono: restaurant.telefono,
        descripcion: restaurant.descripcion || '',
        correo: restaurant.correo || '',
        logo_url: restaurant.logo_url || '',
      });
    }
  }, [restaurant]);

  const handleSave = async () => {
    try {
      await updateRestaurant(restaurantId, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  const handleToggleAvailability = async () => {
    if (restaurant) {
      try {
        await toggleAvailability(restaurantId, !restaurant.disponible);
      } catch (error) {
        console.error('Error al cambiar disponibilidad:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (restaurant) {
      setFormData({
        nombre: restaurant.nombre,
        direccion: restaurant.direccion,
        telefono: restaurant.telefono,
        descripcion: restaurant.descripcion || '',
        correo: restaurant.correo || '',
        logo_url: restaurant.logo_url || '',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-700">No se encontró información del restaurante</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Restaurante</h1>
          <p className="text-gray-600 mt-1">
            Gestiona la información de tu negocio
          </p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
          >
            <Edit2 size={18} />
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-base text-white rounded-lg hover:bg-green-bright transition disabled:opacity-50"
            >
              <Save size={18} />
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              <X size={18} />
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Estado Operacional */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Estado Operacional
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Disponibilidad actual</p>
            <p className={`text-lg font-semibold mt-1 ${restaurant.disponible ? 'text-green-600' : 'text-red-600'}`}>
              {restaurant.disponible ? '🟢 Disponible' : '🔴 Cerrado'}
            </p>
          </div>
          <button
            onClick={handleToggleAvailability}
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 ${
              restaurant.disponible
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <Toggle size={20} />
            {restaurant.disponible ? 'Cerrar Temporalmente' : 'Abrir Restaurante'}
          </button>
        </div>
      </div>

      {/* Información General */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Información General
        </h2>
        
        {!isEditing ? (
          // Modo Vista
          <div className="space-y-4">
            <Field label="Nombre" value={restaurant.nombre} />
            <Field label="Dirección" value={restaurant.direccion} />
            <Field label="Teléfono" value={restaurant.telefono} />
            <Field label="Correo" value={restaurant.correo || 'No especificado'} />
            <Field label="Descripción" value={restaurant.descripcion || 'No especificado'} />
            <Field label="Logo URL" value={restaurant.logo_url || 'No especificado'} />
          </div>
        ) : (
          // Modo Edición
          <div className="space-y-4">
            <InputField
              label="Nombre *"
              value={formData.nombre || ''}
              onChange={(value) => setFormData({ ...formData, nombre: value })}
              placeholder="Nombre del restaurante"
            />
            <InputField
              label="Dirección *"
              value={formData.direccion || ''}
              onChange={(value) => setFormData({ ...formData, direccion: value })}
              placeholder="Dirección completa"
            />
            <InputField
              label="Teléfono *"
              value={formData.telefono || ''}
              onChange={(value) => setFormData({ ...formData, telefono: value })}
              placeholder="+502 1234-5678"
            />
            <InputField
              label="Correo"
              value={formData.correo || ''}
              onChange={(value) => setFormData({ ...formData, correo: value })}
              placeholder="contacto@restaurante.com"
              type="email"
            />
            <TextAreaField
              label="Descripción"
              value={formData.descripcion || ''}
              onChange={(value) => setFormData({ ...formData, descripcion: value })}
              placeholder="Describe tu restaurante..."
            />
            <InputField
              label="Logo URL"
              value={formData.logo_url || ''}
              onChange={(value) => setFormData({ ...formData, logo_url: value })}
              placeholder="https://ejemplo.com/logo.png"
              type="url"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Componentes auxiliares
interface FieldProps {
  label: string;
  value: string;
}

const Field = ({ label, value }: FieldProps) => (
  <div>
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <p className="text-gray-900 mt-1">{value}</p>
  </div>
);

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

const InputField = ({ label, value, onChange, placeholder, type = 'text' }: InputFieldProps) => (
  <div>
    <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
    />
  </div>
);

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextAreaField = ({ label, value, onChange, placeholder }: TextAreaFieldProps) => (
  <div>
    <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
    />
  </div>
);
