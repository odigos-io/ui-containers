import React, { CSSProperties, useEffect, useMemo } from 'react'
import { Flow } from './flow'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { buildEdges } from './helpers/build-edges'
import { buildRuleNodes } from './helpers/build-rule-nodes'
import { type AllEntities, NODE_TYPES } from '../../@types'
import { buildActionNodes } from './helpers/build-action-nodes'
import { buildSourceNodes } from './helpers/build-source-nodes'
import { getNodePositions } from './helpers/get-node-positions'
import { useFilterStore, useInstrumentStore } from '../../store'
import { buildDestinationNodes } from './helpers/build-destination-nodes'
import { ENTITY_TYPES, type Metrics, useContainerSize } from '@odigos/ui-utils'
import { filterActions, filterDestinations, filterSources } from '../../helpers'
import { applyNodeChanges, type Edge, type Node, useEdgesState, useNodesState } from '@xyflow/react'

interface DataFlowProps extends AllEntities {
  heightToRemove: CSSProperties['height']
  sourcesLoading: boolean
  destinationsLoading: boolean
  actionsLoading: boolean
  instrumentationRulesLoading: boolean
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
  destinations,
  destinationsLoading,
  actions,
  actionsLoading,
  instrumentationRules,
  instrumentationRulesLoading,
  metrics,
}) => {
  const theme = Theme.useTheme()
  const filters = useFilterStore()
  const { isAwaitingInstrumentation } = useInstrumentStore()
  const { containerRef, containerWidth, containerHeight } = useContainerSize()

  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[])
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[])

  useEffect(() => setEdges(buildEdges({ theme, nodes, metrics, containerHeight })), [theme, nodes, metrics, containerHeight])
  const positions = useMemo(() => getNodePositions({ containerWidth }), [containerWidth])

  const handleNodesChanged = (currNodes: Node[], key: ENTITY_TYPES) => {
    setNodes((prevNodes) => {
      const payload = [...prevNodes].filter(({ id }) => id.split('-')[0] !== key)
      payload.push(...currNodes)
      return payload
    })
  }

  const handleNodesScrolled = (currNodes: Node[], key: ENTITY_TYPES, yOffset: number) => {
    setNodes((prevNodes) =>
      applyNodeChanges(
        currNodes
          .filter((node) => node.extent === 'parent' && node.parentId === `${key}-${NODE_TYPES.SCROLL}`)
          .map((node) => ({
            id: node.id,
            type: 'position',
            position: {
              ...node.position,
              y: node.position.y - yOffset,
            },
          })),
        prevNodes
      )
    )
  }

  useEffect(() => {
    const sourceNodes = buildSourceNodes({
      entities: filterSources(sources, filters),
      loading: sourcesLoading || isAwaitingInstrumentation,
      unfilteredCount: sources.length,
      positions,
      containerHeight,
      onScroll: ({ scrollTop }) => handleNodesScrolled(sourceNodes, ENTITY_TYPES.SOURCE, scrollTop),
    })

    handleNodesChanged(sourceNodes, ENTITY_TYPES.SOURCE)
  }, [sources, sourcesLoading, isAwaitingInstrumentation, positions.source, filters, containerHeight])

  useEffect(() => {
    const destinationNodes = buildDestinationNodes({
      entities: filterDestinations(destinations, filters),
      loading: destinationsLoading,
      unfilteredCount: destinations.length,
      positions,
    })

    handleNodesChanged(destinationNodes, ENTITY_TYPES.DESTINATION)
  }, [destinations, destinationsLoading, positions.destination, filters])

  useEffect(() => {
    const actionNodes = buildActionNodes({
      entities: filterActions(actions, filters),
      loading: actionsLoading,
      unfilteredCount: actions.length,
      positions,
    })

    handleNodesChanged(actionNodes, ENTITY_TYPES.ACTION)
  }, [actions, actionsLoading, positions.action, filters])

  useEffect(() => {
    // note: rules do not have filters yet

    const ruleNodes = buildRuleNodes({
      entities: instrumentationRules,
      loading: instrumentationRulesLoading,
      unfilteredCount: instrumentationRules.length,
      positions,
    })

    handleNodesChanged(ruleNodes, ENTITY_TYPES.INSTRUMENTATION_RULE)
  }, [instrumentationRules, instrumentationRulesLoading, positions.rule])

  return (
    <Container ref={containerRef} $heightToRemove={heightToRemove}>
      <Flow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} />
    </Container>
  )
}

export { DataFlow, type DataFlowProps }
