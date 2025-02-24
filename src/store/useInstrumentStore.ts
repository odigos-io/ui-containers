import { create } from 'zustand'

interface StoreValues {
  isAwaitingInstrumentation: boolean

  sourcesToCreate: number
  sourcesCreated: number

  sourcesToDelete: number
  sourcesDeleted: number
}

interface StoreSetters {
  setInstrumentAwait: (v: boolean) => void
  setInstrumentCount: (k: keyof Omit<StoreValues, 'isAwaitingInstrumentation'>, v: number) => void
}

export const useInstrumentStore = create<StoreValues & StoreSetters>((set) => ({
  isAwaitingInstrumentation: false,

  sourcesToCreate: 0,
  sourcesCreated: 0,

  sourcesToDelete: 0,
  sourcesDeleted: 0,

  setInstrumentAwait: (v) => set({ isAwaitingInstrumentation: v }),
  setInstrumentCount: (k, v) => set({ [k]: v }),
}))
