import React, { useEffect, type FC } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import type { Platform } from '../../@types'
import { useFilterStore, useNotificationStore } from '../../store'
import { PlatformTypesDropdown } from '../../helpers'
import { PlusIcon, SearchIcon } from '@odigos/ui-icons'
import { Badge, Button, Divider, FlexRow, Input, Text } from '@odigos/ui-components'
import { NOTIFICATION_TYPE } from '@odigos/ui-utils'

interface ComputePlatformsActionsMenuProps {
  computePlatforms: Platform[]
}

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  padding: 0 16px;
  gap: 8px;
`

const Title = styled(Text)`
  font-size: 24px;
  white-space: nowrap;
`

const SearchAndFilterWrapper = styled.div`
  width: 200px;
`

// Aligns the content to the right.
const PushToEnd = styled.div`
  margin-left: auto;
`

const AddButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 160px;
  padding-right: 24px;
`

const AddButtonText = styled(Text)`
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.font_family.secondary};
  font-weight: 600;
`

const ComputePlatformsActionsMenu: FC<ComputePlatformsActionsMenuProps> = ({ computePlatforms }) => {
  const theme = Theme.useTheme()
  const { addNotification } = useNotificationStore()
  const { searchText, setSearchText, platformTypes, setPlatformTypes, clearAll } = useFilterStore()

  // cleanup filters on unmount
  useEffect(() => {
    return () => clearAll()
  }, [clearAll])

  return (
    <Container>
      <FlexRow $gap={16}>
        <FlexRow $gap={12}>
          <Title>Compute platforms</Title>
          <Badge label={computePlatforms.length} filled={!!computePlatforms.length} />
        </FlexRow>

        <Divider orientation='vertical' length='20px' margin='0' />

        <SearchAndFilterWrapper>
          <Input placeholder='Search...' icon={SearchIcon} value={searchText} onChange={(e) => setSearchText(e.target.value.toLowerCase())} />
        </SearchAndFilterWrapper>
        <SearchAndFilterWrapper>
          <PlatformTypesDropdown
            computePlatforms={computePlatforms}
            value={platformTypes}
            onSelect={(val) => setPlatformTypes([...(platformTypes || []), val])}
            onDeselect={(val) => setPlatformTypes((platformTypes || []).filter((opt) => opt.id !== val.id))}
            showSearch
            required
            isMulti
          />
        </SearchAndFilterWrapper>
      </FlexRow>

      <PushToEnd>
        <AddButton
          data-id='add-platform'
          onClick={() =>
            addNotification({
              type: NOTIFICATION_TYPE.WARNING,
              title: 'TODO Development',
              message: 'Functionality is not implemented yet',
            })
          }
        >
          <PlusIcon fill={theme.colors.primary} />
          <AddButtonText size={14}>ADD PLATFORM</AddButtonText>
        </AddButton>
      </PushToEnd>
    </Container>
  )
}

export { ComputePlatformsActionsMenu, type ComputePlatformsActionsMenuProps }
