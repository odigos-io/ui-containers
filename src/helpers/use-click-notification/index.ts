import { type Notification } from '../../@types'
import { useDrawerStore, useNotificationStore } from '../../store'
import { ENTITY_TYPES, getIdFromSseTarget } from '@odigos/ui-utils'

const useClickNotification = () => {
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()
  const { markAsDismissed, markAsSeen } = useNotificationStore()

  const onClickNotification = (notif: Pick<Notification, 'id' | 'crdType' | 'target'>, options?: { dismissToast?: boolean }) => {
    const { id, crdType, target } = notif
    const { dismissToast } = options || {}

    if (crdType && target) {
      switch (crdType) {
        case ENTITY_TYPES.INSTRUMENTATION_RULE:
          setDrawerType(ENTITY_TYPES.INSTRUMENTATION_RULE)
          setDrawerEntityId(getIdFromSseTarget(target, ENTITY_TYPES.INSTRUMENTATION_RULE))
          break

        case ENTITY_TYPES.SOURCE:
        case 'InstrumentationConfig':
        case 'InstrumentationInstance':
          setDrawerType(ENTITY_TYPES.SOURCE)
          setDrawerEntityId(getIdFromSseTarget(target, ENTITY_TYPES.SOURCE))
          break

        case ENTITY_TYPES.ACTION:
          setDrawerType(ENTITY_TYPES.ACTION)
          setDrawerEntityId(getIdFromSseTarget(target, ENTITY_TYPES.ACTION))
          break

        case ENTITY_TYPES.DESTINATION:
        case 'Destination':
          setDrawerType(ENTITY_TYPES.DESTINATION)
          setDrawerEntityId(getIdFromSseTarget(target, ENTITY_TYPES.DESTINATION))
          break

        default:
          console.warn('notif click not handled for:', { crdType, target })
          break
      }
    }

    markAsSeen(id)
    if (dismissToast) markAsDismissed(id)
  }

  return { onClickNotification }
}

export { useClickNotification }
