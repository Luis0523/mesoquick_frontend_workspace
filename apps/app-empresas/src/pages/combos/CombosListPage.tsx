import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Power } from 'lucide-react';
import { useCombosStore } from '@/features/manage-combos/model/useCombosStore';
import { formatComboPrice, COMBO_TYPE_LABELS, ComboType } from '@/entities/combo/model/types';

export const CombosListPage = () => {
  const navigate = useNavigate();
  const { combos, isLoading, error, fetchCombos, deleteCombo, toggleActive } = useCombosStore();

  useEffect(() => {
    fetchCombos();
  }, [fetchCombos]);

  const handleDelete = async (comboId: number) => {
    if (confirm('¿Eliminar este combo?')) {
      await deleteCombo(comboId);
    }
  };

  const handleToggleActive = async (comboId: number, currentState: boolean) => {
    await toggleActive(comboId, !currentState);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-primary">Combos</h1>
        <button
          onClick={() => navigate('/combos/new')}
          className="flex items-center gap-2 bg-green-base hover:bg-green-bright text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nuevo Combo
        </button>
      </div>

      {combos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">No hay combos registrados</p>
          <button
            onClick={() => navigate('/combos/new')}
            className="text-green-base hover:underline"
          >
            Crear primer combo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">{combo.nombre}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {COMBO_TYPE_LABELS[combo.tipo_combo_id as ComboType] || `Tipo ${combo.tipo_combo_id}`}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      combo.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {combo.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {combo.descripcion && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{combo.descripcion}</p>
                )}

                <p className="text-xl font-bold text-green-base mb-3">
                  {formatComboPrice(combo.precio)}
                </p>

                {combo.productos && combo.productos.length > 0 && (
                  <div className="border-t pt-3 mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Productos incluidos</p>
                    <ul className="space-y-1">
                      {combo.productos.map((p, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-gray-400 font-mono">x{p.cantidad}</span>
                          <span>{p.nombre || `Producto #${p.producto_id}`}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => navigate(`/combos/${combo.id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-1 bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleActive(combo.id, combo.activo)}
                    className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded transition-colors"
                    title={combo.activo ? 'Desactivar' : 'Activar'}
                  >
                    <Power size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(combo.id)}
                    className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
