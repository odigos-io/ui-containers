import React, { FC, useMemo } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { PlusIcon } from '@odigos/ui-icons'
import { useClickNode } from '../../../helpers'
import type { Node, NodeProps } from '@xyflow/react'
import { ENTITY_TYPES, type Source } from '@odigos/ui-utils'
import { ADD_NODE_TYPES, NODE_TYPES } from '../../../@types'
import { usePendingStore, useSelectedStore } from '../../../store'
import { Badge, Button, Checkbox, Divider, FadeLoader, FlexRow, Text } from '@odigos/ui-components'

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
  gap: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Title = styled(Text)`
  color: ${({ theme }) => theme.text.grey};
`

const SelectorWrapper = styled(FlexRow)`
  margin-left: 16px;
`

const ActionsWrapper = styled(FlexRow)`
  margin-left: auto;
`

const AddButton = styled(Button)`
  width: 24px;
  height: 24px;
  padding: 0;
`

export const HeaderNode: React.FC<HeaderNodeProps> = ({ id: nodeId, data }) => {
  const { nodeWidth, title, icon: Icon, tagValue, isFetching, sources } = data
  const entity = nodeId.split('-')[0] as ENTITY_TYPES

  const { selectedSources, setSelectedSources } = useSelectedStore()
  const { isThisPending } = usePendingStore()

  const [hasSelected, totalSelectedSources] = useMemo(() => {
    let num = 0

    Object.values(selectedSources).forEach((selectedSources) => {
      num += selectedSources.length
    })

    return [num !== 0, num]
  }, [selectedSources])

  const onSelect = (bool: boolean) => {
    if (bool) {
      const payload: Record<string, Source[]> = {}

      sources?.forEach((source) => {
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
    <Container $nodeWidth={nodeWidth} className='nowheel nodrag'>
      {entity === ENTITY_TYPES.SOURCE && !!sources?.length && (
        <SelectorWrapper>
          <Checkbox
            partiallyChecked={hasSelected && sources.length !== totalSelectedSources}
            value={hasSelected && sources.length === totalSelectedSources}
            onChange={onSelect}
          />
        </SelectorWrapper>
      )}

      <FlexRow $gap={6}>
        {Icon && <Icon />}
        <Title size={14}>{title}</Title>
        <Badge label={tagValue} />
        {isFetching ? <FadeLoader /> : null}
      </FlexRow>

      <Actions entity={entity} />
    </Container>
  )
}

const Actions: FC<{ entity: ENTITY_TYPES }> = ({ entity }) => {
  const theme = Theme.useTheme()
  const { onClickNode } = useClickNode()

  return (
    <ActionsWrapper>
      <AddButton
        data-id={`add-${entity}`}
        variant='primary'
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
      >
        <PlusIcon fill={theme.colors.primary} size={18} />
      </AddButton>
    </ActionsWrapper>
  )
}
