import React from 'react'
import styled from 'styled-components'
import { NODE_TYPES } from '../../../@types'
import { Handle, type Node, type NodeProps, Position } from '@xyflow/react'

export interface EdgedNodeProps
  extends NodeProps<
    Node<
      {
        nodeWidth: number
        nodeHeight: number
      },
      NODE_TYPES.EDGED
    >
  > {}

const Container = styled.div<{ $nodeWidth: EdgedNodeProps['data']['nodeWidth']; $nodeHeight: EdgedNodeProps['data']['nodeHeight'] }>`
  width: ${({ $nodeWidth }) => `${$nodeWidth}px`};
  height: ${({ $nodeHeight }) => `${$nodeHeight}px`};
  opacity: 0;
`

export const EdgedNode: React.FC<EdgedNodeProps> = ({ data }) => {
  const { nodeWidth, nodeHeight } = data

  return (
    <Container $nodeWidth={nodeWidth} $nodeHeight={nodeHeight}>
      <Handle type='source' position={Position.Right} style={{ visibility: 'hidden' }} />
      <Handle type='target' position={Position.Left} style={{ visibility: 'hidden' }} />
    </Container>
  )
}
