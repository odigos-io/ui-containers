import React, { memo, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { BaseNode } from './base-node'
import { type SVG } from '@odigos/ui-icons'
import { NODE_TYPES } from '../../../@types'
import { useClickNode } from '../../../helpers'
import { type Node, type NodeProps } from '@xyflow/react'
import { ENTITY_TYPES, NOTIFICATION_TYPE, type Source, type WorkloadId } from '@odigos/ui-utils'

export interface ScrollNodeProps
  extends NodeProps<
    Node<
      {
        nodeWidth: number
        nodeHeight: number
        items: NodeProps<
          Node<
            {
              nodeWidth: number
              framePadding: number
              id: WorkloadId
              type: ENTITY_TYPES
              status?: NOTIFICATION_TYPE
              title: string
              subTitle: string
              icon?: SVG
              iconSrc?: string
              raw: Source
            },
            NODE_TYPES.BASE
          >
        >[]
        onScroll: (params: { clientHeight: number; scrollHeight: number; scrollTop: number }) => void
      },
      NODE_TYPES.SCROLL
    >
  > {}

const Container = styled.div<{ $nodeWidth: number; $nodeHeight: number }>`
  position: relative;
  width: ${({ $nodeWidth }) => $nodeWidth}px;
  height: ${({ $nodeHeight }) => $nodeHeight}px;
  background: transparent;
  border: none;
  overflow-y: auto;
`

const BaseNodeWrapper = styled.div<{ $framePadding: number }>`
  margin: ${({ $framePadding }) => $framePadding}px 0;
`

const LoadMoreWrapper = styled.div<{ $hide?: boolean }>`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  width: 100%;
  height: 100px;
  padding-bottom: 12px;

  background: ${({ theme, $hide }) => ($hide ? 'transparent' : `linear-gradient(to top, ${theme.colors.primary}, transparent)`)};
  display: flex;
  align-items: flex-end;
  justify-content: center;

  pointer-events: none;
`

// const LoadMoreButton = styled(Button)`
//   background: ${({ theme }) => theme.colors.primary} !important;
//   &:hover {
//     background: ${({ theme }) => theme.colors.dropdown_bg_2} !important;
//   }
// `;

export const ScrollNode: React.FC<ScrollNodeProps> = memo(({ data, ...rest }) => {
  const { nodeWidth, nodeHeight, items, onScroll } = data
  const { onClickNode } = useClickNode()

  const containerRef = useRef<HTMLDivElement>(null)
  const [isBottomOfList, setIsBottomOfList] = useState(false)

  useEffect(() => {
    const handleScroll = (e: Event) => {
      e.stopPropagation()

      // @ts-ignore - these properties are available on the EventTarget, TS is not aware of it
      const { clientHeight, scrollHeight, scrollTop } = e.target || { clientHeight: 0, scrollHeight: 0, scrollTop: 0 }

      if (!!onScroll) onScroll({ clientHeight, scrollHeight, scrollTop })

      // TODO: Use the following if we have to handle paginated API requests using scroll:
      // const isTop = scrollTop === 0;
      const isBottom = scrollHeight - scrollTop <= clientHeight
      // if (isTop) {
      //   console.log('Reached top of scroll-node');
      // } else if (isBottom) {
      //   console.log('Reached bottom of scroll-node');
      // }

      setIsBottomOfList(isBottom)
    }

    const { current } = containerRef

    current?.addEventListener('scroll', handleScroll)
    return () => current?.removeEventListener('scroll', handleScroll)
  }, [onScroll])

  return (
    <Container ref={containerRef} $nodeWidth={nodeWidth} $nodeHeight={nodeHeight} className='nowheel nodrag'>
      {items.map((item) => (
        <BaseNodeWrapper
          key={item.id}
          $framePadding={item.data.framePadding}
          onClick={(e) => {
            e.stopPropagation()
            // @ts-ignore
            onClickNode(e, item)
          }}
        >
          <BaseNode {...rest} type={NODE_TYPES.BASE} id={item.id} data={item.data} />
        </BaseNodeWrapper>
      ))}

      <LoadMoreWrapper $hide={isBottomOfList}>
        {/* {paginationNotFinished && (
          <LoadMoreButton
            variant='secondary'
            onClick={(e) => {
              e.stopPropagation();
              fetchSources(true);
            }}
          >
            load more
          </LoadMoreButton>
        )} */}
      </LoadMoreWrapper>
    </Container>
  )
})
