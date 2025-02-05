import { type RawCondition, type Condition } from './common'
import { PROGRAMMING_LANGUAGES, type WorkloadId } from '@odigos/ui-utils'

interface Container {
  containerName: string
  language: PROGRAMMING_LANGUAGES
  runtimeVersion: string
  instrumented: boolean
  instrumentationMessage: string
  otelDistroName: string | null
  otherAgent: string | null
}

export interface Source extends WorkloadId {
  selected: boolean
  otelServiceName: string
  numberOfInstances?: number
  containers: Container[]
  conditions: RawCondition[] | Condition[] | null
}
