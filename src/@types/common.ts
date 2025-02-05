import { type MouseEvent } from 'react'
import { type Node } from '@xyflow/react'
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

export type OnNodeClick = (event: MouseEvent, object: Node) => void
