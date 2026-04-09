import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Power } from 'lucide-react';
import { useProductsStore } from '@/features/manage-products/model/useProductsStore';
import { formatProductPrice, PRODUCT_TYPE_LABELS, ProductType } from '@/entities/product/model/types';
import { getCurrentRestaurantId } from '@/shared/mocks/mockAuth';

export const ProductsListPage = () => {
  const navigate = useNavigate();
  const restaurantId = getCurrentRestaurantId();
  
  const { products, isLoading, error, fetchProducts, deleteProduct, toggleActive } = 
    useProductsStore();

  useEffect(() => {
    fetchProducts(restaurantId, true); // Solo productos activos
  }, []);

  const handleDelete = async (productId: number) => {
    if (confirm('¿Eliminar este producto?')) {
      await deleteProduct(restaurantId, productId);
    }
  };

  const handleToggleActive = async (productId: number, currentState: boolean) => {
    await toggleActive(restaurantId, productId, !currentState);
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-primary">Productos</h1>
        <button
          onClick={() => navigate('/products/new')}
          className="flex items-center gap-2 bg-green-base hover:bg-green-bright text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">No hay productos registrados</p>
          <button
            onClick={() => navigate('/products/new')}
            className="text-green-base hover:underline"
          >
            Crear primer producto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Imagen */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {product.imagen_url ? (
                  <img
                    src={product.imagen_url}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-4xl">🍽️</span>
                )}
              </div>

              {/* Contenido */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary mb-1">
                  {product.nombre}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {PRODUCT_TYPE_LABELS[product.tipo_producto_id as ProductType]}
                </p>
                {product.descripcion && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.descripcion}
                  </p>
                )}
                <p className="text-xl font-bold text-green-base mb-4">
                  {formatProductPrice(product.precio)}
                </p>

                {/* Estado */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      product.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {product.activo ? '✓ Activo' : '✗ Inactivo'}
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/products/${product.id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-1 bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleActive(product.id, product.activo)}
                    className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded transition-colors"
                    title={product.activo ? 'Desactivar' : 'Activar'}
                  >
                    <Power size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
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
