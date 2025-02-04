import React from 'react'
import styled from 'styled-components'
import { NODE_TYPES } from '../../../@types'
import { SkeletonLoader } from '@odigos/ui-components'
import { type Node, type NodeProps } from '@xyflow/react'

export interface SkeletonNodeProps
  extends NodeProps<
    Node<
      {
        nodeWidth: number
        size: number
      },
      NODE_TYPES.SKELETON
    >
  > {}

interface Props extends SkeletonNodeProps {}

const Container = styled.div<{ $nodeWidth: Props['data']['nodeWidth'] }>`
  width: ${({ $nodeWidth }) => `${$nodeWidth}px`};
`

export const SkeletonNode: React.FC<Props> = ({ id: nodeId, data }) => {
  const { nodeWidth, size } = data

  return (
    <Container data-id={nodeId} $nodeWidth={nodeWidth} className='nowheel nodrag'>
      <SkeletonLoader size={size} />
    </Container>
  )
}
