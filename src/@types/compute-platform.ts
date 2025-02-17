import { NOTIFICATION_TYPE, PLATFORM_TYPE } from '@odigos/ui-utils'

export interface Platform {
  id: string
  name?: string
  type: PLATFORM_TYPE
  connectionStatus: NOTIFICATION_TYPE
}
