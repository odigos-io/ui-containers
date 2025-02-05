import { ACTION_TYPE, type Condition, type FetchedCondition } from '@odigos/ui-utils'

interface Spec {
  actionName: string
  notes: string
  signals: string[]
  disabled?: boolean

  clusterAttributes?: {
    attributeName: string
    attributeStringValue: string
  }[]
  renames?: {
    [oldKey: string]: string
  }
  attributeNamesToDelete?: string[]
  piiCategories?: string[]

  fallbackSamplingRatio?: number
  samplingPercentage?: string
  endpointsFilters?: {
    serviceName: string
    httpRoute: string
    minimumLatencyThreshold: number
    fallbackSamplingRatio: number
  }[]
}

export interface Action {
  id: string
  type: ACTION_TYPE
  conditions: FetchedCondition[] | Condition[] | null
  spec: Spec
}
