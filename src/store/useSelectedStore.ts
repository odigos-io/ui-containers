import { create } from 'zustand'
import type { Source } from '@odigos/ui-utils'

export interface SelectedState {
  // in overview this is used to globally select sources for further actions (like uninstrument using multi-source-control component)
  selectedSources: { [namespace: string]: Source[] }
}

interface SelectedStateSetters {
  setSelectedSources: (payload: SelectedState['selectedSources']) => void
  resetSelectedState: () => void
}

export const useSelectedStore = create<SelectedState & SelectedStateSetters>((set) => ({
  selectedSources: {},
  setSelectedSources: (payload) => set({ selectedSources: payload }),
  resetSelectedState: () => set(() => ({ selectedSources: {} })),
}))
