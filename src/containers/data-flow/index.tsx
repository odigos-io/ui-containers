import React, { CSSProperties, useEffect, useMemo } from 'react'
import { Flow } from './flow'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { buildEdges } from './helpers/build-edges'
import { buildRuleNodes } from './helpers/build-rule-nodes'
import { type Metrics, type AllEntities } from '../../@types'
import { buildActionNodes } from './helpers/build-action-nodes'
import { buildSourceNodes } from './helpers/build-source-nodes'
import { getNodePositions } from './helpers/get-node-positions'
import { useFilterStore, useInstrumentStore } from '../../store'
import { buildDestinationNodes } from './helpers/build-destination-nodes'
import { applyNodeChanges, type Edge, type Node, useEdgesState, useNodesState } from '@xyflow/react'
import { CONDITION_STATUS, DestinationOption, ENTITY_TYPES, useContainerSize } from '@odigos/ui-utils'

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
          .filter((node) => node.extent === 'parent' && node.parentId === `${key}-scroll`)
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
    let filtered = [...sources]

    if (!!filters.namespaces?.length) filtered = filtered.filter((source) => !!filters.namespaces?.find((ns) => ns.id === source.namespace))
    if (!!filters.kinds?.length) filtered = filtered.filter((source) => !!filters.kinds?.find((type) => type.id === source.kind))
    if (!!filters.languages?.length)
      filtered = filtered.filter(
        (source) => !!filters.languages?.find((language) => !!source.containers?.find((cont) => cont.language === language.id))
      )

    if (!!filters.onlyErrors) filtered = filtered.filter((source) => !!source.conditions?.find((cond) => cond.status === CONDITION_STATUS.FALSE))
    if (!!filters.errors?.length)
      filtered = filtered.filter((source) => !!filters.errors?.find((error) => !!source.conditions?.find((cond) => cond.message === error.id)))

    const sourceNodes = buildSourceNodes({
      entities: filtered,
      loading: sourcesLoading || isAwaitingInstrumentation,
      unfilteredCount: sources.length,
      positions,
      containerHeight,
      onScroll: ({ scrollTop }) => handleNodesScrolled(sourceNodes, ENTITY_TYPES.SOURCE, scrollTop),
    })

    handleNodesChanged(sourceNodes, ENTITY_TYPES.SOURCE)
  }, [
    sources,
    sourcesLoading,
    isAwaitingInstrumentation,
    positions.source,
    filters.namespaces,
    filters.kinds,
    filters.languages,
    filters.onlyErrors,
    filters.errors,
    containerHeight,
  ])

  useEffect(() => {
    let filtered = [...destinations]

    if (!!filters.monitors?.length)
      filtered = filtered.filter(
        (dest) => !!filters.monitors?.find((metr) => dest.exportedSignals[metr.id as keyof DestinationOption['supportedSignals']])
      )

    const destinationNodes = buildDestinationNodes({
      entities: filtered,
      loading: destinationsLoading,
      unfilteredCount: destinations.length,
      positions,
    })

    handleNodesChanged(destinationNodes, ENTITY_TYPES.DESTINATION)
  }, [destinations, destinationsLoading, positions.destination, filters.monitors])

  useEffect(() => {
    let filtered = [...actions]

    if (!!filters.monitors?.length)
      filtered = filtered.filter((action) => !!filters.monitors?.find((metric) => action.spec.signals.find((str) => str.toLowerCase() === metric.id)))

    const actionNodes = buildActionNodes({
      entities: filtered,
      loading: actionsLoading,
      unfilteredCount: actions.length,
      positions,
    })

    handleNodesChanged(actionNodes, ENTITY_TYPES.ACTION)
  }, [actions, actionsLoading, positions.action, filters.monitors])

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
