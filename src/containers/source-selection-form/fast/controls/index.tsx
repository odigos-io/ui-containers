import React, { FC } from 'react'
import styled from 'styled-components'
import { SearchIcon } from '@odigos/ui-icons'
import type { UseSourceSelectionFormData } from '../../../../helpers'
import { Divider, Input, SectionTitle, Toggle } from '@odigos/ui-components'

interface ControlsProps extends UseSourceSelectionFormData {
  isModal?: boolean
}

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

// when bringin back the "Select all" checkbox, change the following width to 300px
const SearchWrapper = styled.div`
  width: 444px;
`

const Controls: FC<ControlsProps> = ({ selectedSources, searchText, setSearchText, showSelectedOnly, setShowSelectedOnly }) => {
  const selectedAppsCount = Object.values(selectedSources).reduce((prev, curr) => prev + curr.filter((s) => s.selected).length, 0)

  return (
    <>
      <SectionTitle
        title='Select Sources for Instrumentation'
        badgeLabel={selectedAppsCount}
        description='Select apps to monitor in each namespace. Odigos will instrument them and send telemetry data to your destinations.'
      />

      <FlexContainer style={{ marginTop: 24 }}>
        <SearchWrapper>
          <Input
            placeholder='Search Kubernetes Namespaces'
            icon={SearchIcon}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
          />
        </SearchWrapper>
        {/* <Checkbox title='Select all' value={selectAll} onChange={onSelectAll} /> */}
        <Toggle title='Show selected only' initialValue={showSelectedOnly} onChange={setShowSelectedOnly} />
      </FlexContainer>

      <Divider margin='16px 0' />
    </>
  )
}

export { Controls, type ControlsProps }
