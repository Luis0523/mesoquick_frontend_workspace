import { create } from 'zustand'
import type { CartItem } from '../../../entities/product/model/types'

interface CartState {
  items: CartItem[]
  sourceName: string | null
  sourceId: number | string | null
  sourceType: 'restaurant' | 'business' | null
  notes: string

  addItem: (item: CartItem) => void
  removeItem: (productId: number | string) => void
  updateQuantity: (productId: number | string, quantity: number) => void
  updateNotes: (productId: number | string, notes: string) => void
  setOrderNotes: (notes: string) => void
  setSource: (sourceId: number | string, sourceName: string, sourceType: 'restaurant' | 'business') => void
  clearCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  sourceName: null,
  sourceId: null,
  sourceType: null,
  notes: '',

  addItem: (item) => {
    const { items } = get()
    const existing = items.find((i) => i.productId === item.productId && i.sourceId === item.sourceId)
    if (existing) {
      set({
        items: items.map((i) =>
          i.productId === item.productId && i.sourceId === item.sourceId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        ),
      })
    } else {
      set({ items: [...items, item] })
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.productId !== productId) })
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    set({
      items: get().items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i,
      ),
    })
  },

  updateNotes: (productId, notes) => {
    set({
      items: get().items.map((i) =>
        i.productId === productId ? { ...i, notes } : i,
      ),
    })
  },

  setOrderNotes: (notes) => set({ notes }),

  setSource: (sourceId, sourceName, sourceType) =>
    set({ sourceId, sourceName, sourceType }),

  clearCart: () =>
    set({ items: [], sourceName: null, sourceId: null, sourceType: null, notes: '' }),

  getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

  getSubtotal: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
}))
