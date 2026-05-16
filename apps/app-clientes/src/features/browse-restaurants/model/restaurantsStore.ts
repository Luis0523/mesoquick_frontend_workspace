import { create } from 'zustand'
import type { Restaurant } from '../../../entities/restaurant/model/types'

interface RestaurantsState {
  restaurants: Restaurant[]
  selectedCategory: string | null
  onlyAvailable: boolean
  loading: boolean
  error: string | null

  setRestaurants: (restaurants: Restaurant[]) => void
  setSelectedCategory: (category: string | null) => void
  setOnlyAvailable: (value: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useRestaurantsStore = create<RestaurantsState>((set) => ({
  restaurants: [],
  selectedCategory: null,
  onlyAvailable: false,
  loading: false,
  error: null,

  setRestaurants: (restaurants) => set({ restaurants }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setOnlyAvailable: (value) => set({ onlyAvailable: value }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
