import { type Node } from '@xyflow/react'
import nodeConfig from './node-config'
import { type NodePositions } from './get-node-positions'
import { NODE_TYPES, ADD_NODE_TYPES } from '../../../@types'
import { ENTITY_TYPES, getEntityIcon, getEntityLabel, getProgrammingLanguageIcon, NOTIFICATION_TYPE, type Source } from '@odigos/ui-utils'

interface Params {
  loading: boolean
  entities: Source[]
  positions: NodePositions
  unfilteredCount: number
  containerHeight: number
  onScroll: (params: { clientHeight: number; scrollHeight: number; scrollTop: number }) => void
}

const { nodeWidth, nodeHeight, framePadding } = nodeConfig

const mapToNodeData = (entity: Params['entities'][0]) => {
  return {
    nodeWidth,
    nodeHeight,
    framePadding,
    id: {
      namespace: entity.namespace,
      name: entity.name,
      kind: entity.kind,
    },
    type: ENTITY_TYPES.SOURCE,
    status: !!entity.conditions?.find(({ status }) => status === NOTIFICATION_TYPE.ERROR)
      ? NOTIFICATION_TYPE.ERROR
      : !!entity.conditions?.find(({ status }) => status === NOTIFICATION_TYPE.WARNING)
      ? NOTIFICATION_TYPE.WARNING
      : undefined,
    title: getEntityLabel(entity, ENTITY_TYPES.SOURCE, { extended: true }),
    subTitle: `${entity.namespace} • ${entity.kind}`,
    iconSrcs: entity.containers?.map(({ language }) => getProgrammingLanguageIcon(language)) || [],
    raw: entity,
  }
}

export const buildSourceNodes = ({ loading, entities, positions, unfilteredCount, containerHeight, onScroll }: Params) => {
  const nodes: Node[] = []
  const position = positions[ENTITY_TYPES.SOURCE]

  nodes.push({
    id: `${ENTITY_TYPES.SOURCE}-${NODE_TYPES.HEADER}`,
    type: NODE_TYPES.HEADER,
    position: {
      x: positions[ENTITY_TYPES.SOURCE]['x'],
      y: 0,
    },
    data: {
      nodeWidth,
      title: 'Sources',
      icon: getEntityIcon(ENTITY_TYPES.SOURCE),
      tagValue: entities.length !== unfilteredCount ? `${entities.length}/${unfilteredCount}` : unfilteredCount,
      isFetching: loading,
      sources: entities,
    },
  })

  if (!!entities.length) {
    nodes.push({
      id: `${ENTITY_TYPES.SOURCE}-${NODE_TYPES.SCROLL}`,
      type: NODE_TYPES.SCROLL,
      position: {
        x: position['x'],
        y: position['y']() - framePadding,
      },
      style: {
        zIndex: 1,
      },
      data: {
        nodeWidth,
        nodeHeight: containerHeight - nodeHeight + framePadding * 2,
        items: entities.map((source, idx) => ({
          id: `${ENTITY_TYPES.SOURCE}-${idx}`,
          data: mapToNodeData(source),
        })),
        onScroll,
      },
    })

    entities.forEach((source, idx) => {
      nodes.push({
        id: `${ENTITY_TYPES.SOURCE}-${idx}-hidden`,
        type: NODE_TYPES.EDGED,
        extent: 'parent',
        parentId: `${ENTITY_TYPES.SOURCE}-${NODE_TYPES.SCROLL}`,
        position: {
          x: framePadding,
          y: position['y'](idx) - (nodeHeight - framePadding / 2),
        },
        style: {
          zIndex: -1,
        },
        data: mapToNodeData(source),
      })
    })
  } else if (loading) {
    nodes.push({
      id: `${ENTITY_TYPES.SOURCE}-${NODE_TYPES.SKELETON}`,
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
      id: `${ENTITY_TYPES.SOURCE}-${NODE_TYPES.ADD}`,
      type: NODE_TYPES.ADD,
      position: {
        x: position['x'],
        y: position['y'](),
      },
      data: {
        nodeWidth,
        type: ADD_NODE_TYPES.ADD_SOURCE,
        title: 'ADD SOURCE',
        subTitle: 'To collect OpenTelemetry data',
      },
    })
  }

  return nodes
}
