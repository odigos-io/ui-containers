import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { SearchIcon } from '@odigos/ui-icons'
import { SIGNAL_TYPE } from '@odigos/ui-utils'
import { DestinationsList } from './destinations-list'
import type { DestinationCategories } from '../../../@types'
import { PotentialDestinationsList, PotentialDestinationsListProps } from './potential-destinations-list'
import { Divider, Dropdown, Input, MonitorsCheckboxes, NoDataFound, SectionTitle } from '@odigos/ui-components'

interface Props {
  hidden?: boolean
  categories: DestinationCategories
  potentialDestinations: PotentialDestinationsListProps['items']
  onSelect: (item: DestinationCategories[0]['items'][0]) => void
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const WidthConstraint = styled.div`
  width: 160px;
  margin-right: 8px;
`

const ListsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 24px;
  max-height: calc(100vh - 450px);
  overflow-y: auto;

  @media (height < 800px) {
    max-height: calc(100vh - 400px);
  }
`

const NoDataFoundWrapper = styled(Container)`
  margin-top: 80px;
`

const DROPDOWN_OPTIONS = [
  { value: 'All types', id: 'all' },
  { value: 'Managed', id: 'managed' },
  { value: 'Self-hosted', id: 'self hosted' },
]

const DEFAULT_CATEGORY = DROPDOWN_OPTIONS[0]
const DEFAULT_MONITORS: SIGNAL_TYPE[] = [SIGNAL_TYPE.LOGS, SIGNAL_TYPE.METRICS, SIGNAL_TYPE.TRACES]

export const ChooseDestinationBody: React.FC<Props> = ({ hidden, categories, potentialDestinations, onSelect }) => {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY)
  const [selectedMonitors, setSelectedMonitors] = useState<SIGNAL_TYPE[]>(DEFAULT_MONITORS)

  const filteredDestinations = useMemo(() => {
    return categories
      .map((category) => {
        const filteredItems = category.items.filter((item) => {
          const matchesSearch = !search || item.displayName.toLowerCase().includes(search.toLowerCase())
          const matchesCategory = selectedCategory.id === 'all' || selectedCategory.id === category.name
          const matchesMonitor = selectedMonitors.some((monitor) => item.supportedSignals[monitor.toLowerCase() as SIGNAL_TYPE]?.supported)

          return matchesSearch && matchesCategory && matchesMonitor
        })

        return { ...category, items: filteredItems }
      })
      .filter(({ items }) => !!items.length) // Filter out empty categories
  }, [categories, search, selectedCategory, selectedMonitors])

  if (hidden) return null

  return (
    <Container>
      <SectionTitle title='Choose destination' description='Add backend destination you want to connect with Odigos.' />

      <Filters>
        <WidthConstraint>
          <Input placeholder='Search...' icon={SearchIcon} value={search} onChange={({ target: { value } }) => setSearch(value)} />
        </WidthConstraint>
        <WidthConstraint>
          <Dropdown options={DROPDOWN_OPTIONS} value={selectedCategory} onSelect={(opt) => setSelectedCategory(opt)} onDeselect={() => {}} />
        </WidthConstraint>
        <MonitorsCheckboxes title='' selectedSignals={selectedMonitors} setSelectedSignals={setSelectedMonitors} />
      </Filters>

      <Divider />

      {!filteredDestinations.length && !potentialDestinations.length ? (
        <NoDataFoundWrapper>
          <NoDataFound title='No destinations found' />
        </NoDataFoundWrapper>
      ) : (
        <ListsContainer>
          <PotentialDestinationsList items={potentialDestinations} setSelectedItem={onSelect} />
          <DestinationsList items={filteredDestinations} setSelectedItem={onSelect} />
        </ListsContainer>
      )}
    </Container>
  )
}
