import React, { useRef, useState } from 'react'
import Theme from '@odigos/ui-theme'
import type { Platform } from '../../@types'
import styled, { css } from 'styled-components'
import { useNotificationStore } from '../../store'
import { OverviewIcon, SearchIcon } from '@odigos/ui-icons'
import { SelectionButton } from '../data-flow-actions-menu/selection-button'
import { Button, ExtendArrow, FlexRow, Input, Text } from '@odigos/ui-components'
import { getPlatformIcon, getPlatformLabel, NOTIFICATION_TYPE, useKeyDown, useOnClickOutside } from '@odigos/ui-utils'

interface ComputePlatformSelectProps {
  computePlatforms: Platform[]
  selected?: Platform
  onSelect: (payload: Platform) => void
  onViewAll: () => void
}

const Tab = styled(FlexRow)<{ $withSelect: boolean }>`
  width: 260px;
  padding: 4px;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 32px;
  cursor: ${({ $withSelect }) => ($withSelect ? 'pointer' : 'default')};

  ${({ $withSelect }) =>
    $withSelect &&
    css`
      &:hover {
        border: 1px solid ${({ theme }) => theme.colors.secondary};
      }
    `}
`

const Title = styled(Text)`
  font-size: 14px;
  margin-right: 10px;
  color: ${({ theme }) => theme.text.secondary};
`

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.colors.info};
`

const PushToEnd = styled.div`
  margin-left: auto;
  margin-right: 6px;
`

const RelativeContainer = styled.div`
  position: relative;
`

const AbsoluteContainer = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.dropdown_bg};
  border: ${({ theme }) => `1px solid ${theme.colors.border}`};
  border-radius: 24px;
  width: 420px;
`

const VerticalScroll = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  overflow-y: scroll;
`

const HeadWrap = styled.div`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.border}`};
  padding: 12px;
`

const FootWrap = styled.div`
  border-top: ${({ theme }) => `1px solid ${theme.colors.border}`};
  padding: 12px;
`

const ComputePlatformSelect: React.FC<ComputePlatformSelectProps> = ({ computePlatforms, selected, onSelect, onViewAll }) => {
  const theme = Theme.useTheme()
  const { addNotification } = useNotificationStore()

  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')

  const onClose = () => {
    setIsOpen(false)
  }

  const containerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, onClose)
  useKeyDown({ key: 'Escape', active: isOpen }, onClose)

  const withSelect = !!computePlatforms.length
  const filtered = computePlatforms.filter(({ id }) => id.toLowerCase().includes(searchText))
  const Icon = !!selected?.type ? getPlatformIcon(selected.type) : null

  return (
    <RelativeContainer ref={containerRef}>
      <Tab $withSelect={withSelect} onClick={() => setIsOpen((prev) => !prev)}>
        <LogoWrap>{!!Icon ? <Icon size={20} fill={theme.text.info} /> : <OverviewIcon fill={theme.text.info} />}</LogoWrap>
        <Title>{selected?.name || selected?.id || 'no platform'}</Title>

        {withSelect && (
          <PushToEnd>
            <ExtendArrow extend={isOpen} align='right' />
          </PushToEnd>
        )}
      </Tab>

      {isOpen && withSelect && (
        <AbsoluteContainer>
          <HeadWrap>
            <Input placeholder='Search...' icon={SearchIcon} value={searchText} onChange={(e) => setSearchText(e.target.value.toLowerCase())} />
          </HeadWrap>

          <VerticalScroll style={{ maxHeight: '240px' }}>
            {filtered.map(({ id, type, name, connectionStatus }, idx) => (
              <SelectionButton
                key={`platform-${id}`}
                icon={() => getPlatformIcon(type)({ fill: connectionStatus === NOTIFICATION_TYPE.SUCCESS ? theme.text.success : theme.text.error })}
                label={`${!!name ? name : getPlatformLabel(type)} (${id})`}
                isSelected={selected?.id === id}
                onClick={() => {
                  if (connectionStatus === NOTIFICATION_TYPE.SUCCESS) {
                    onSelect(filtered[idx])
                  } else {
                    addNotification({
                      type: NOTIFICATION_TYPE.WARNING,
                      title: 'TODO',
                      message: 'Functionality is not implemented yet',
                      hideFromHistory: true,
                    })
                  }
                  onClose()
                }}
                color='transparent'
                style={{ width: '100%', justifyContent: 'flex-start' }}
              />
            ))}
          </VerticalScroll>

          <FootWrap>
            <Button variant='secondary' style={{ width: '100%' }} onClick={onViewAll}>
              VIEW ALL
            </Button>
          </FootWrap>
        </AbsoluteContainer>
      )}
    </RelativeContainer>
  )
}

export { ComputePlatformSelect, type ComputePlatformSelectProps }
