import React, { useEffect, type FC } from 'react'
import styled from 'styled-components'
import type { Platform } from '../../@types'
import { useFilterStore } from '../../store'
import { SearchIcon } from '@odigos/ui-icons'
import { ConnectionStatusDropdown } from '../../helpers'
import { Badge, Divider, FlexRow, Input, Text } from '@odigos/ui-components'

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

const ComputePlatformsActionsMenu: FC<ComputePlatformsActionsMenuProps> = ({ computePlatforms }) => {
  const { searchText, setSearchText, statuses, setStatuses, clearAll } = useFilterStore()

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
          <ConnectionStatusDropdown
            computePlatforms={computePlatforms}
            value={statuses}
            onSelect={(val) => setStatuses([...(statuses || []), val])}
            onDeselect={(val) => setStatuses((statuses || []).filter((opt) => opt.id !== val.id))}
            showSearch
            required
            isMulti
          />
        </SearchAndFilterWrapper>
      </FlexRow>
    </Container>
  )
}

export { ComputePlatformsActionsMenu, type ComputePlatformsActionsMenuProps }
