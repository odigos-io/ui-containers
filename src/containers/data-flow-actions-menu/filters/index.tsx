import React, { useEffect, useRef, useState } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { FilterIcon } from '@odigos/ui-icons'
import { SelectionButton } from '../selection-button'
import { Button, Toggle } from '@odigos/ui-components'
import { AbsoluteContainer, RelativeContainer } from '../styled'
import { useFilterStore, type FiltersState } from '../../../store'
import { type Source, useKeyDown, useOnClickOutside } from '@odigos/ui-utils'
import { ErrorDropdown, LanguageDropdown, MonitorDropdown, NamespaceDropdown, TypeDropdown } from '../../../helpers'

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
  if (!!params.namespace) count++
  count += params.types.length
  count += params.monitors.length
  count += params.languages.length
  count += params.errors.length
  if (!!params.onlyErrors) count++
  return count
}

export const Filters: React.FC<Props> = ({ namespaces, sources }) => {
  const theme = Theme.useTheme()
  const { namespace, types, monitors, languages, errors, onlyErrors, setAll, clearAll, getEmptyState } = useFilterStore()

  const [filters, setFilters] = useState<FiltersState>({ namespace, types, monitors, languages, errors, onlyErrors })
  const [filterCount, setFilterCount] = useState(getFilterCount(filters))
  const [focused, setFocused] = useState(false)
  const toggleFocused = () => setFocused((prev) => !prev)

  useEffect(() => {
    if (!focused) {
      const payload = { namespace, types, monitors, languages, errors, onlyErrors }
      setFilters(payload)
      setFilterCount(getFilterCount(payload))
    }
  }, [focused, namespace, types, monitors, errors, onlyErrors])

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
              namespaces={namespaces}
              value={filters['namespace']}
              onSelect={(val) => setFilters({ ...getEmptyState(), namespace: val })}
              onDeselect={(val) => setFilters((prev) => ({ ...prev, namespace: undefined }))}
              showSearch
              required
            />
            <TypeDropdown
              sources={sources}
              value={filters['types']}
              onSelect={(val) => setFilters((prev) => ({ ...prev, types: [...prev.types, val] }))}
              onDeselect={(val) => setFilters((prev) => ({ ...prev, types: prev.types.filter((opt) => opt.id !== val.id) }))}
              showSearch
              required
              isMulti
            />
            <MonitorDropdown
              value={filters['monitors']}
              onSelect={(val) => setFilters((prev) => ({ ...prev, monitors: [...prev.monitors, val] }))}
              onDeselect={(val) => setFilters((prev) => ({ ...prev, monitors: prev.monitors.filter((opt) => opt.id !== val.id) }))}
              showSearch
              required
              isMulti
            />
            <LanguageDropdown
              sources={sources}
              value={filters['languages']}
              onSelect={(val) => setFilters((prev) => ({ ...prev, languages: [...prev.languages, val] }))}
              onDeselect={(val) => setFilters((prev) => ({ ...prev, languages: prev.languages.filter((opt) => opt.id !== val.id) }))}
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
                sources={sources}
                value={filters['errors']}
                onSelect={(val) => setFilters((prev) => ({ ...prev, errors: [...prev.errors, val] }))}
                onDeselect={(val) => setFilters((prev) => ({ ...prev, errors: prev.errors.filter((opt) => opt.id !== val.id) }))}
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
