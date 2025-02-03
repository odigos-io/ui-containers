import React, { useMemo } from 'react'
import styled from 'styled-components'
import { NODE_TYPES } from '../../../@types'
import { useAppStore } from '../../../store'
import type { Node, NodeProps } from '@xyflow/react'
import { Badge, Checkbox, FadeLoader, Text } from '@odigos/ui-components'

interface Props
  extends NodeProps<
    Node<
      {
        nodeWidth: number
        icon: string
        title: string
        tagValue: string | number
        isFetching?: boolean
        onCheckboxChange?: (bool: boolean) => void
      },
      NODE_TYPES.HEADER
    >
  > {}

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

const HeaderNode: React.FC<Props> = ({ data }) => {
  const { nodeWidth, title, icon: Icon, tagValue, isFetching, onCheckboxChange } = data
  const isSources = title.toLowerCase() === 'sources'

  const { configuredSources } = useAppStore()
  const totalSelectedSources = useMemo(() => {
    let num = 0

    Object.values(configuredSources).forEach((selectedSources) => {
      num += selectedSources.length
    })

    return num
  }, [configuredSources])

  const renderActions = () => {
    if (!isSources || !onCheckboxChange) return null

    const arr = String(tagValue).split('/')
    let totalAmount = 0
    if (arr.length > 1) {
      totalAmount = Number(arr[1].trim())
    } else {
      totalAmount = Number(arr[0].trim())
    }

    return (
      <ActionsWrapper>
        <Checkbox value={!!totalAmount && totalAmount === totalSelectedSources} onChange={onCheckboxChange} />
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

export default HeaderNode
