import { create } from 'zustand'
import { ENTITY_TYPES, type WorkloadId } from '@odigos/ui-utils'

export enum DRAWER_OTHER_TYPES {
  ODIGOS_CLI = 'odigos-cli',
}

export interface DrawerStoreState {
  // Define the drawer type
  drawerType: ENTITY_TYPES | DRAWER_OTHER_TYPES | null
  // If the drawer type is of ENTITY_TYPES, then the "id" should be defined too
  drawerEntityId: string | WorkloadId | null
}

interface DrawerStoreStateSetters {
  setDrawerType: (value: DrawerStoreState['drawerType']) => void
  setDrawerEntityId: (value: DrawerStoreState['drawerEntityId']) => void
}

export const useDrawerStore = create<DrawerStoreState & DrawerStoreStateSetters>((set) => ({
  drawerType: null,
  drawerEntityId: null,
  setDrawerType: (value) => set({ drawerType: value }),
  setDrawerEntityId: (value) => set({ drawerEntityId: value }),
}))
