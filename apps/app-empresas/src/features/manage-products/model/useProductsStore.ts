import { create } from 'zustand';
import { productsService } from '../api/products.service';
import type { Product, CreateProductDTO, UpdateProductDTO } from '@/entities/product/model/types';

interface ProductsStore {
  // Estado
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  fetchProducts: (restaurantId: number, activo?: boolean) => Promise<void>;
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
    currentProduct: null,
    isLoading: false,
    error: null,
  }),
}));
