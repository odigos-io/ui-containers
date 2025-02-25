import React, { type FC, memo, useMemo } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { useClickNode } from '../../../helpers'
import type { Node, NodeProps } from '@xyflow/react'
import { PlusIcon, type SVG } from '@odigos/ui-icons'
import { ENTITY_TYPES, type Source } from '@odigos/ui-utils'
import { ADD_NODE_TYPES, NODE_TYPES } from '../../../@types'
import { useInstrumentStore, usePendingStore, useSelectedStore } from '../../../store'
import { Button, Checkbox, FlexRow, IconTitleBadge, Text } from '@odigos/ui-components'

export interface HeaderNodeProps
  extends NodeProps<
    Node<
      {
        nodeWidth: number
        icon: SVG
        title: string
        tagValue: string | number
        isFetching?: boolean
        sources?: Source[]
      },
      NODE_TYPES.HEADER
    >
  > {}

const Container = styled.div<{ $nodeWidth: HeaderNodeProps['data']['nodeWidth'] }>`
  position: relative;
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

const Progress = styled.div<{ percent: number }>`
  position: absolute;
  bottom: -2px;
  left: 0;
  background-color: ${({ theme }) => theme.colors.majestic_blue};
  border-radius: 32px;
  height: 4px;
  width: ${({ percent }) => `${percent}%`};
  transition: width 0.3s;
`

export const HeaderNode: React.FC<HeaderNodeProps> = memo(({ id: nodeId, data }) => {
  const { nodeWidth, title, icon: Icon, tagValue, isFetching, sources } = data
  const entityType = nodeId.split('-')[0] as ENTITY_TYPES

  const { isAwaitingInstrumentation, sourcesToCreate, sourcesCreated, sourcesToDelete, sourcesDeleted } = useInstrumentStore()
  const isSourceAwaitingInstrumentation = entityType === ENTITY_TYPES.SOURCE && isAwaitingInstrumentation
  const instrumentingPercent =
    (!!sourcesToCreate
      ? Math.floor((100 / sourcesToCreate) * sourcesCreated)
      : !!sourcesToDelete
      ? Math.floor((100 / sourcesToDelete) * sourcesDeleted)
      : 0) || 1

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
      {entityType === ENTITY_TYPES.SOURCE && (
        <SelectorWrapper>
          <Checkbox
            partiallyChecked={hasSelected && sources?.length !== totalSelectedSources}
            value={hasSelected && sources?.length === totalSelectedSources}
            onChange={onSelect}
            disabled={!sources?.length}
          />
        </SelectorWrapper>
      )}
      <IconTitleBadge icon={Icon} title={title} badge={tagValue} loading={isFetching && !isSourceAwaitingInstrumentation} />
      <Actions entityType={entityType} />

      {isSourceAwaitingInstrumentation && <Progress percent={instrumentingPercent} />}
    </Container>
  )
})

const Actions: FC<{ entityType: ENTITY_TYPES }> = memo(({ entityType }) => {
  const theme = Theme.useTheme()
  const { onClickNode } = useClickNode()

  return (
    <ActionsWrapper>
      <AddButton
        data-id={`add-${entityType}`}
        variant='primary'
        onClick={() => {
          // @ts-ignore
          onClickNode(undefined, {
            data: {
              type:
                entityType === ENTITY_TYPES.SOURCE
                  ? ADD_NODE_TYPES.ADD_SOURCE
                  : entityType === ENTITY_TYPES.DESTINATION
                  ? ADD_NODE_TYPES.ADD_DESTINATION
                  : entityType === ENTITY_TYPES.ACTION
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
})
