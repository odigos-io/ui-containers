import { ACTION_TYPE, SIGNAL_TYPE, type Condition, type FetchedCondition } from '@odigos/ui-utils'

interface Spec {
  actionName: string
  notes: string
  signals: SIGNAL_TYPE[]
  disabled: boolean

  clusterAttributes?:
    | {
        attributeName: string
        attributeStringValue: string
      }[]
    | null
  renames?: {
    [oldKey: string]: string
  } | null
  attributeNamesToDelete?: string[] | null
  piiCategories?: string[] | null
  fallbackSamplingRatio?: number | null
  samplingPercentage?: string | null
  endpointsFilters?:
    | {
        serviceName: string
        httpRoute: string
        minimumLatencyThreshold: number
        fallbackSamplingRatio: number
      }[]
    | null
}

export interface Action {
  id: string
  type: ACTION_TYPE
  conditions: FetchedCondition[] | Condition[] | null
  spec: Spec
}

export interface ActionFormData {
  type: Action['type']
  name: Spec['actionName']
  notes: Spec['notes']
  signals: Spec['signals']
  disabled: Spec['disabled']

  clusterAttributes: Spec['clusterAttributes']
  renames: Spec['renames']
  attributeNamesToDelete: Spec['attributeNamesToDelete']
  piiCategories: Spec['piiCategories']
  fallbackSamplingRatio: Spec['fallbackSamplingRatio']
  samplingPercentage: Spec['samplingPercentage']
  endpointsFilters: Spec['endpointsFilters']
}
