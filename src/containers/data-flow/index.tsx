import React, { CSSProperties, useEffect, useMemo, useState } from 'react'
import { Flow } from './flow'
import Theme, { styled } from '@odigos/ui-theme'
import { buildEdges } from './helpers/build-edges'
import { buildRuleNodes } from './helpers/build-rule-nodes'
import { type Metrics, type AllEntities } from '../../@types'
import { buildActionNodes } from './helpers/build-action-nodes'
import { buildSourceNodes } from './helpers/build-source-nodes'
import { getNodePositions } from './helpers/get-node-positions'
import { ENTITY_TYPES, useContainerSize } from '@odigos/ui-utils'
import { buildDestinationNodes } from './helpers/build-destination-nodes'
import { applyNodeChanges, type Edge, type Node, useEdgesState, useNodesState } from '@xyflow/react'

interface DataFlowProps extends AllEntities {
  heightToRemove: CSSProperties['height']
  sourcesLoading: boolean
  sourcesTotalCount: number
  destinationsLoading: boolean
  destinationsTotalCount: number
  actionsLoading: boolean
  actionsTotalCount: number
  instrumentationRulesLoading: boolean
  instrumentationRulesTotalCount: number
  metrics: Metrics
}

const Container = styled.div<{ $heightToRemove: DataFlowProps['heightToRemove'] }>`
  width: 100%;
  height: ${({ $heightToRemove }) => `calc(100vh - ${$heightToRemove})`};
  position: relative;
`

const DataFlow: React.FC<DataFlowProps> = ({
  heightToRemove,
  sources,
  sourcesLoading,
  sourcesTotalCount,
  destinations,
  destinationsLoading,
  destinationsTotalCount,
  actions,
  actionsLoading,
  actionsTotalCount,
  instrumentationRules,
  instrumentationRulesLoading,
  instrumentationRulesTotalCount,
  metrics,
}) => {
  const theme = Theme.useTheme()
  const [scrollYOffset, setScrollYOffset] = useState(0)

  const { containerRef, containerWidth, containerHeight } = useContainerSize()
  const positions = useMemo(() => getNodePositions({ containerWidth }), [containerWidth])

  const sourceNodes = useMemo(
    () =>
      buildSourceNodes({
        entities: sources,
        loading: sourcesLoading,
        unfilteredCount: sourcesTotalCount,
        positions,
        containerHeight,
        onScroll: ({ scrollTop }) => setScrollYOffset(scrollTop),
      }),
    [sources, sourcesLoading, sourcesTotalCount, positions, containerHeight]
  )

  const destinationNodes = useMemo(
    () =>
      buildDestinationNodes({
        entities: destinations,
        loading: destinationsLoading,
        unfilteredCount: destinationsTotalCount,
        positions,
      }),
    [destinations, destinationsLoading, destinationsTotalCount, positions]
  )

  const actionNodes = useMemo(
    () =>
      buildActionNodes({
        entities: actions,
        loading: actionsLoading,
        unfilteredCount: actionsTotalCount,
        positions,
      }),
    [actions, actionsLoading, actionsTotalCount, positions]
  )

  const ruleNodes = useMemo(
    () =>
      buildRuleNodes({
        entities: instrumentationRules,
        loading: instrumentationRulesLoading,
        unfilteredCount: instrumentationRulesTotalCount,
        positions,
      }),
    [instrumentationRules, instrumentationRulesLoading, instrumentationRulesTotalCount, positions]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(([] as Node[]).concat(actionNodes, ruleNodes, sourceNodes, destinationNodes))
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[])

  const handleNodeState = (prevNodes: Node[], currNodes: Node[], key: ENTITY_TYPES, yOffset?: number) => {
    const filtered = [...prevNodes].filter(({ id }) => id.split('-')[0] !== key)

    if (!!yOffset) {
      console.log('yOffset', yOffset)

      const changed = applyNodeChanges(
        currNodes
          .filter((node) => node.extent === 'parent')
          .map((node) => ({ id: node.id, type: 'position', position: { ...node.position, y: node.position.y - yOffset } })),
        prevNodes
      )

      return changed
    } else {
      filtered.push(...currNodes)
    }

    return filtered
  }

  useEffect(() => setNodes((prev) => handleNodeState(prev, ruleNodes, ENTITY_TYPES.INSTRUMENTATION_RULE)), [ruleNodes])
  useEffect(() => setNodes((prev) => handleNodeState(prev, actionNodes, ENTITY_TYPES.ACTION)), [actionNodes])
  useEffect(() => setNodes((prev) => handleNodeState(prev, destinationNodes, ENTITY_TYPES.DESTINATION)), [destinationNodes])
  useEffect(() => setNodes((prev) => handleNodeState(prev, sourceNodes, ENTITY_TYPES.SOURCE, scrollYOffset)), [sourceNodes, scrollYOffset])
  useEffect(() => setEdges(buildEdges({ theme, nodes, metrics, containerHeight })), [theme, nodes, metrics, containerHeight])

  return (
    <Container ref={containerRef} $heightToRemove={heightToRemove}>
      <Flow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} />
    </Container>
  )
}

export { DataFlow, type DataFlowProps }
