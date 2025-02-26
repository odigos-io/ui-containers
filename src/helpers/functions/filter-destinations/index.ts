import type { FiltersState } from '../../../store'
import type { DestinationOption, Destination } from '@odigos/ui-utils'

export const filterDestinations = (destinations: Destination[], filters: FiltersState): Destination[] => {
  let filtered = [...destinations]

  if (!!filters.monitors?.length)
    filtered = filtered.filter(
      (dest) => !!filters.monitors?.find((metr) => dest.exportedSignals[metr.id as keyof DestinationOption['supportedSignals']])
    )

  return filtered
}
