import { NOTIFICATION_TYPE } from '@odigos/ui-utils'

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

export interface Condition {
  status: string
  type: string
  reason: string
  message: string
  lastTransitionTime: string
}
