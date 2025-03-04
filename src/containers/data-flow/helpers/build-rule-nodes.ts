import { type Node } from '@xyflow/react'
import nodeConfig from './node-config'
import { type NodePositions } from './get-node-positions'
import { NODE_TYPES, ADD_NODE_TYPES } from '../../../@types'
import { ENTITY_TYPES, getEntityIcon, getEntityLabel, getInstrumentationRuleIcon, type InstrumentationRule } from '@odigos/ui-utils'

interface Params {
  loading: boolean
  entities: InstrumentationRule[]
  positions: NodePositions
  unfilteredCount: number
}

const { nodeWidth } = nodeConfig

const mapToNodeData = (entity: Params['entities'][0]) => {
  return {
    nodeWidth,
    id: entity.ruleId,
    type: ENTITY_TYPES.INSTRUMENTATION_RULE,
    status: undefined,
    title: getEntityLabel(entity, ENTITY_TYPES.INSTRUMENTATION_RULE, { prioritizeDisplayName: true }),
    subTitle: entity.type,
    icon: getInstrumentationRuleIcon(entity.type),
    isActive: !entity.disabled,
    raw: entity,
  }
}

export const buildRuleNodes = ({ loading, entities, positions, unfilteredCount }: Params) => {
  const nodes: Node[] = []
  const position = positions[ENTITY_TYPES.INSTRUMENTATION_RULE]

  nodes.push({
    id: `${ENTITY_TYPES.INSTRUMENTATION_RULE}-${NODE_TYPES.HEADER}`,
    type: NODE_TYPES.HEADER,
    position: {
      x: positions[ENTITY_TYPES.INSTRUMENTATION_RULE]['x'],
      y: 0,
    },
    data: {
      nodeWidth,
      title: 'Instrumentation Rules',
      icon: getEntityIcon(ENTITY_TYPES.INSTRUMENTATION_RULE),
      tagValue: unfilteredCount,
      isFetching: loading,
    },
  })

  if (!!entities.length) {
    entities.forEach((rule, idx) => {
      nodes.push({
        id: `${ENTITY_TYPES.INSTRUMENTATION_RULE}-${idx}`,
        type: NODE_TYPES.BASE,
        position: {
          x: position['x'],
          y: position['y'](idx),
        },
        data: mapToNodeData(rule),
      })
    })
  } else if (loading) {
    nodes.push({
      id: `${ENTITY_TYPES.INSTRUMENTATION_RULE}-${NODE_TYPES.SKELETON}`,
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
      id: `${ENTITY_TYPES.INSTRUMENTATION_RULE}-${NODE_TYPES.ADD}`,
      type: NODE_TYPES.ADD,
      position: {
        x: position['x'],
        y: position['y'](),
      },
      data: {
        nodeWidth,
        type: ADD_NODE_TYPES.ADD_RULE,
        title: 'ADD RULE',
        subTitle: 'To modify OpenTelemetry data',
      },
    })
  }

  return nodes
}
