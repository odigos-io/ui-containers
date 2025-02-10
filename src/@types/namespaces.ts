import type { Source } from '@odigos/ui-utils'

export interface Namespace {
  name: string
  selected: boolean
  sources?: Source[]
}
