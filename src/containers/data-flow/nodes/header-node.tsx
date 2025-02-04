import React, { useMemo } from 'react'
import styled from 'styled-components'
import { ENTITY_TYPES } from '@odigos/ui-utils'
import type { Node, NodeProps } from '@xyflow/react'
import { NODE_TYPES, type Source } from '../../../@types'
import { usePendingStore, useSelectedStore } from '../../../store'
import { Badge, Checkbox, FadeLoader, Text } from '@odigos/ui-components'

export interface HeaderNodeProps
  extends NodeProps<
    Node<
      {
        nodeWidth: number
        icon: string
        title: string
        tagValue: string | number
        isFetching?: boolean
      },
      NODE_TYPES.HEADER
    >
  > {}

interface Props extends HeaderNodeProps {
  sources: Source[]
}

const Container = styled.div<{ $nodeWidth: Props['data']['nodeWidth'] }>`
  width: ${({ $nodeWidth }) => `${$nodeWidth}px`};
  padding: 12px 0px 16px 0px;
  gap: 8px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Title = styled(Text)`
  color: ${({ theme }) => theme.text.grey};
`

const ActionsWrapper = styled.div`
  margin-left: auto;
  margin-right: 16px;
`

export const HeaderNode: React.FC<Props> = ({ data, sources }) => {
  const { nodeWidth, title, icon: Icon, tagValue, isFetching } = data
  const isSources = title.toLowerCase() === 'sources'

  const { selectedSources, setSelectedSources } = useSelectedStore()
  const { isThisPending } = usePendingStore()

  const totalSelectedSources = useMemo(() => {
    let num = 0

    Object.values(selectedSources).forEach((selectedSources) => {
      num += selectedSources.length
    })

    return num
  }, [selectedSources])

  const renderActions = () => {
    if (!isSources || !sources.length) return null

    const onSelect = (bool: boolean) => {
      if (bool) {
        const payload: Record<string, Source[]> = {}

        sources.forEach((source) => {
          const id = { namespace: source.namespace, name: source.name, kind: source.kind }
          const isPending = isThisPending({ entityType: ENTITY_TYPES.SOURCE, entityId: id })

          if (!isPending) {
            if (!payload[source.namespace]) {
              payload[source.namespace] = [source]
            } else {
              payload[source.namespace].push(source)
            }
          }
        })

        setSelectedSources(payload)
      } else {
        setSelectedSources({})
      }
    }

    return (
      <ActionsWrapper>
        <Checkbox value={!!sources.length && sources.length === totalSelectedSources} onChange={onSelect} />
      </ActionsWrapper>
    )
  }

  return (
    <Container $nodeWidth={nodeWidth} className='nowheel nodrag'>
      {Icon && <Icon />}
      <Title size={14}>{title}</Title>
      <Badge label={tagValue} />
      {isFetching && <FadeLoader />}

      {renderActions()}
    </Container>
  )
}
