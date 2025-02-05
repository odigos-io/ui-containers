import { type Condition, type FetchedCondition } from '@odigos/ui-utils'

interface SupportedSignals {
  logs: {
    supported: boolean
  }
  metrics: {
    supported: boolean
  }
  traces: {
    supported: boolean
  }
}

export interface Destination {
  id: string
  name: string
  exportedSignals: {
    traces: boolean
    metrics: boolean
    logs: boolean
  }
  fields: string
  conditions: FetchedCondition[] | Condition[] | null
  destinationType: {
    type: string
    displayName: string
    imageUrl: string
    supportedSignals: SupportedSignals
  }
}
