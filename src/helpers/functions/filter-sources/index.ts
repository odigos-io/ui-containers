import type { FiltersState } from '../../../store'
import { CONDITION_STATUS, type Source } from '@odigos/ui-utils'

export const filterSources = (sources: Source[], filters: FiltersState): Source[] => {
  let filtered = [...sources]

  if (!!filters.namespaces?.length) filtered = filtered.filter((source) => !!filters.namespaces?.find((ns) => ns.id === source.namespace))
  if (!!filters.kinds?.length) filtered = filtered.filter((source) => !!filters.kinds?.find((type) => type.id === source.kind))
  if (!!filters.languages?.length)
    filtered = filtered.filter(
      (source) => !!filters.languages?.find((language) => !!source.containers?.find((cont) => cont.language === language.id))
    )

  if (!!filters.onlyErrors) filtered = filtered.filter((source) => !!source.conditions?.find((cond) => cond.status === CONDITION_STATUS.FALSE))
  if (!!filters.errors?.length)
    filtered = filtered.filter((source) => !!filters.errors?.find((error) => !!source.conditions?.find((cond) => cond.message === error.id)))

  return filtered
}
