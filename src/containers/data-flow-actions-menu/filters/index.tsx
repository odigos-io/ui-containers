import React, { useEffect, useRef, useState } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { FilterIcon } from '@odigos/ui-icons'
import { SelectionButton } from '../selection-button'
import { Button, Toggle } from '@odigos/ui-components'
import { AbsoluteContainer, RelativeContainer } from '../styled'
import { useFilterStore, type FiltersState } from '../../../store'
import { type Source, useKeyDown, useOnClickOutside } from '@odigos/ui-utils'
import { ErrorDropdown, KindDropdown, LanguageDropdown, MonitorDropdown, NamespaceDropdown } from '../../../helpers'

interface Props {
  namespaces: { name: string }[]
  sources: Source[]
}

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
`

const ToggleWrapper = styled.div`
  padding: 12px 6px 6px 6px;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-top: ${({ theme }) => `1px solid ${theme.colors.border}`};
`

const getFilterCount = (params: FiltersState) => {
  let count = 0
  count += params.namespaces?.length || 0
  count += params.kinds?.length || 0
  count += params.monitors?.length || 0
  count += params.languages?.length || 0
  count += params.errors?.length || 0
  if (!!params.onlyErrors) count++
  return count
}

export const Filters: React.FC<Props> = ({ namespaces: namespaceItems, sources: sourceItems }) => {
  const theme = Theme.useTheme()
  const { namespaces, kinds, monitors, languages, errors, onlyErrors, setAll, clearAll, getEmptyState } = useFilterStore()

  // We need local state, because we want to keep the filters in the store only when the user clicks on apply
  const [filters, setFilters] = useState<FiltersState>({ namespaces, kinds, monitors, languages, errors, onlyErrors })
  const [filterCount, setFilterCount] = useState(getFilterCount(filters))
  const [focused, setFocused] = useState(false)
  const toggleFocused = () => setFocused((prev) => !prev)

  useEffect(() => {
    if (!focused) {
      const payload = { namespaces, kinds, monitors, languages, errors, onlyErrors }
      setFilters(payload)
      setFilterCount(getFilterCount(payload))
    }
  }, [focused, namespaces, kinds, monitors, errors, onlyErrors])

  const onApply = () => {
    setAll(filters)
    setFilterCount(getFilterCount(filters))
    setFocused(false)
  }

  const onCancel = () => {
    setFocused(false)
  }

  const onReset = () => {
    clearAll()
    setFilters(getEmptyState())
    setFilterCount(0)
    setFocused(false)
  }

  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, onCancel)
  useKeyDown({ key: 'Escape', active: focused }, onCancel)

  return (
    <RelativeContainer ref={ref}>
      <SelectionButton
        label='Filters'
        icon={FilterIcon}
        badgeLabel={filterCount}
        badgeFilled={!!filterCount}
        withBorder
        color='transparent'
        onClick={toggleFocused}
      />

      {focused && (
        <AbsoluteContainer>
          <FormWrapper>
            <NamespaceDropdown
              namespaces={namespaceItems}
              value={filters['namespaces']}
              onSelect={(val) => setFilters((prev) => ({ ...prev, namespaces: [...(prev.namespaces || []), val] }))}
              onDeselect={(val) => setFilters((prev) => ({ ...prev, namespaces: (prev.namespaces || []).filter((opt) => opt.id !== val.id) }))}
              showSearch
              required
              isMulti
            />
            <KindDropdown
              sources={sourceItems}
              value={filters['kinds']}
              onSelect={(val) => setFilters((prev) => ({ ...prev, kinds: [...(prev.kinds || []), val] }))}
              onDeselect={(val) => setFilters((prev) => ({ ...prev, kinds: (prev.kinds || []).filter((opt) => opt.id !== val.id) }))}
              showSearch
              required
              isMulti
            />
            <MonitorDropdown
              value={filters['monitors']}
              onSelect={(val) => setFilters((prev) => ({ ...prev, monitors: [...(prev.monitors || []), val] }))}
              onDeselect={(val) => setFilters((prev) => ({ ...prev, monitors: (prev.monitors || []).filter((opt) => opt.id !== val.id) }))}
              showSearch
              required
              isMulti
            />
            <LanguageDropdown
              sources={sourceItems}
              value={filters['languages']}
              onSelect={(val) => setFilters((prev) => ({ ...prev, languages: [...(prev.languages || []), val] }))}
              onDeselect={(val) => setFilters((prev) => ({ ...prev, languages: (prev.languages || []).filter((opt) => opt.id !== val.id) }))}
              showSearch
              required
              isMulti
            />

            <ToggleWrapper>
              <Toggle
                title='Show only sources with errors'
                initialValue={filters['onlyErrors']}
                onChange={(bool) => setFilters((prev) => ({ ...prev, errors: [], onlyErrors: bool }))}
              />
            </ToggleWrapper>

            {filters['onlyErrors'] && (
              <ErrorDropdown
                sources={sourceItems}
                value={filters['errors']}
                onSelect={(val) => setFilters((prev) => ({ ...prev, errors: [...(prev.errors || []), val] }))}
                onDeselect={(val) => setFilters((prev) => ({ ...prev, errors: (prev.errors || []).filter((opt) => opt.id !== val.id) }))}
                showSearch
                required
                isMulti
              />
            )}
          </FormWrapper>

          <Actions>
            <Button variant='primary' onClick={onApply} style={{ fontSize: 14 }}>
              Apply
            </Button>
            <Button variant='secondary' onClick={onCancel} style={{ fontSize: 14 }}>
              Cancel
            </Button>
            <Button variant='tertiary' onClick={onReset} style={{ fontSize: 14, color: theme.text.error, marginLeft: '160px' }}>
              Reset
            </Button>
          </Actions>
        </AbsoluteContainer>
      )}
    </RelativeContainer>
  )
}
