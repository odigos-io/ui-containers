import type { Action } from '@odigos/ui-utils'
import type { FiltersState } from '../../../store'

export const filterActions = (actions: Action[], filters: FiltersState): Action[] => {
  let filtered = [...actions]

  if (!!filters.monitors?.length)
    filtered = filtered.filter((action) => !!filters.monitors?.find((metric) => action.spec.signals.find((str) => str.toLowerCase() === metric.id)))

  return filtered
}
