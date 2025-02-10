import type { Source } from '@odigos/ui-utils'

export interface SourceFormData {
  otelServiceName: string
}

export type PersistSources = (
  selectAppsList: { [namespace: string]: Pick<Source, 'name' | 'kind' | 'selected'>[] },
  futureSelectAppsList: { [namespace: string]: boolean }
) => Promise<void>
