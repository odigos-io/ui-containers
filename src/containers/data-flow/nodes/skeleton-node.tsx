import React, { memo } from 'react'
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

const Container = styled.div<{ $nodeWidth: SkeletonNodeProps['data']['nodeWidth'] }>`
  width: ${({ $nodeWidth }) => `${$nodeWidth}px`};
`

export const SkeletonNode: React.FC<SkeletonNodeProps> = memo(({ id: nodeId, data }) => {
  const { nodeWidth, size } = data

  return (
    <Container data-id={nodeId} $nodeWidth={nodeWidth} className='nowheel nodrag'>
      <SkeletonLoader size={size} />
    </Container>
  )
})
