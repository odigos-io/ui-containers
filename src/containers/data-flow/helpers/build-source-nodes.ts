import { type Node } from '@xyflow/react'
import nodeConfig from './node-config'
import { type NodePositions } from './get-node-positions'
import { getMainContainerLanguage } from './get-main-container-language'
import { NODE_TYPES, ADD_NODE_TYPES, type Source } from '../../../@types'
import { ENTITY_TYPES, getEntityIcon, getEntityLabel, getHealthStatus, getProgrammingLanguageIcon, HEALTH_STATUS } from '@odigos/ui-utils'

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
    status: getHealthStatus(entity),
    title: getEntityLabel(entity, ENTITY_TYPES.SOURCE, { extended: true }),
    subTitle: `${entity.namespace} • ${entity.kind}`,
    iconSrc: getProgrammingLanguageIcon(getMainContainerLanguage(entity)),
    raw: entity,
  }
}

export const buildSourceNodes = ({ loading, entities, positions, unfilteredCount, containerHeight, onScroll }: Params) => {
  const nodes: Node[] = []
  const position = positions[ENTITY_TYPES.SOURCE]

  nodes.push({
    id: 'source-header',
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
    },
  })

  if (!!entities.length) {
    nodes.push({
      id: 'source-scroll',
      type: NODE_TYPES.SCROLL,
      position: {
        x: position['x'],
        y: position['y']() - framePadding,
      },
      data: {
        nodeWidth,
        nodeHeight: containerHeight - nodeHeight + framePadding * 2,
        items: entities.map((source, idx) => ({
          id: `source-${idx}`,
          data: mapToNodeData(source),
        })),
        onScroll,
      },
    })

    entities.forEach((source, idx) => {
      nodes.push({
        id: `source-${idx}-hidden`,
        type: NODE_TYPES.EDGED,
        extent: 'parent',
        parentId: 'source-scroll',
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
      id: 'source-skeleton',
      type: NODE_TYPES.SKELETON,
      position: {
        x: position['x'],
        y: position['y'](),
      },
      data: {
        nodeWidth,
        size: 3,
      },
    })
  } else {
    nodes.push({
      id: 'source-add',
      type: NODE_TYPES.ADD,
      position: {
        x: position['x'],
        y: position['y'](),
      },
      data: {
        nodeWidth,
        type: ADD_NODE_TYPES.ADD_SOURCE,
        status: HEALTH_STATUS.HEALTHY,
        title: 'ADD SOURCE',
        subTitle: 'To collect OpenTelemetry data',
      },
    })
  }

  return nodes
}
