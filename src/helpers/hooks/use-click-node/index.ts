import { type MouseEvent } from 'react'
import { type Node } from '@xyflow/react'
import { ADD_NODE_TYPES } from '../../../@types'
import { useDrawerStore, useModalStore } from '../../../store'
import { ENTITY_TYPES, type WorkloadId } from '@odigos/ui-utils'

const useClickNode = () => {
  const { setCurrentModal } = useModalStore()
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  const onClickNode: (event: MouseEvent, object: Node) => void = (_, object) => {
    const {
      data: { id, type },
    } = object

    switch (type) {
      case ENTITY_TYPES.SOURCE:
      case ENTITY_TYPES.DESTINATION:
      case ENTITY_TYPES.ACTION:
      case ENTITY_TYPES.INSTRUMENTATION_RULE:
        setDrawerType(type)
        setDrawerEntityId(id as string | WorkloadId)
        break

      case ADD_NODE_TYPES.ADD_SOURCE:
        setCurrentModal(ENTITY_TYPES.SOURCE)
        break

      case ADD_NODE_TYPES.ADD_DESTINATION:
        setCurrentModal(ENTITY_TYPES.DESTINATION)
        break

      case ADD_NODE_TYPES.ADD_ACTION:
        setCurrentModal(ENTITY_TYPES.ACTION)
        break

      case ADD_NODE_TYPES.ADD_RULE:
        setCurrentModal(ENTITY_TYPES.INSTRUMENTATION_RULE)
        break

      default:
        console.warn('Unhandled node click', object)
        break
    }
  }

  return { onClickNode }
}

export { useClickNode }
