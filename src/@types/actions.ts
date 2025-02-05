import { ACTION_TYPE } from '@odigos/ui-utils'
import { type Condition, type RawCondition } from './common'

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
  conditions: RawCondition[] | Condition[] | null
  spec: Spec
}
