import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useProductsStore } from '@/features/manage-products/model/useProductsStore';
import { ProductType, PRODUCT_TYPE_LABELS, toCents } from '@/entities/product/model/types';
import { getCommerceContext, isBusinessCommerce } from '@/shared/business/businessContext';

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const restaurantId = getCommerceContext().id;
  const usesBusinessBackend = isBusinessCommerce();
  const { categories, createProduct, createCategory, fetchCategories, isLoading } = useProductsStore();

  const [formData, setFormData] = useState({
    nombre: '',
    tipo_producto_id: ProductType.COMIDA_RAPIDA,
    descripcion: '',
    precio: '', // String para input, se convierte después
    imagen_url: '',
    internal_code: '',
    new_category: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories(restaurantId);
  }, [fetchCategories, restaurantId]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const precioEnCentavos = toCents(parseFloat(formData.precio));

      let categoryId = formData.tipo_producto_id;
      if (usesBusinessBackend && formData.new_category.trim()) {
        const category = await createCategory(restaurantId, formData.new_category.trim());
        categoryId = category.id;
      }

      await createProduct(restaurantId, {
        nombre: formData.nombre,
        tipo_producto_id: categoryId,
        descripcion: formData.descripcion || undefined,
        precio: precioEnCentavos,
        imagen_url: formData.imagen_url || undefined,
        internal_code: formData.internal_code || undefined,
        visible_in_catalog: true,
      });

      navigate('/products');
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/products')}
            className="text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-semibold text-primary">Nuevo Producto</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Producto *
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Producto destacado"
          />
          {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            value={formData.tipo_producto_id}
            onChange={(e) =>
              setFormData({ ...formData, tipo_producto_id: parseInt(e.target.value) })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {(usesBusinessBackend ? categories : Object.entries(PRODUCT_TYPE_LABELS).map(([id, name]) => ({ id: Number(id), name }))).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {usesBusinessBackend && (
            <input
              type="text"
              value={formData.new_category}
              onChange={(e) => setFormData({ ...formData, new_category: e.target.value })}
              className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="O escribe una categoria nueva"
            />
          )}
        </div>

        {usesBusinessBackend && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código interno
            </label>
            <input
              type="text"
              value={formData.internal_code}
              onChange={(e) => setFormData({ ...formData, internal_code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="SKU-001"
            />
          </div>
        )}

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Describe el producto..."
            rows={3}
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio (Q) *
          </label>
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

        {/* Imagen URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de Imagen
          </label>
          <input
            type="url"
            value={formData.imagen_url}
            onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-green-base hover:bg-green-bright text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isLoading ? 'Guardando...' : 'Guardar Producto'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
