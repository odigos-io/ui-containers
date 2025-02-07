import React, { useMemo } from 'react'
import styled from 'styled-components'
import { ENTITY_TYPES } from '@odigos/ui-utils'
import type { Node, NodeProps } from '@xyflow/react'
import { ADD_NODE_TYPES, NODE_TYPES, type Source } from '../../../@types'
import { DRAWER_OTHER_TYPES, usePendingStore, useSelectedStore } from '../../../store'
import { Badge, Checkbox, FadeLoader, IconButton, Text } from '@odigos/ui-components'
import { PlusIcon } from '@odigos/ui-icons'
import { useClickNode, useClickNotification } from '../../../helpers'

export interface HeaderNodeProps
  extends NodeProps<
    Node<
      {
        nodeWidth: number
        icon: string
        title: string
        tagValue: string | number
        isFetching?: boolean
        sources?: Source[]
      },
      NODE_TYPES.HEADER
    >
  > {}

const Container = styled.div<{ $nodeWidth: HeaderNodeProps['data']['nodeWidth'] }>`
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

export const HeaderNode: React.FC<HeaderNodeProps> = ({ id: nodeId, data }) => {
  const { nodeWidth, title, icon: Icon, tagValue, isFetching, sources } = data
  const entity = nodeId.split('-')[0] as ENTITY_TYPES

  const { selectedSources, setSelectedSources } = useSelectedStore()
  const { isThisPending } = usePendingStore()
  const { onClickNode } = useClickNode()

  const [hasSelected, totalSelectedSources] = useMemo(() => {
    let num = 0

    Object.values(selectedSources).forEach((selectedSources) => {
      num += selectedSources.length
    })

    return [num !== 0, num]
  }, [selectedSources])

  const renderActions = () => {
    if (entity !== ENTITY_TYPES.SOURCE || !sources?.length) return null

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
        <Checkbox
          partiallyChecked={hasSelected && sources.length !== totalSelectedSources}
          value={hasSelected && sources.length === totalSelectedSources}
          onChange={onSelect}
        />
      </ActionsWrapper>
    )
  }

  return (
    <Container $nodeWidth={nodeWidth} className='nowheel nodrag'>
      {Icon && <Icon />}
      <Title size={14}>{title}</Title>
      <Badge label={tagValue} />
      {isFetching ? (
        <FadeLoader />
      ) : (
        <Badge
          label={<PlusIcon />}
          filled={!!tagValue}
          onClick={() => {
            // @ts-ignore
            onClickNode(undefined, {
              data: {
                type:
                  entity === ENTITY_TYPES.SOURCE
                    ? ADD_NODE_TYPES.ADD_SOURCE
                    : entity === ENTITY_TYPES.DESTINATION
                    ? ADD_NODE_TYPES.ADD_DESTINATION
                    : entity === ENTITY_TYPES.ACTION
                    ? ADD_NODE_TYPES.ADD_ACTION
                    : ADD_NODE_TYPES.ADD_RULE,
              },
            })
          }}
        />
      )}

      {renderActions()}
    </Container>
  )
}
