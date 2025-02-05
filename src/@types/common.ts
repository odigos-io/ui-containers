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

export enum CONDITION_STATUS {
  FALSE = 'False',
  TRUE = 'True',
  UNKNOWN = 'Unknown',
}

// RawCondition is the condition as it comes from the API,
// although we don't define API interfaces in this project, conditions in specific are not mapped on get-queries, so we need to define it here
export interface RawCondition {
  status: CONDITION_STATUS
  message: string
  lastTransitionTime: string
}

// Condition is the condition after it has been mapped
export interface Condition {
  status: NOTIFICATION_TYPE
  message: string
  lastTransitionTime: string
}
