import nodeConfig from './node-config'
import type { Node } from '@xyflow/react'
import type { NodePositions } from './get-node-positions'
import { NODE_TYPES, ADD_NODE_TYPES } from '../../../@types'
import { type Action, ENTITY_TYPES, getActionIcon, getConditionsBooleans, getEntityIcon, getEntityLabel, NOTIFICATION_TYPE } from '@odigos/ui-utils'

interface Params {
  loading: boolean
  entities: Action[]
  positions: NodePositions
  unfilteredCount: number
}

const { nodeWidth, nodeHeight, framePadding } = nodeConfig

const mapToNodeData = (entity: Params['entities'][0]) => {
  const { hasDisableds, priorotizedStatus } = getConditionsBooleans(entity.conditions || [])

  return {
    nodeWidth,
    id: entity.id,
    type: ENTITY_TYPES.ACTION,
    status: priorotizedStatus,
    faded: hasDisableds,
    title: getEntityLabel(entity, ENTITY_TYPES.ACTION, { prioritizeDisplayName: true }),
    subTitle: entity.type,
    icon: getActionIcon(entity.type),
    monitors: entity.spec.signals,
    isActive: !entity.spec.disabled,
    raw: entity,
  }
}

export const buildActionNodes = ({ loading, entities, positions, unfilteredCount }: Params) => {
  const nodes: Node[] = []
  const position = positions[ENTITY_TYPES.ACTION]

  nodes.push({
    id: `${ENTITY_TYPES.ACTION}-${NODE_TYPES.HEADER}`,
    type: NODE_TYPES.HEADER,
    position: {
      x: positions[ENTITY_TYPES.ACTION]['x'],
      y: 0,
    },
    data: {
      nodeWidth,
      title: 'Actions',
      icon: getEntityIcon(ENTITY_TYPES.ACTION),
      tagValue: unfilteredCount,
      isFetching: loading,
    },
  })

  if (!!entities.length) {
    nodes.push({
      id: `${ENTITY_TYPES.ACTION}-${NODE_TYPES.FRAME}`,
      type: NODE_TYPES.FRAME,
      position: {
        x: position['x'] - framePadding,
        y: position['y']() - framePadding,
      },
      data: {
        nodeWidth: nodeWidth + 2 * framePadding,
        nodeHeight: nodeHeight * entities.length + framePadding,
      },
    })

    entities.forEach((action, idx) => {
      nodes.push({
        id: `${ENTITY_TYPES.ACTION}-${idx}`,
        type: NODE_TYPES.BASE,
        extent: 'parent',
        parentId: `${ENTITY_TYPES.ACTION}-${NODE_TYPES.FRAME}`,
        position: {
          x: framePadding,
          y: position['y'](idx) - (nodeHeight - framePadding),
        },
        data: mapToNodeData(action),
      })
    })
  } else if (loading) {
    nodes.push({
      id: `${ENTITY_TYPES.ACTION}-${NODE_TYPES.SKELETON}`,
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
      id: `${ENTITY_TYPES.ACTION}-${NODE_TYPES.ADD}`,
      type: NODE_TYPES.ADD,
      position: {
        x: position['x'],
        y: position['y'](),
      },
      data: {
        nodeWidth,
        type: ADD_NODE_TYPES.ADD_ACTION,
        title: 'ADD ACTION',
        subTitle: 'To modify OpenTelemetry data',
      },
    })
  }

  return nodes
}
