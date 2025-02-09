import { type Action, type Destination, type InstrumentationRule, NOTIFICATION_TYPE, type Source } from '@odigos/ui-utils'

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

export type CustomFieldProps<T = Record<string, any>> = {
  value: T
  setValue: (key: keyof T, value: any) => void
  formErrors: Record<string, string>
}
