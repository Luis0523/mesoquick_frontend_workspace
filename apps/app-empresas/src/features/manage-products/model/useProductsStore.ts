import { create } from 'zustand';
import { productsService } from '../api/products.service';
import type { Product, CreateProductDTO, ProductCategory, UpdateProductDTO } from '@/entities/product/model/types';

interface ProductsStore {
  // Estado
  products: Product[];
  categories: ProductCategory[];
  inventory: unknown[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  fetchProducts: (restaurantId: number, activo?: boolean) => Promise<void>;
  fetchCategories: (restaurantId: number) => Promise<void>;
  createCategory: (restaurantId: number, name: string) => Promise<ProductCategory>;
  fetchInventory: (restaurantId: number) => Promise<void>;
  createInventory: (restaurantId: number, dto: { producto_id: number; cantidad_disponible: number; cantidad_minima: number; unidad_medida: string }) => Promise<void>;
  registerInventoryMovement: (restaurantId: number, inventoryId: number, dto: { tipo_movimiento: string; cantidad: number; usuario_responsable: string }) => Promise<void>;
  fetchProductById: (restaurantId: number, productId: number) => Promise<void>;
  createProduct: (restaurantId: number, dto: CreateProductDTO) => Promise<Product>;
  updateProduct: (restaurantId: number, productId: number, dto: UpdateProductDTO) => Promise<Product>;
  deleteProduct: (restaurantId: number, productId: number) => Promise<void>;
  toggleActive: (restaurantId: number, productId: number, activo: boolean) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useProductsStore = create<ProductsStore>((set) => ({
  // Estado inicial
  products: [],
  categories: [],
  inventory: [],
  currentProduct: null,
  isLoading: false,
  error: null,

  // Fetch all products
  fetchProducts: async (restaurantId: number, activo?: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const products = await productsService.getAll(restaurantId, { activo });
      set({ products, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar productos',
        isLoading: false,
      });
    }
  },

  // Fetch single product
  fetchProductById: async (restaurantId: number, productId: number) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productsService.getById(restaurantId, productId);
      set({ currentProduct: product, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar producto',
        isLoading: false,
      });
    }
  },

  fetchCategories: async (restaurantId: number) => {
    try {
      const categories = await productsService.getCategories(restaurantId);
      set({ categories });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar categorias' });
    }
  },

  createCategory: async (restaurantId: number, name: string) => {
    try {
      const category = await productsService.createCategory(restaurantId, name);
      set((state) => ({ categories: [...state.categories, category] }));
      return category;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al crear categoria' });
      throw error;
    }
  },

  fetchInventory: async (restaurantId: number) => {
    set({ isLoading: true, error: null });
    try {
      const inventory = await productsService.getInventory(restaurantId);
      set({ inventory: Array.isArray(inventory) ? inventory : [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar inventario',
        isLoading: false,
      });
    }
  },

  createInventory: async (restaurantId, dto) => {
    set({ isLoading: true, error: null });
    try {
      await productsService.createInventory(restaurantId, dto);
      const inventory = await productsService.getInventory(restaurantId);
      set({ inventory: Array.isArray(inventory) ? inventory : [], isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al crear inventario', isLoading: false });
      throw error;
    }
  },

  registerInventoryMovement: async (restaurantId, inventoryId, dto) => {
    set({ isLoading: true, error: null });
    try {
      await productsService.registerInventoryMovement(restaurantId, inventoryId, dto);
      const inventory = await productsService.getInventory(restaurantId);
      set({ inventory: Array.isArray(inventory) ? inventory : [], isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al registrar movimiento', isLoading: false });
      throw error;
    }
  },

  // Create product
  createProduct: async (restaurantId: number, dto: CreateProductDTO) => {
    set({ isLoading: true, error: null });
    try {
      const newProduct = await productsService.create(restaurantId, dto);
      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false,
      }));
      return newProduct;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al crear producto',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update product
  updateProduct: async (restaurantId: number, productId: number, dto: UpdateProductDTO) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProduct = await productsService.update(restaurantId, productId, dto);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === productId ? (updatedProduct || { ...p, ...dto } as Product) : p
        ),
        currentProduct: state.currentProduct?.id === productId ? (updatedProduct || { ...state.currentProduct, ...dto } as Product) : state.currentProduct,
        isLoading: false,
      }));
      return updatedProduct;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al actualizar producto',
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete product (soft delete)
  deleteProduct: async (restaurantId: number, productId: number) => {
    set({ isLoading: true, error: null });
    try {
      await productsService.delete(restaurantId, productId);
      set((state) => ({
        products: state.products.filter((p) => p.id !== productId),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al eliminar producto',
        isLoading: false,
      });
      throw error;
    }
  },

  // Toggle active state
  toggleActive: async (restaurantId: number, productId: number, activo: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProduct = await productsService.toggleActive(restaurantId, productId, activo);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === productId ? (updatedProduct || { ...p, activo }) : p
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cambiar estado',
        isLoading: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    products: [],
    categories: [],
    inventory: [],
    currentProduct: null,
    isLoading: false,
    error: null,
  }),
}));
