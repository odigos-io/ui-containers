import { type Condition, type RawCondition } from './common'

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
  conditions: RawCondition[] | Condition[] | null
  destinationType: {
    type: string
    displayName: string
    imageUrl: string
    supportedSignals: SupportedSignals
  }
}
