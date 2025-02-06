import { type Notification } from '../@types'
import { ENTITY_TYPES, getIdFromSseTarget } from '@odigos/ui-utils'
import { type DrawerItem, useDrawerStore, useNotificationStore } from '../store'

const useClickNotification = () => {
  const { setSelectedItem } = useDrawerStore()
  const { markAsDismissed, markAsSeen } = useNotificationStore()

  const onClickNotification = (notif: Pick<Notification, 'id' | 'crdType' | 'target'>, options?: { dismissToast?: boolean }) => {
    const { id, crdType, target } = notif
    const { dismissToast } = options || {}

    if (crdType && target) {
      const drawerItem: Partial<DrawerItem> = {}

      switch (crdType) {
        case ENTITY_TYPES.INSTRUMENTATION_RULE:
          drawerItem['type'] = ENTITY_TYPES.INSTRUMENTATION_RULE
          drawerItem['id'] = getIdFromSseTarget(target, ENTITY_TYPES.INSTRUMENTATION_RULE)
          break

        case ENTITY_TYPES.SOURCE:
        case 'InstrumentationConfig':
        case 'InstrumentationInstance':
          drawerItem['type'] = ENTITY_TYPES.SOURCE
          drawerItem['id'] = getIdFromSseTarget(target, ENTITY_TYPES.SOURCE)
          break

        case ENTITY_TYPES.ACTION:
          drawerItem['type'] = ENTITY_TYPES.ACTION
          drawerItem['id'] = getIdFromSseTarget(target, ENTITY_TYPES.ACTION)
          break

        case ENTITY_TYPES.DESTINATION:
        case 'Destination':
          drawerItem['type'] = ENTITY_TYPES.DESTINATION
          drawerItem['id'] = getIdFromSseTarget(target, ENTITY_TYPES.DESTINATION)
          break

        default:
          console.warn('notif click not handled for:', { crdType, target })
          break
      }

      if (!!drawerItem.item) {
        setSelectedItem(drawerItem as DrawerItem)
      } else {
        console.warn('notif item not found for:', { crdType, target })
      }
    }

    markAsSeen(id)
    if (dismissToast) markAsDismissed(id)
  }

  return { onClickNotification }
}

export { useClickNotification }
