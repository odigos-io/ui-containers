import React from 'react'
import styled from 'styled-components'
import { NODE_TYPES } from '../../../@types'
import { DataTab, FadeLoader } from '@odigos/ui-components'
import { ErrorTriangleIcon, type SVG } from '@odigos/ui-icons'
import { usePendingStore, useSelectedStore } from '../../../store'
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
        icons?: SVG[]
        iconSrc?: string
        iconSrcs?: string[]
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
  const { nodeWidth, id: entityId, type: entityType, status, title, subTitle, icon, icons, iconSrc, iconSrcs, monitors, isActive, raw } = data
  const isError = status === HEALTH_STATUS.UNHEALTHY
  const isSource = entityType === ENTITY_TYPES.SOURCE

  const { isThisPending } = usePendingStore()
  const isPending = isThisPending({ entityType, entityId })

  const renderActions = () => {
    const sourceIsInstrumenting =
      isSource &&
      (!(raw as Source).conditions?.length ||
        (raw as Source).conditions?.some(({ status }) => status === CONDITION_STATUS.UNKNOWN || status === NOTIFICATION_TYPE.WARNING))

    return (
      <>
        {/* TODO: handle action/icon to apply instrumentation-rules for individual sources (@Notion GEN-1650) */}
        {isPending || sourceIsInstrumenting ? <FadeLoader /> : isError ? <ErrorTriangleIcon size={20} /> : null}
      </>
    )
  }

  const { selectedSources, setSelectedSources } = useSelectedStore()
  const namespaces = { ...selectedSources }

  const { namespace, name, kind } = raw as Source
  if (isSource && !namespaces[namespace]) namespaces[namespace] = []
  const sourceIndex = isSource ? namespaces[namespace].findIndex((x) => x.name === name && x.kind === kind) : -1

  const onSelectSource = () => {
    if (sourceIndex === -1) {
      namespaces[namespace].push(raw as Source)
    } else {
      namespaces[namespace].splice(sourceIndex, 1)
    }

    setSelectedSources(namespaces)
  }

  return (
    <Container data-id={nodeId} $nodeWidth={nodeWidth} className='nowheel nodrag'>
      <DataTab
        title={title}
        subTitle={subTitle}
        icon={icon}
        icons={icons}
        iconSrc={iconSrc}
        iconSrcs={iconSrcs}
        monitors={monitors}
        isActive={isActive}
        isError={isError}
        withCheckbox={isSource}
        isChecked={sourceIndex !== -1}
        onCheckboxChange={onSelectSource}
        isCheckboxDisabled={isPending}
        renderActions={renderActions}
        onClick={() => {}}
      />
      <Handle type='target' position={Position.Left} style={{ visibility: 'hidden' }} />
      <Handle type='source' position={Position.Right} style={{ visibility: 'hidden' }} />
    </Container>
  )
}
