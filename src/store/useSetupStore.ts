import { create } from 'zustand'
import type { DestinationFormData } from '../@types'
import type { Destination, Source } from '@odigos/ui-utils'

export interface AvailableSourcesByNamespace {
  [namespace: string]: Pick<Source, 'name' | 'kind' | 'selected' | 'numberOfInstances'>[]
}

export interface SourceSelectionFormData {
  [namespace: string]: Pick<Source, 'name' | 'kind' | 'selected'>[]
}

export interface NamespaceSelectionFormData {
  [namespace: string]: boolean
}

export interface StoredSetupDestination {
  type: string
  displayName: string
  imageUrl: string
  category: string
  exportedSignals: Destination['exportedSignals']
  destinationTypeDetails: {
    title: string
    value: string
  }[]
}

export interface ISetupState {
  // in onboarding this is used to keep state of sources that are available for selection in a namespace, in-case user goes back a page (from destinations to sources)
  availableSources: AvailableSourcesByNamespace
  // in onboarding this is used to keep state of added sources, until end of onboarding
  configuredSources: SourceSelectionFormData
  // in onboarding this is used to keep state of namespaces with future-apps selected, until end of onboarding
  configuredFutureApps: NamespaceSelectionFormData
  // in onbaording this is used to keep state of added destinations, until end of onboarding
  configuredDestinations: { stored: StoredSetupDestination; form: DestinationFormData }[]
}

interface ISetupStateSetters {
  setAvailableSources: (payload: ISetupState['availableSources']) => void
  setConfiguredSources: (payload: ISetupState['configuredSources']) => void
  setConfiguredFutureApps: (payload: ISetupState['configuredFutureApps']) => void

  setConfiguredDestinations: (payload: ISetupState['configuredDestinations']) => void
  addConfiguredDestination: (payload: { stored: StoredSetupDestination; form: DestinationFormData }) => void
  removeConfiguredDestination: (payload: { type: string }) => void

  resetState: () => void
}

export const useSetupStore = create<ISetupState & ISetupStateSetters>((set) => ({
  availableSources: {},
  configuredSources: {},
  configuredFutureApps: {},
  configuredDestinations: [],

  setAvailableSources: (payload) => set({ availableSources: payload }),
  setConfiguredSources: (payload) => set({ configuredSources: payload }),
  setConfiguredFutureApps: (payload) => set({ configuredFutureApps: payload }),

  setConfiguredDestinations: (payload) => set({ configuredDestinations: payload }),
  addConfiguredDestination: (payload) => set((state) => ({ configuredDestinations: [...state.configuredDestinations, payload] })),
  removeConfiguredDestination: (payload) =>
    set((state) => ({ configuredDestinations: state.configuredDestinations.filter(({ stored }) => stored.type !== payload.type) })),

  resetState: () => set(() => ({ availableSources: {}, configuredSources: {}, configuredFutureApps: {}, configuredDestinations: [] })),
}))
