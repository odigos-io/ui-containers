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

export interface ExportedSignals {
  logs: boolean
  metrics: boolean
  traces: boolean
}

export interface SupportedSignals {
  logs: {
    supported: boolean
  }
  metrics: {
    supported: boolean
  }
  traces: {
    supported: boolean
  }
}

export interface Condition {
  status: string
  type: string
  reason: string
  message: string
  lastTransitionTime: string
}

export type Config = {
  config: {
    installation: string
    readonly: boolean
  }
}

export interface StepProps {
  title: string
  subtitle?: string
  state: 'finish' | 'active' | 'disabled'
  stepNumber: number
}
