import nodeConfig from './node-config'
import type { Edge, Node } from '@xyflow/react'
import { EDGE_TYPES, NODE_TYPES } from '../../../@types'
import type { ITheme } from '@odigos/ui-theme/lib/styles'
import { ENTITY_TYPES, formatBytes, type Metrics, NOTIFICATION_TYPE, type WorkloadId } from '@odigos/ui-utils'

interface Params {
  theme: ITheme
  nodes: Node[]
  metrics?: Metrics
  containerHeight: number
}

const { nodeHeight, framePadding } = nodeConfig

const createEdge = (
  edgeId: string,
  params?: { theme: Params['theme']; label?: string; isMultiTarget?: boolean; isError?: boolean; animated?: boolean }
): Edge => {
  const { theme, label, isMultiTarget, isError, animated } = params || {}
  const [sourceNodeId, targetNodeId] = edgeId.split('-to-')

  return {
    id: edgeId,
    type: !!label ? EDGE_TYPES.LABELED : 'default',
    source: sourceNodeId,
    target: targetNodeId,
    animated,
    data: { label, isMultiTarget, isError },
    style: { stroke: isError ? theme?.colors.dark_red : theme?.colors.border },
  }
}

export const buildEdges = ({ theme, nodes, metrics, containerHeight }: Params) => {
  const edges: Edge[] = []
  const actionNodeId = nodes.find(({ id: nodeId }) =>
    [`${ENTITY_TYPES.ACTION}-${NODE_TYPES.FRAME}`, `${ENTITY_TYPES.ACTION}-${NODE_TYPES.ADD}`].includes(nodeId)
  )?.id

  nodes.forEach(({ type: nodeType, id: nodeId, data: { type: entityType, id: entityId, status }, position }) => {
    if (nodeType === NODE_TYPES.EDGED && entityType === ENTITY_TYPES.SOURCE) {
      const { namespace, name, kind } = entityId as WorkloadId
      const metric = metrics?.sources.find((m) => m.kind === kind && m.name === name && m.namespace === namespace)

      const topLimit = -nodeHeight / 2 + framePadding
      const bottomLimit = Math.floor(containerHeight / nodeHeight) * nodeHeight - (nodeHeight / 2 + framePadding)

      if (position.y >= topLimit && position.y <= bottomLimit) {
        edges.push(
          createEdge(`${nodeId}-to-${actionNodeId}`, {
            theme,
            animated: false,
            isMultiTarget: false,
            label: formatBytes(metric?.throughput),
            isError: status === NOTIFICATION_TYPE.ERROR,
          })
        )
      }
    }

    if (nodeType === NODE_TYPES.BASE && entityType === ENTITY_TYPES.DESTINATION) {
      const metric = metrics?.destinations.find((m) => m.id === entityId)

      edges.push(
        createEdge(`${actionNodeId}-to-${nodeId}`, {
          theme,
          animated: false,
          isMultiTarget: true,
          label: formatBytes(metric?.throughput),
          isError: status === NOTIFICATION_TYPE.ERROR,
        })
      )
    }
  })

  return edges
}
