import { type Action, type Destination, ENTITY_TYPES, type InstrumentationRule, type Source } from '@odigos/ui-utils'

export type Category = 'all' | ENTITY_TYPES

interface Params {
  searchText: string
  selectedCategory: Category

  sources: Source[]
  destinations: Destination[]
  actions: Action[]
  instrumentationRules: InstrumentationRule[]
}

export const buildSearchResults = ({ instrumentationRules, sources, actions, destinations, searchText, selectedCategory }: Params) => {
  const filteredRules = !searchText
    ? instrumentationRules
    : instrumentationRules.filter((rule) => rule.type?.toLowerCase().includes(searchText) || rule.ruleName?.toLowerCase().includes(searchText))

  const filteredSources = !searchText
    ? sources
    : sources.filter(
        (source) =>
          source.name?.toLowerCase().includes(searchText) ||
          source.otelServiceName?.toLowerCase().includes(searchText) ||
          source.namespace?.toLowerCase().includes(searchText)
      )

  const filteredActions = !searchText
    ? actions
    : actions.filter((action) => action.type?.toLowerCase().includes(searchText) || action.spec.actionName?.toLowerCase().includes(searchText))

  const filteredDestinations = !searchText
    ? destinations
    : destinations.filter(
        (destination) =>
          destination.destinationType.displayName?.toLowerCase().includes(searchText) || destination.name?.toLowerCase().includes(searchText)
      )

  const categories: {
    category: Category
    label: string
    count: number
    entities: InstrumentationRule[] | Source[] | Action[] | Destination[]
  }[] = [
    {
      category: ENTITY_TYPES.SOURCE,
      label: 'Sources',
      count: filteredSources.length,
      entities: [],
    },
    {
      category: ENTITY_TYPES.ACTION,
      label: 'Actions',
      count: filteredActions.length,
      entities: [],
    },
    {
      category: ENTITY_TYPES.DESTINATION,
      label: 'Destinations',
      count: filteredDestinations.length,
      entities: [],
    },
    {
      category: ENTITY_TYPES.INSTRUMENTATION_RULE,
      label: 'Instrumentation Rules',
      count: filteredRules.length,
      entities: [],
    },
  ]

  categories.unshift({
    category: 'all',
    label: 'All',
    count: filteredRules.length + filteredSources.length + filteredActions.length + filteredDestinations.length,
    entities: [],
  })

  const searchResults = categories
    .filter(({ count, category }) => !!count && category !== 'all' && ['all', category].includes(selectedCategory))
    .map((item) => ({
      ...item,
      entities:
        item.category === ENTITY_TYPES.INSTRUMENTATION_RULE
          ? filteredRules
          : item.category === ENTITY_TYPES.SOURCE
          ? filteredSources
          : item.category === ENTITY_TYPES.ACTION
          ? filteredActions
          : item.category === ENTITY_TYPES.DESTINATION
          ? filteredDestinations
          : [],
    }))

  return { categories, searchResults }
}
