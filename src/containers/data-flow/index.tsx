import React, { useEffect, useMemo, useState } from 'react'
import '@xyflow/react/dist/style.css'
import { Theme } from '@odigos/ui-theme'
import { buildEdges } from './helpers/build-edges'
import { LabeledEdge } from './edges/labeled-edge'
import styled, { useTheme } from 'styled-components'
import { buildRuleNodes } from './helpers/build-rule-nodes'
import { AddNode, type AddNodeProps } from './nodes/add-node'
import { buildActionNodes } from './helpers/build-action-nodes'
import { buildSourceNodes } from './helpers/build-source-nodes'
import { getNodePositions } from './helpers/get-node-positions'
import { BaseNode, type BaseNodeProps } from './nodes/base-node'
import { ENTITY_TYPES, useContainerSize } from '@odigos/ui-utils'
import { EdgedNode, type EdgedNodeProps } from './nodes/edged-node'
import { FrameNode, type FrameNodeProps } from './nodes/frame-node'
import { ScrollNode, type ScrollNodeProps } from './nodes/scroll-node'
import { HeaderNode, type HeaderNodeProps } from './nodes/header-node'
import { buildDestinationNodes } from './helpers/build-destination-nodes'
import { SkeletonNode, type SkeletonNodeProps } from './nodes/skeleton-node'
import { applyNodeChanges, Controls, type Edge, type Node, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react'
import { type Action, type Destination, EDGE_TYPES, type InstrumentationRule, type Metrics, NODE_TYPES, type Source } from '../../@types'

interface DataFlowProps {
  sources: {
    loading: boolean
    entities: Source[]
    unfilteredCount: number
  }
  destinations: {
    loading: boolean
    entities: Destination[]
    unfilteredCount: number
  }
  actions: {
    loading: boolean
    entities: Action[]
    unfilteredCount: number
  }
  instrumentationRules: {
    loading: boolean
    entities: InstrumentationRule[]
    unfilteredCount: number
  }
  metrics: Metrics
  onNodeClick: (event: React.MouseEvent, object: Node) => void
}

const Container = styled.div`
  height: calc(100vh - 160px);
  .react-flow__attribution {
    visibility: hidden;
  }
`

const ControllerWrapper = styled.div`
  button {
    padding: 8px;
    margin: 8px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border} !important;
    background-color: ${({ theme }) => theme.colors.dropdown_bg};
    path {
      fill: ${({ theme }) => theme.text.secondary};
    }
    &:hover {
      background-color: ${({ theme }) => theme.colors.dropdown_bg_2};
    }
  }
`

const DataFlow: React.FC<DataFlowProps> = ({ sources, destinations, actions, instrumentationRules, metrics, onNodeClick }) => {
  const theme = useTheme()
  const [scrollYOffset, setScrollYOffset] = useState(0)

  const { containerRef, containerWidth, containerHeight } = useContainerSize()
  const positions = useMemo(() => getNodePositions({ containerWidth }), [containerWidth])

  const sourceNodes = useMemo(
    () =>
      buildSourceNodes({
        ...sources,
        positions,
        containerHeight,
        onScroll: ({ scrollTop }) => setScrollYOffset(scrollTop),
      }),
    [sources, positions, containerHeight]
  )

  const destinationNodes = useMemo(
    () =>
      buildDestinationNodes({
        ...destinations,
        positions,
      }),
    [destinations, positions]
  )

  const actionNodes = useMemo(
    () =>
      buildActionNodes({
        ...actions,
        positions,
      }),
    [actions, positions]
  )

  const ruleNodes = useMemo(
    () =>
      buildRuleNodes({
        ...instrumentationRules,
        positions,
      }),
    [instrumentationRules, positions]
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
  useEffect(() => setEdges(buildEdges({ theme: theme as Theme.ITheme, nodes, metrics, containerHeight })), [theme, nodes, metrics, containerHeight])

  const nodeTypes = {
    [NODE_TYPES.HEADER]: (props: HeaderNodeProps) => <HeaderNode {...props} sources={sources.entities} />,
    [NODE_TYPES.ADD]: (props: AddNodeProps) => <AddNode {...props} />,
    [NODE_TYPES.BASE]: (props: BaseNodeProps) => <BaseNode {...props} />,
    [NODE_TYPES.EDGED]: (props: EdgedNodeProps) => <EdgedNode {...props} />,
    [NODE_TYPES.FRAME]: (props: FrameNodeProps) => <FrameNode {...props} />,
    [NODE_TYPES.SCROLL]: (props: ScrollNodeProps) => <ScrollNode {...props} handleNodeClick={onNodeClick} />,
    [NODE_TYPES.SKELETON]: (props: SkeletonNodeProps) => <SkeletonNode {...props} />,
  }

  const edgeTypes = {
    [EDGE_TYPES.LABELED]: LabeledEdge,
  }

  return (
    <Container ref={containerRef}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onNodesChange={(changes) => setTimeout(() => onNodesChange(changes))} // Timeout is needed to fix this error: "ResizeObserver loop completed with undelivered notifications."
        onEdgesChange={(changes) => setTimeout(() => onEdgesChange(changes))} // Timeout is needed to fix this error: "ResizeObserver loop completed with undelivered notifications."
        zoomOnScroll={false}
        fitView={false}
      >
        <ControllerWrapper>
          <Controls
            position='bottom-left'
            orientation='horizontal'
            showInteractive={false}
            showZoom
            showFitView
            fitViewOptions={{
              duration: 300,
              padding: 0.02,
              includeHiddenNodes: true,
            }}
          />
        </ControllerWrapper>
      </ReactFlow>
    </Container>
  )
}

// export default to allow for lazy loading (aka dynamic imports)
export default DataFlow
export { DataFlow, type DataFlowProps }
