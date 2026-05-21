import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useProductsStore } from '@/features/manage-products/model/useProductsStore';
import { getCommerceContext, isBusinessCommerce } from '@/shared/business/businessContext';

type InventoryRow = {
  product_id?: number;
  productId?: number;
  id?: number;
  inventario_id?: number;
  inventoryId?: number;
  available_quantity?: number;
  availableQuantity?: number;
  cantidad_disponible?: number;
  reserved_quantity?: number;
  reservedQuantity?: number;
  minimum_alert_quantity?: number;
  minimumAlertQuantity?: number;
  cantidad_minima?: number;
  unidad_medida?: string;
  product?: { name?: string; nombre?: string; product_id?: number; productId?: number };
  producto?: { nombre?: string; name?: string; producto_id?: number; productId?: number };
};

export const InventoryPage = () => {
  const navigate = useNavigate();
  const commerce = getCommerceContext();
  const usesBusinessBackend = isBusinessCommerce();
  const { inventory, isLoading, error, createInventory, deleteProduct, fetchInventory, registerInventoryMovement } = useProductsStore();
  const [inventoryForm, setInventoryForm] = useState({ producto_id: '', cantidad_disponible: '0', cantidad_minima: '0', unidad_medida: 'unidades' });
  const [movementForm, setMovementForm] = useState({ inventario_id: '', tipo_movimiento: 'ajuste', cantidad: '0', usuario_responsable: 'admin' });

  useEffect(() => {
    fetchInventory(commerce.id);
  }, [commerce.id, fetchInventory]);

  const getProductId = (row: InventoryRow) => row.product_id || row.productId || row.producto?.producto_id || row.product?.product_id || row.product?.productId;
  const getInventoryId = (row: InventoryRow) => row.inventario_id || row.inventoryId || row.id;
  const getProductName = (row: InventoryRow) => row.product?.name || row.product?.nombre || row.producto?.nombre || row.producto?.name || `Producto ${getProductId(row)}`;
  const getAvailable = (row: InventoryRow) => row.available_quantity ?? row.availableQuantity ?? row.cantidad_disponible ?? 0;
  const getReserved = (row: InventoryRow) => row.reserved_quantity ?? row.reservedQuantity ?? 0;
  const getMinimum = (row: InventoryRow) => row.minimum_alert_quantity ?? row.minimumAlertQuantity ?? row.cantidad_minima ?? 0;

  const handleDelete = async (row: InventoryRow) => {
    const productId = getProductId(row);
    if (!productId) return;

    if (confirm('¿Eliminar este producto del inventario?')) {
      await deleteProduct(commerce.id, productId);
      await fetchInventory(commerce.id);
    }
  };

  const handleCreateInventory = async () => {
    await createInventory(commerce.id, {
      producto_id: Number(inventoryForm.producto_id),
      cantidad_disponible: Number(inventoryForm.cantidad_disponible),
      cantidad_minima: Number(inventoryForm.cantidad_minima),
      unidad_medida: inventoryForm.unidad_medida,
    });
    setInventoryForm({ producto_id: '', cantidad_disponible: '0', cantidad_minima: '0', unidad_medida: 'unidades' });
  };

  const handleRegisterMovement = async () => {
    await registerInventoryMovement(commerce.id, Number(movementForm.inventario_id), {
      tipo_movimiento: movementForm.tipo_movimiento,
      cantidad: Number(movementForm.cantidad),
      usuario_responsable: movementForm.usuario_responsable,
    });
    setMovementForm({ inventario_id: '', tipo_movimiento: 'ajuste', cantidad: '0', usuario_responsable: 'admin' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Inventario</h1>
          <p className="text-gray-600 mt-1">Consulta stock disponible, reservado y mínimos por producto.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fetchInventory(commerce.id)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw size={18} />
            Actualizar
          </button>
          <button
            type="button"
            onClick={() => navigate('/products/new')}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-primary/90"
          >
            <Plus size={18} />
            Agregar producto
          </button>
        </div>
      </div>

      {usesBusinessBackend ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          El backend de negocios no expone CRUD directo para cantidades. El stock cambia por reserva, confirmacion o liberacion de pedidos internos.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-5 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Crear inventario</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Producto ID" value={inventoryForm.producto_id} onChange={(value) => setInventoryForm({ ...inventoryForm, producto_id: value })} />
              <Input label="Disponible" value={inventoryForm.cantidad_disponible} onChange={(value) => setInventoryForm({ ...inventoryForm, cantidad_disponible: value })} />
              <Input label="Mínimo" value={inventoryForm.cantidad_minima} onChange={(value) => setInventoryForm({ ...inventoryForm, cantidad_minima: value })} />
              <Input label="Unidad" value={inventoryForm.unidad_medida} onChange={(value) => setInventoryForm({ ...inventoryForm, unidad_medida: value })} type="text" />
            </div>
            <button type="button" onClick={handleCreateInventory} disabled={!inventoryForm.producto_id || isLoading} className="mt-4 rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary/90 disabled:opacity-50">
              Crear inventario
            </button>
          </div>

          <div className="rounded-lg bg-white p-5 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Registrar movimiento</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Inventario ID" value={movementForm.inventario_id} onChange={(value) => setMovementForm({ ...movementForm, inventario_id: value })} />
              <Input label="Tipo" value={movementForm.tipo_movimiento} onChange={(value) => setMovementForm({ ...movementForm, tipo_movimiento: value })} type="text" />
              <Input label="Cantidad" value={movementForm.cantidad} onChange={(value) => setMovementForm({ ...movementForm, cantidad: value })} />
              <Input label="Responsable" value={movementForm.usuario_responsable} onChange={(value) => setMovementForm({ ...movementForm, usuario_responsable: value })} type="text" />
            </div>
            <button type="button" onClick={handleRegisterMovement} disabled={!movementForm.inventario_id || isLoading} className="mt-4 rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary/90 disabled:opacity-50">
              Registrar movimiento
            </button>
          </div>
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Cargando inventario...</div>
        ) : inventory.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay movimientos de inventario registrados.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Disponible</th>
                <th className="px-6 py-3">Reservado</th>
                <th className="px-6 py-3">Mínimo</th>
                {!usesBusinessBackend && <th className="px-6 py-3">Unidad</th>}
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(inventory as InventoryRow[]).map((row) => {
                const productId = getProductId(row);
                const inventoryId = getInventoryId(row);

                return (
                  <tr key={inventoryId || productId}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {getProductName(row)}
                      {!usesBusinessBackend && inventoryId && <span className="ml-2 text-xs text-gray-400">#{inventoryId}</span>}
                    </td>
                    <td className="px-6 py-4">{getAvailable(row)}</td>
                    <td className="px-6 py-4">{getReserved(row)}</td>
                    <td className="px-6 py-4">{getMinimum(row)}</td>
                    {!usesBusinessBackend && <td className="px-6 py-4">{row.unidad_medida || 'unidades'}</td>}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={!productId}
                          onClick={() => productId && navigate(`/products/${productId}/edit`)}
                          className="inline-flex items-center gap-1 rounded bg-tertiary px-3 py-2 text-sm text-white transition hover:bg-tertiary/90 disabled:opacity-50"
                        >
                          <Edit size={15} />
                          Editar
                        </button>
                        {usesBusinessBackend && (
                          <button
                            type="button"
                            disabled={!productId}
                            onClick={() => handleDelete(row)}
                            className="inline-flex items-center gap-1 rounded bg-red-500 px-3 py-2 text-sm text-white transition hover:bg-red-600 disabled:opacity-50"
                          >
                            <Trash2 size={15} />
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

const Input = ({ label, value, onChange, type = 'number' }: InputProps) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
    />
  </label>
);
