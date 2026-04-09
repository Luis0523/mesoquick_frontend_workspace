import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Edit, Trash2, Clock, Power } from 'lucide-react';
import { useScheduleStore } from '@/features/manage-schedule/model/useScheduleStore';
import { 
  DayOfWeek, 
  DAY_NAMES, 
  formatTime,
  type Schedule
} from '@/entities/schedule/model/types';
import { getCurrentRestaurantId } from '@/shared/mocks/mockAuth';

export const SchedulePage = () => {
  const restaurantId = getCurrentRestaurantId();
  const { schedules, isLoading, error, fetchSchedules, createSchedule, updateSchedule, deleteSchedule, toggleActive } = useScheduleStore();
  
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    dia_semana: DayOfWeek.LUNES,
    hora_apertura: '08:00',
    hora_cierre: '22:00',
  });

  useEffect(() => {
    fetchSchedules(restaurantId, true); // Solo horarios activos
  }, []);

  // Agrupar horarios por día
  const schedulesByDay = schedules.reduce((acc, schedule) => {
    const day = schedule.dia_semana;
    if (!acc[day]) acc[day] = [];
    acc[day].push(schedule);
    return acc;
  }, {} as Record<number, Schedule[]>);

  const handleOpenModal = (day?: DayOfWeek, schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        dia_semana: schedule.dia_semana,
        hora_apertura: formatTime(schedule.hora_apertura),
        hora_cierre: formatTime(schedule.hora_cierre),
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        dia_semana: day ?? DayOfWeek.LUNES,
        hora_apertura: '08:00',
        hora_cierre: '22:00',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validación
    if (formData.hora_apertura >= formData.hora_cierre) {
      alert('La hora de cierre debe ser mayor a la hora de apertura');
      return;
    }

    try {
      if (editingSchedule) {
        await updateSchedule(restaurantId, editingSchedule.id, {
          hora_apertura: `${formData.hora_apertura}:00`,
          hora_cierre: `${formData.hora_cierre}:00`,
        });
      } else {
        await createSchedule(restaurantId, {
          dia_semana: formData.dia_semana,
          hora_apertura: `${formData.hora_apertura}:00`,
          hora_cierre: `${formData.hora_cierre}:00`,
        });
      }
      handleCloseModal();
      fetchSchedules(restaurantId, true);
    } catch (error) {
      console.error('Error al guardar horario:', error);
    }
  };

  const handleDelete = async (scheduleId: number) => {
    if (confirm('¿Eliminar este horario?')) {
      await deleteSchedule(restaurantId, scheduleId);
    }
  };

  const handleToggle = async (scheduleId: number, currentState: boolean) => {
    await toggleActive(restaurantId, scheduleId, !currentState);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Horarios de Operación</h1>
          <p className="text-gray-600 mt-1">Gestiona los horarios de tu negocio por día</p>
        </div>
      </div>

      {/* Vista Semanal */}
      <div className="space-y-4">
        {Object.values(DayOfWeek).filter(v => typeof v === 'number').map((day) => {
          const daySchedules = schedulesByDay[day as number] || [];
          
          return (
            <div key={day} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-primary">
                      {DAY_NAMES[day as DayOfWeek]}
                    </h3>
                    <button
                      onClick={() => handleOpenModal(day as DayOfWeek)}
                      className="flex items-center gap-1 text-sm text-green-base hover:text-green-bright transition-colors"
                    >
                      <Plus size={16} />
                      Agregar horario
                    </button>
                  </div>

                  {/* Horarios del día */}
                  {daySchedules.length === 0 ? (
                    <p className="text-gray-500 text-sm">Sin horarios configurados</p>
                  ) : (
                    <div className="space-y-2">
                      {daySchedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="flex items-center justify-between bg-gray-50 rounded p-3"
                        >
                          <div className="flex items-center gap-3">
                            <Clock size={18} className="text-primary" />
                            <span className="font-medium">
                              {formatTime(schedule.hora_apertura)} - {formatTime(schedule.hora_cierre)}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                schedule.activo
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {schedule.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>

                          {/* Acciones */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenModal(undefined, schedule)}
                              className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleToggle(schedule.id, schedule.activo)}
                              className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                              title={schedule.activo ? 'Desactivar' : 'Activar'}
                            >
                              <Power size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(schedule.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-primary mb-4">
              {editingSchedule ? 'Editar Horario' : 'Nuevo Horario'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Día (solo al crear) */}
              {!editingSchedule && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Día de la semana
                  </label>
                  <select
                    value={formData.dia_semana}
                    onChange={(e) =>
                      setFormData({ ...formData, dia_semana: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {Object.entries(DAY_NAMES).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Hora Apertura */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de apertura
                </label>
                <input
                  type="time"
                  value={formData.hora_apertura}
                  onChange={(e) =>
                    setFormData({ ...formData, hora_apertura: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {/* Hora Cierre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de cierre
                </label>
                <input
                  type="time"
                  value={formData.hora_cierre}
                  onChange={(e) =>
                    setFormData({ ...formData, hora_cierre: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-base hover:bg-green-bright text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {editingSchedule ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
