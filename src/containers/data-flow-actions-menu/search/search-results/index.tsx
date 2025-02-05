import React, { Fragment, useMemo, useState } from 'react'
import { AbsoluteContainer } from '../../styled'
import styled, { useTheme } from 'styled-components'
import { Divider, Text } from '@odigos/ui-components'
import { SelectionButton } from '../../selection-button'
import { buildSearchResults, type Category } from './builder'
import { type AllEntities, type OnNodeClick } from '../../../../@types'
import { ENTITY_TYPES, getEntityIcon, getEntityId, getEntityLabel } from '@odigos/ui-utils'

interface Props extends AllEntities {
  searchText: string
  onClose: () => void
  onNodeClick: OnNodeClick
}

const HorizontalScroll = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.border}`};
  overflow-x: scroll;
`

const VerticalScroll = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  overflow-y: scroll;
`

export const SearchResults = ({ searchText, onClose, sources, actions, destinations, instrumentationRules, onNodeClick }: Props) => {
  const theme = useTheme()

  const [selectedCategory, setSelectedCategory] = useState<Category>('all')

  const { categories, searchResults } = useMemo(
    () =>
      buildSearchResults({
        instrumentationRules,
        sources,
        actions,
        destinations,
        searchText,
        selectedCategory,
      }),
    [instrumentationRules, sources, actions, destinations, searchText, selectedCategory]
  )

  return (
    <AbsoluteContainer>
      <HorizontalScroll style={{ borderBottom: `1px solid ${!searchResults.length ? 'transparent' : theme.colors.border}` }}>
        {categories.map(({ category, label, count }) => (
          <SelectionButton
            key={`category-select-${category}`}
            label={label}
            badgeLabel={count}
            isSelected={selectedCategory === category}
            onClick={() => setSelectedCategory(category as Category)}
          />
        ))}
      </HorizontalScroll>

      {searchResults.map(({ category, label, entities }, catIdx) => (
        <Fragment key={`category-list-${category}`}>
          <VerticalScroll style={{ maxHeight: selectedCategory !== 'all' ? '240px' : '140px' }}>
            <Text size={12} family='secondary' color={theme.text.darker_grey} style={{ marginLeft: '16px' }}>
              {label}
            </Text>

            {entities.map((item, entIdx) => (
              <SelectionButton
                key={`entity-${catIdx}-${entIdx}`}
                icon={getEntityIcon(category as ENTITY_TYPES)}
                label={getEntityLabel(item, category as ENTITY_TYPES, { extended: true })}
                onClick={() => {
                  const id = getEntityId(item)
                  // @ts-ignore
                  onNodeClick(null, { data: { type: category, id } })
                  onClose()
                }}
                style={{ width: '100%', justifyContent: 'flex-start' }}
                color='transparent'
              />
            ))}
          </VerticalScroll>

          <Divider thickness={catIdx === searchResults.length - 1 ? 0 : 1} length='90%' margin='8px auto' />
        </Fragment>
      ))}
    </AbsoluteContainer>
  )
}
