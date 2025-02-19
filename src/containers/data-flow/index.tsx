import React, { CSSProperties, useEffect, useMemo, useState } from 'react'
import { Flow } from './flow'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { useFilterStore } from '../../store'
import { buildEdges } from './helpers/build-edges'
import { buildRuleNodes } from './helpers/build-rule-nodes'
import { type Metrics, type AllEntities } from '../../@types'
import { buildActionNodes } from './helpers/build-action-nodes'
import { buildSourceNodes } from './helpers/build-source-nodes'
import { getNodePositions } from './helpers/get-node-positions'
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
  const [scrollYOffset, setScrollYOffset] = useState(0)
  const { containerRef, containerWidth, containerHeight } = useContainerSize()

  const positions = useMemo(() => getNodePositions({ containerWidth }), [containerWidth])

  const sourceNodes = useMemo(
    () =>
      buildSourceNodes({
        entities: (() => {
          let arr = [...sources]

          if (!!filters.namespaces?.length) arr = arr.filter((source) => !!filters.namespaces?.find((ns) => ns.id === source.namespace))
          if (!!filters.kinds?.length) arr = arr.filter((source) => !!filters.kinds?.find((type) => type.id === source.kind))
          if (!!filters.onlyErrors) arr = arr.filter((source) => !!source.conditions?.find((cond) => cond.status === CONDITION_STATUS.FALSE))
          if (!!filters.errors?.length)
            arr = arr.filter((source) => !!filters.errors?.find((error) => !!source.conditions?.find((cond) => cond.message === error.id)))
          if (!!filters.languages?.length)
            arr = arr.filter((source) => !!filters.languages?.find((language) => !!source.containers?.find((cont) => cont.language === language.id)))

          return arr
        })(),

        loading: sourcesLoading,
        unfilteredCount: sources.length,
        positions,
        containerHeight,
        onScroll: ({ scrollTop }) => setScrollYOffset(scrollTop),
      }),
    [sources, sourcesLoading, filters, positions, containerHeight]
  )

  const destinationNodes = useMemo(
    () =>
      buildDestinationNodes({
        entities: (() => {
          let arr = [...destinations]

          if (!!filters.monitors?.length)
            arr = arr.filter(
              (dest) => !!filters.monitors?.find((metr) => dest.exportedSignals[metr.id as keyof DestinationOption['supportedSignals']])
            )

          return arr
        })(),

        loading: destinationsLoading,
        unfilteredCount: destinations.length,
        positions,
      }),
    [destinations, destinationsLoading, filters, positions]
  )

  const actionNodes = useMemo(
    () =>
      buildActionNodes({
        entities: (() => {
          let arr = [...actions]

          if (!!filters.monitors?.length)
            arr = arr.filter((action) => !!filters.monitors?.find((metric) => action.spec.signals.find((str) => str.toLowerCase() === metric.id)))

          return arr
        })(),

        loading: actionsLoading,
        unfilteredCount: actions.length,
        positions,
      }),
    [actions, actionsLoading, filters, positions]
  )

  const ruleNodes = useMemo(
    () =>
      buildRuleNodes({
        // rules do not have filters yet
        entities: instrumentationRules,
        loading: instrumentationRulesLoading,
        unfilteredCount: instrumentationRules.length,
        positions,
      }),
    [instrumentationRules, instrumentationRulesLoading, positions]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(([] as Node[]).concat(actionNodes, ruleNodes, sourceNodes, destinationNodes))
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[])

  const handleNodeState = (prevNodes: Node[], currNodes: Node[], key: ENTITY_TYPES, yOffset?: number) => {
    const filtered = [...prevNodes].filter(({ id }) => id.split('-')[0] !== key)

    if (!!yOffset) {
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
