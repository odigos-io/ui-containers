import { type WorkloadId } from '@odigos/ui-utils'

interface Metric {
  throughput: number
}

export interface Metrics {
  sources: (Metric & WorkloadId)[]
  destinations: (Metric & { id: string })[]
}
