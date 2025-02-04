import { type WorkloadId } from '@odigos/ui-utils'

interface Metric {
  totalDataSent: number
  throughput: number
}

export interface Metrics {
  sources: (Metric & WorkloadId)[]
  destinations: (Metric & { id: string })[]
}
