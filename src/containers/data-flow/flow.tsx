import React from 'react'
import '@xyflow/react/dist/style.css'
import { styled } from '@odigos/ui-theme'
import { AddNode } from './nodes/add-node'
import { BaseNode } from './nodes/base-node'
import { useClickNode } from '../../helpers'
import { EdgedNode } from './nodes/edged-node'
import { FrameNode } from './nodes/frame-node'
import { ScrollNode } from './nodes/scroll-node'
import { HeaderNode } from './nodes/header-node'
import { LabeledEdge } from './edges/labeled-edge'
import { SkeletonNode } from './nodes/skeleton-node'
import { EDGE_TYPES, NODE_TYPES } from '../../@types'
import { Controls, type Edge, type Node, type OnEdgesChange, type OnNodesChange, ReactFlow } from '@xyflow/react'

interface Props {
  nodes: Node[]
  edges: Edge[]

  onNodesChange: OnNodesChange<Node>
  onEdgesChange: OnEdgesChange<Edge>
}

const FlowWrapper = styled.div`
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

const nodeTypes = {
  [NODE_TYPES.HEADER]: HeaderNode,
  [NODE_TYPES.ADD]: AddNode,
  [NODE_TYPES.BASE]: BaseNode,
  [NODE_TYPES.EDGED]: EdgedNode,
  [NODE_TYPES.FRAME]: FrameNode,
  [NODE_TYPES.SCROLL]: ScrollNode,
  [NODE_TYPES.SKELETON]: SkeletonNode,
}

const edgeTypes = {
  [EDGE_TYPES.LABELED]: LabeledEdge,
}

export const Flow: React.FC<Props> = ({ nodes, edges, onNodesChange, onEdgesChange }) => {
  const { onClickNode } = useClickNode()

  return (
    <FlowWrapper>
      <ReactFlow
        fitView={false}
        zoomOnScroll={false}
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodeClick={onClickNode}
        onNodesChange={(changes) => setTimeout(() => onNodesChange(changes))} // Timeout is needed to fix this error: "ResizeObserver loop completed with undelivered notifications."
        onEdgesChange={(changes) => setTimeout(() => onEdgesChange(changes))} // Timeout is needed to fix this error: "ResizeObserver loop completed with undelivered notifications."
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
    </FlowWrapper>
  )
}
