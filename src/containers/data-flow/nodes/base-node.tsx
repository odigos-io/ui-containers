import React from 'react'
import styled from 'styled-components'
import { NODE_TYPES } from '../../../@types'
import { ErrorTriangleIcon, type SVG } from '@odigos/ui-icons'
import { usePendingStore, useSelectedStore } from '../../../store'
import { Checkbox, DataTab, FadeLoader } from '@odigos/ui-components'
import { Handle, type Node, type NodeProps, Position } from '@xyflow/react'
import {
  type Action,
  CONDITION_STATUS,
  type Destination,
  ENTITY_TYPES,
  HEALTH_STATUS,
  type InstrumentationRule,
  NOTIFICATION_TYPE,
  SIGNAL_TYPE,
  type Source,
  type WorkloadId,
} from '@odigos/ui-utils'

export interface BaseNodeProps
  extends NodeProps<
    Node<
      {
        nodeWidth: number
        id: string | WorkloadId
        type: ENTITY_TYPES
        status: HEALTH_STATUS
        title: string
        subTitle: string
        icon?: SVG
        iconSrc?: string
        monitors?: SIGNAL_TYPE[]
        isActive?: boolean
        raw: Source | Destination | Action | InstrumentationRule
      },
      NODE_TYPES.BASE
    >
  > {}

const Container = styled.div<{ $nodeWidth: BaseNodeProps['data']['nodeWidth'] }>`
  width: ${({ $nodeWidth }) => `${$nodeWidth}px`};
`

export const BaseNode: React.FC<BaseNodeProps> = ({ id: nodeId, data }) => {
  const { nodeWidth, id: entityId, type: entityType, status, title, subTitle, icon, iconSrc, monitors, isActive, raw } = data
  const isError = status === HEALTH_STATUS.UNHEALTHY
  const isSource = entityType === ENTITY_TYPES.SOURCE

  const { selectedSources, setSelectedSources } = useSelectedStore()
  const { isThisPending } = usePendingStore()

  const renderActions = () => {
    const { namespace, name, kind } = raw as Source
    const sources = { ...selectedSources }
    if (!sources[namespace]) sources[namespace] = []

    const index = sources[namespace].findIndex((x) => x.name === name && x.kind === kind)

    const onSelectSource = () => {
      if (index === -1) {
        sources[namespace].push(raw as Source)
      } else {
        sources[namespace].splice(index, 1)
      }

      setSelectedSources(sources)
    }

    const isPending = isThisPending({ entityType, entityId })
    const sourceIsInstrumenting =
      isSource &&
      (!(raw as Source).conditions?.length ||
        (raw as Source).conditions?.some(({ status }) => status === CONDITION_STATUS.UNKNOWN || status === NOTIFICATION_TYPE.WARNING))

    return (
      <>
        {/* TODO: handle action/icon to apply instrumentation-rules for individual sources (@Notion GEN-1650) */}
        {isPending || sourceIsInstrumenting ? <FadeLoader /> : isError ? <ErrorTriangleIcon size={20} /> : null}
        {isSource ? <Checkbox value={index !== -1} onChange={onSelectSource} disabled={isPending} /> : null}
      </>
    )
  }

  return (
    <Container data-id={nodeId} $nodeWidth={nodeWidth} className='nowheel nodrag'>
      <DataTab
        title={title}
        subTitle={subTitle}
        icon={icon}
        iconSrc={iconSrc}
        monitors={monitors}
        isActive={isActive}
        isError={isError}
        onClick={() => {}}
        renderActions={renderActions}
      />
      <Handle type='target' position={Position.Left} style={{ visibility: 'hidden' }} />
      <Handle type='source' position={Position.Right} style={{ visibility: 'hidden' }} />
    </Container>
  )
}
