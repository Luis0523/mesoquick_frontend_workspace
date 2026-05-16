import { create } from 'zustand'
import type { Business } from '../../../entities/business/model/types'

interface BusinessesState {
  businesses: Business[]
  selectedType: string | null
  loading: boolean
  error: string | null

  setBusinesses: (businesses: Business[]) => void
  setSelectedType: (type: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useBusinessesStore = create<BusinessesState>((set) => ({
  businesses: [],
  selectedType: null,
  loading: false,
  error: null,

  setBusinesses: (businesses) => set({ businesses }),
  setSelectedType: (type) => set({ selectedType: type }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
