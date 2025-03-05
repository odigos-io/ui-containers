import { create } from 'zustand'
import { type Action, type Destination, ENTITY_TYPES, getEntityId, type InstrumentationRule, type Source, type WorkloadId } from '@odigos/ui-utils'

interface IEntityState {
  sourcesLoading: boolean
  sources: Source[]

  destinationsLoading: boolean
  destinations: Destination[]

  actionsLoading: boolean
  actions: Action[]

  instrumentationRulesLoading: boolean
  instrumentationRules: InstrumentationRule[]
}

type EntityId = string | WorkloadId
type EntityItems = IEntityState['sources'] | IEntityState['destinations'] | IEntityState['actions'] | IEntityState['instrumentationRules']

interface IEntityStateSetters {
  setEntitiesLoading: (entityType: ENTITY_TYPES, bool: boolean) => void
  setEntities: (entityType: ENTITY_TYPES, entities: EntityItems) => void
  addEntities: (entityType: ENTITY_TYPES, entities: EntityItems) => void
  removeEntities: (entityType: ENTITY_TYPES, entityIds: EntityId[]) => void
}

export const useEntityStore = create<IEntityState & IEntityStateSetters>((set) => ({
  sourcesLoading: false,
  sources: [],

  destinationsLoading: false,
  destinations: [],

  actionsLoading: false,
  actions: [],

  instrumentationRulesLoading: false,
  instrumentationRules: [],

  setEntitiesLoading: (entityType, bool) => {
    const KEY =
      entityType === ENTITY_TYPES.SOURCE
        ? 'sourcesLoading'
        : entityType === ENTITY_TYPES.DESTINATION
        ? 'destinationsLoading'
        : entityType === ENTITY_TYPES.ACTION
        ? 'actionsLoading'
        : entityType === ENTITY_TYPES.INSTRUMENTATION_RULE
        ? 'instrumentationRulesLoading'
        : 'NONE'

    if (KEY === 'NONE') return

    set({ [KEY]: bool })
  },

  setEntities: (entityType, payload) => {
    const KEY =
      entityType === ENTITY_TYPES.SOURCE
        ? 'sources'
        : entityType === ENTITY_TYPES.DESTINATION
        ? 'destinations'
        : entityType === ENTITY_TYPES.ACTION
        ? 'actions'
        : entityType === ENTITY_TYPES.INSTRUMENTATION_RULE
        ? 'instrumentationRules'
        : 'NONE'

    if (KEY === 'NONE') return

    set({ [KEY]: payload })
  },

  addEntities: (entityType, entities) => {
    const KEY =
      entityType === ENTITY_TYPES.SOURCE
        ? 'sources'
        : entityType === ENTITY_TYPES.DESTINATION
        ? 'destinations'
        : entityType === ENTITY_TYPES.ACTION
        ? 'actions'
        : entityType === ENTITY_TYPES.INSTRUMENTATION_RULE
        ? 'instrumentationRules'
        : 'NONE'

    if (KEY === 'NONE') return

    set((state) => {
      const prev = [...state[KEY]]

      entities.forEach((newItem) => {
        const foundIdx = prev.findIndex((oldItem) => JSON.stringify(getEntityId(oldItem)) === JSON.stringify(getEntityId(newItem)))

        if (foundIdx !== -1) {
          prev[foundIdx] = { ...prev[foundIdx], ...newItem }
        } else {
          prev.push(newItem)
        }
      })

      return { [KEY]: prev }
    })
  },

  removeEntities: (entityType, entityIds) => {
    const KEY =
      entityType === ENTITY_TYPES.SOURCE
        ? 'sources'
        : entityType === ENTITY_TYPES.DESTINATION
        ? 'destinations'
        : entityType === ENTITY_TYPES.ACTION
        ? 'actions'
        : entityType === ENTITY_TYPES.INSTRUMENTATION_RULE
        ? 'instrumentationRules'
        : 'NONE'

    if (KEY === 'NONE') return

    set((state) => {
      const prev = [...state[KEY]]

      entityIds.forEach((id) => {
        const foundIdx = prev.findIndex((entity) =>
          entityType === ENTITY_TYPES.SOURCE
            ? JSON.stringify(getEntityId(entity)) === JSON.stringify(getEntityId(id as WorkloadId))
            : getEntityId(entity) === id
        )

        if (foundIdx !== -1) {
          prev.splice(foundIdx, 1)
        }
      })

      return { [KEY]: prev }
    })
  },
}))
