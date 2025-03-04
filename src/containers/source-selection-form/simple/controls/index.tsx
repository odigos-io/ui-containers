import React, { type FC } from 'react'
import styled from 'styled-components'
import { SearchIcon } from '@odigos/ui-icons'
import type { Namespace } from '@odigos/ui-utils'
import { NamespaceDropdown, type UseSourceSelectionFormData } from '../../../../helpers'
import { Badge, Checkbox, Divider, Input, SectionTitle, Text, Toggle } from '@odigos/ui-components'

interface ControlsProps extends UseSourceSelectionFormData {
  isModal?: boolean
  namespaces: Namespace[]
  selectedNamespace: string
  onSelectNamespace: (namespace: string) => void
}

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`

const Controls: FC<ControlsProps> = ({
  namespaces,
  selectedNamespace,
  onSelectNamespace,

  selectedSources,
  onSelectAll,
  selectedFutureApps,
  onSelectFutureApps,

  searchText,
  setSearchText,
  showSelectedOnly,
  setShowSelectedOnly,
}) => {
  const futureApps = selectedFutureApps[selectedNamespace] || false
  const sources = selectedSources[selectedNamespace] || []
  const selectedAppsCount = sources.filter(({ selected }) => selected).length

  return (
    <>
      <SectionTitle
        title='Choose sources'
        description="Apps will be automatically instrumented, and data will be sent to the relevant APM's destinations."
      />

      <FlexContainer style={{ marginTop: 24 }}>
        <Input placeholder='Search for sources' icon={SearchIcon} value={searchText} onChange={(e) => setSearchText(e.target.value.toLowerCase())} />
        <NamespaceDropdown
          namespaces={namespaces}
          title=''
          value={selectedNamespace ? [{ value: selectedNamespace, id: selectedNamespace }] : []}
          onSelect={({ id }) => !!id && onSelectNamespace(id)}
          onDeselect={({ id }) => !!id && onSelectNamespace(id)}
        />
      </FlexContainer>

      <Divider margin='16px 0' />

      <FlexContainer>
        <FlexContainer>
          <Text>Selected apps</Text>
          <Badge label={selectedAppsCount} filled={!!selectedAppsCount} />
        </FlexContainer>

        <ToggleWrapper>
          <Toggle title='Select all' initialValue={!!selectedAppsCount && selectedAppsCount === sources.length} onChange={onSelectAll} />
          <Toggle title='Show selected only' initialValue={showSelectedOnly} onChange={setShowSelectedOnly} />
          <Checkbox title='Future apps' tooltip='Automatically instrument all future apps' value={futureApps} onChange={onSelectFutureApps} />
        </ToggleWrapper>
      </FlexContainer>

      <Divider margin='16px 0 24px' />
    </>
  )
}

export { Controls, type ControlsProps }
