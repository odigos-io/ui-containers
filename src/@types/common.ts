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

export type CustomFieldProps<T = Record<string, any>> = {
  value: T
  setValue: (key: keyof T, value: any) => void
  formErrors: Record<string, string>
}
