import { type Node } from '@xyflow/react'
import nodeConfig from './node-config'
import { type NodePositions } from './get-node-positions'
import { NODE_TYPES, ADD_NODE_TYPES } from '../../../@types'
import { type Destination, ENTITY_TYPES, getEntityIcon, getEntityLabel, HEALTH_STATUS, NOTIFICATION_TYPE, SIGNAL_TYPE } from '@odigos/ui-utils'

interface Params {
  loading: boolean
  entities: Destination[]
  positions: NodePositions
  unfilteredCount: number
}

const { nodeWidth } = nodeConfig

const mapToNodeData = (entity: Params['entities'][0]) => {
  return {
    nodeWidth,
    id: entity.id,
    type: ENTITY_TYPES.DESTINATION,
    status: !!entity.conditions?.find(({ status }) => status === NOTIFICATION_TYPE.ERROR)
      ? NOTIFICATION_TYPE.ERROR
      : !!entity.conditions?.find(({ status }) => status === NOTIFICATION_TYPE.WARNING)
      ? NOTIFICATION_TYPE.WARNING
      : undefined,
    title: getEntityLabel(entity, ENTITY_TYPES.DESTINATION, { prioritizeDisplayName: true }),
    subTitle: entity.destinationType.displayName,
    iconSrc: entity.destinationType.imageUrl,
    monitors: Object.keys(entity.exportedSignals).filter((signal) => entity.exportedSignals[signal as SIGNAL_TYPE] === true) as SIGNAL_TYPE[],
    raw: entity,
  }
}

export const buildDestinationNodes = ({ loading, entities, positions, unfilteredCount }: Params) => {
  const nodes: Node[] = []
  const position = positions[ENTITY_TYPES.DESTINATION]

  nodes.push({
    id: `${ENTITY_TYPES.DESTINATION}-${NODE_TYPES.HEADER}`,
    type: NODE_TYPES.HEADER,
    position: {
      x: positions[ENTITY_TYPES.DESTINATION]['x'],
      y: 0,
    },
    data: {
      nodeWidth,
      title: 'Destinations',
      icon: getEntityIcon(ENTITY_TYPES.DESTINATION),
      tagValue: unfilteredCount,
      isFetching: loading,
    },
  })

  if (!!entities.length) {
    entities.forEach((destination, idx) => {
      nodes.push({
        id: `${ENTITY_TYPES.DESTINATION}-${idx}`,
        type: NODE_TYPES.BASE,
        position: {
          x: position['x'],
          y: position['y'](idx),
        },
        data: mapToNodeData(destination),
      })
    })
  } else if (loading) {
    nodes.push({
      id: `${ENTITY_TYPES.DESTINATION}-${NODE_TYPES.SKELETON}`,
      type: NODE_TYPES.SKELETON,
      position: {
        x: position['x'],
        y: position['y'](),
      },
      data: {
        nodeWidth,
      },
    })
  } else {
    nodes.push({
      id: `${ENTITY_TYPES.DESTINATION}-${NODE_TYPES.ADD}`,
      type: NODE_TYPES.ADD,
      position: {
        x: position['x'],
        y: position['y'](),
      },
      data: {
        nodeWidth,
        type: ADD_NODE_TYPES.ADD_DESTINATION,
        title: 'ADD DESTINATION',
        subTitle: 'To monitor OpenTelemetry data',
      },
    })
  }

  return nodes
}
