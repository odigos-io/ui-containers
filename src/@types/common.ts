import { type Source } from './sources'
import { type Action } from './actions'
import { type Destination } from './destinations'
import { NOTIFICATION_TYPE } from '@odigos/ui-utils'
import { type InstrumentationRule } from './instrumentation-rules'

export interface Notification {
  id: string
  type: NOTIFICATION_TYPE
  title?: string
  message?: string
  crdType?: string
  target?: string
  dismissed: boolean
  seen: boolean
  hideFromHistory?: boolean
  time: string
}

export interface AllEntities {
  sources: Source[]
  destinations: Destination[]
  actions: Action[]
  instrumentationRules: InstrumentationRule[]
}
