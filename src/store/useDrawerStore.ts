import { create } from 'zustand'
import { ENTITY_TYPES, type WorkloadId } from '@odigos/ui-utils'
import { type Action, type Destination, type InstrumentationRule, type Source } from '../@types'

export enum DRAWER_OTHER_TYPES {
  ODIGOS_CLI = 'odigos-cli',
}

export interface DrawerItem {
  // Define the drawer type
  type: ENTITY_TYPES | DRAWER_OTHER_TYPES
  // If the drawer type is of ENTITY_TYPES, then the "id" and "item" should be defined too
  id?: string | WorkloadId
  // In the case that the "id" was defined, but not the "item", then the drawer should attempt to find the item
  item?: Source | Destination | Action | InstrumentationRule
}

interface DrawerStoreState {
  selectedItem: DrawerItem | null
  setSelectedItem: (item: DrawerItem | null) => void
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

export const useDrawerStore = create<DrawerStoreState>((set) => ({
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}))
