import { create } from 'zustand'
import { type DropdownProps } from '@odigos/ui-components'

export interface FiltersState {
  searchText?: string
  statuses?: DropdownProps['options']
  platformTypes?: DropdownProps['options']
  namespaces?: DropdownProps['options']
  kinds?: DropdownProps['options']
  monitors?: DropdownProps['options']
  languages?: DropdownProps['options']
  errors?: DropdownProps['options']
  onlyErrors?: boolean
}

interface StoreState {
  searchText: FiltersState['searchText']
  setSearchText: (setSearchText: FiltersState['searchText']) => void

  statuses: FiltersState['statuses']
  setStatuses: (statuses: FiltersState['statuses']) => void

  platformTypes: FiltersState['platformTypes']
  setPlatformTypes: (platformTypes: FiltersState['platformTypes']) => void

  namespaces: FiltersState['namespaces']
  setNamespaces: (namespaces: FiltersState['namespaces']) => void

  kinds: FiltersState['kinds']
  setKinds: (kinds: FiltersState['kinds']) => void

  monitors: FiltersState['monitors']
  setMonitors: (metrics: FiltersState['monitors']) => void

  languages: FiltersState['languages']
  setLanguages: (metrics: FiltersState['languages']) => void

  errors: FiltersState['errors']
  setErrors: (metrics: FiltersState['errors']) => void

  onlyErrors: FiltersState['onlyErrors']
  setOnlyErrors: (onlyErrors: FiltersState['onlyErrors']) => void

  setAll: (params: FiltersState) => void
  clearAll: () => void
  getEmptyState: () => FiltersState
}

const getEmptyState = () => ({
  searchText: '',
  statuses: [],
  platformTypes: [],
  namespaces: [],
  kinds: [],
  monitors: [],
  languages: [],
  errors: [],
  onlyErrors: false,
})

export const useFilterStore = create<StoreState>((set) => ({
  searchText: '',
  setSearchText: (searchText) => set({ searchText }),

  statuses: [],
  setStatuses: (statuses) => set({ statuses }),

  platformTypes: [],
  setPlatformTypes: (platformTypes) => set({ platformTypes }),

  namespaces: [],
  setNamespaces: (namespaces) => set({ namespaces }),

  kinds: [],
  setKinds: (kinds) => set({ kinds }),

  monitors: [],
  setMonitors: (monitors) => set({ monitors }),

  languages: [],
  setLanguages: (languages) => set({ languages }),

  errors: [],
  setErrors: (errors) => set({ errors }),

  onlyErrors: false,
  setOnlyErrors: (onlyErrors) => set({ onlyErrors }),

  setAll: (params) => set(params),
  clearAll: () => set(getEmptyState()),
  getEmptyState,
}))
