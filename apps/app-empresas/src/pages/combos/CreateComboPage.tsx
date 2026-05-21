import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useCombosStore } from '@/features/manage-combos/model/useCombosStore';
import { useProductsStore } from '@/features/manage-products/model/useProductsStore';
import { ComboType, COMBO_TYPE_LABELS, toCents } from '@/entities/combo/model/types';
import { getCommerceContext } from '@/shared/business/businessContext';

export const CreateComboPage = () => {
  const navigate = useNavigate();
  const restaurantId = getCommerceContext().id;
  const { createCombo, isLoading } = useCombosStore();
  const { products, fetchProducts } = useProductsStore();

  const [formData, setFormData] = useState({
    nombre: '',
    tipo_combo_id: ComboType.PROMOCION,
    descripcion: '',
    precio: '',
    productos: [] as { producto_id: number; cantidad: number }[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedProductId, setSelectedProductId] = useState<number>(0);

  useEffect(() => {
    fetchProducts(restaurantId, true);
  }, [fetchProducts, restaurantId]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.precio || parseFloat(formData.precio) <= 0) newErrors.precio = 'El precio debe ser mayor a 0';
    if (formData.productos.length === 0) newErrors.productos = 'Agrega al menos un producto';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addProduct = () => {
    if (!selectedProductId) return;
    const exists = formData.productos.find((p) => p.producto_id === selectedProductId);
    if (exists) {
      setFormData({
        ...formData,
        productos: formData.productos.map((p) =>
          p.producto_id === selectedProductId ? { ...p, cantidad: p.cantidad + 1 } : p
        ),
      });
    } else {
      setFormData({
        ...formData,
        productos: [...formData.productos, { producto_id: selectedProductId, cantidad: 1 }],
      });
    }
    setSelectedProductId(0);
  };

  const removeProduct = (productoId: number) => {
    setFormData({
      ...formData,
      productos: formData.productos.filter((p) => p.producto_id !== productoId),
    });
  };

  const updateCantidad = (productoId: number, cantidad: number) => {
    if (cantidad < 1) return;
    setFormData({
      ...formData,
      productos: formData.productos.map((p) =>
        p.producto_id === productoId ? { ...p, cantidad } : p
      ),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createCombo({
        nombre: formData.nombre,
        tipo_combo_id: formData.tipo_combo_id,
        descripcion: formData.descripcion || undefined,
        precio: toCents(parseFloat(formData.precio)),
        productos: formData.productos,
      });
      navigate('/combos');
    } catch (error) {
      console.error('Error al crear combo:', error);
    }
  };

  const availableProducts = products.filter(
    (p) => p.activo && !formData.productos.some((fp) => fp.producto_id === p.id)
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/combos')}
            className="text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-semibold text-primary">Nuevo Combo</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Combo *</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Combo Familiar"
          />
          {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Combo *</label>
          <select
            value={formData.tipo_combo_id}
            onChange={(e) => setFormData({ ...formData, tipo_combo_id: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {Object.entries(COMBO_TYPE_LABELS).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Describe el combo..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Precio (Q) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.precio ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="150.00"
          />
          {errors.precio && <p className="text-red-500 text-sm mt-1">{errors.precio}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Productos del Combo *</label>
          {formData.productos.length > 0 && (
            <div className="mb-3 space-y-2">
              {formData.productos.map((p) => {
                const product = products.find((pr) => pr.id === p.producto_id);
                return (
                  <div key={p.producto_id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="flex-1 text-sm text-gray-700">
                      {product?.nombre || `Producto #${p.producto_id}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">Cant:</label>
                      <input
                        type="number"
                        min="1"
                        value={p.cantidad}
                        onChange={(e) => updateCantidad(p.producto_id, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(p.producto_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex gap-2">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(parseInt(e.target.value))}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value={0}>Seleccionar producto...</option>
              {availableProducts.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={addProduct}
              disabled={!selectedProductId}
              className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Plus size={16} />
              Agregar
            </button>
          </div>
          {errors.productos && <p className="text-red-500 text-sm mt-1">{errors.productos}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-green-base hover:bg-green-bright text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isLoading ? 'Guardando...' : 'Guardar Combo'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/combos')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
