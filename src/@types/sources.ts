import { type Condition, type FetchedCondition, PROGRAMMING_LANGUAGES, type WorkloadId } from '@odigos/ui-utils'

interface Container {
  containerName: string
  language: PROGRAMMING_LANGUAGES
  runtimeVersion: string
  instrumented: boolean
  instrumentationMessage: string
  otelDistroName: string | null
}

export interface Source extends WorkloadId {
  selected: boolean
  otelServiceName: string
  numberOfInstances?: number
  containers: Container[] | null
  conditions: FetchedCondition[] | Condition[] | null
}
