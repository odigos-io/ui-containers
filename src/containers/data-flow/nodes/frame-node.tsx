import React from 'react'
import styled from 'styled-components'
import { NODE_TYPES } from '../../../@types'
import { Handle, type Node, type NodeProps, Position } from '@xyflow/react'

export interface FrameNodeProps
  extends NodeProps<
    Node<
      {
        nodeWidth: number
        nodeHeight: number
      },
      NODE_TYPES.FRAME
    >
  > {}

interface Props extends FrameNodeProps {}

const Container = styled.div<{ $nodeWidth: Props['data']['nodeWidth']; $nodeHeight: Props['data']['nodeHeight'] }>`
  width: ${({ $nodeWidth }) => $nodeWidth}px;
  height: ${({ $nodeHeight }) => $nodeHeight}px;
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 24px;
`

export const FrameNode: React.FC<Props> = ({ data }) => {
  const { nodeWidth, nodeHeight } = data

  return (
    <Container $nodeWidth={nodeWidth} $nodeHeight={nodeHeight} className='nowheel nodrag'>
      <Handle type='source' position={Position.Right} style={{ visibility: 'hidden' }} />
      <Handle type='target' position={Position.Left} style={{ visibility: 'hidden' }} />
    </Container>
  )
}
