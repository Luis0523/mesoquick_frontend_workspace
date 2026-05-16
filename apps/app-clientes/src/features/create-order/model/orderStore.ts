import { create } from 'zustand'
import type { Order } from '../../../entities/order/model/types'

interface OrderState {
  currentOrder: Order | null
  orderHistory: Order[]
  loading: boolean
  error: string | null

  setCurrentOrder: (order: Order | null) => void
  addToHistory: (order: Order) => void
  setOrderHistory: (orders: Order[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useOrderStore = create<OrderState>((set) => ({
  currentOrder: null,
  orderHistory: [],
  loading: false,
  error: null,

  setCurrentOrder: (order) => set({ currentOrder: order }),
  addToHistory: (order) =>
    set((state) => ({ orderHistory: [order, ...state.orderHistory] })),
  setOrderHistory: (orders) => set({ orderHistory: orders }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
