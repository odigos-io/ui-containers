import React, { type FC, Fragment, useMemo, useState } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { AbsoluteContainer } from '../../styled'
import { useEntityStore } from '../../../../store'
import { useClickNode } from '../../../../helpers'
import { Divider, Text } from '@odigos/ui-components'
import { SelectionButton } from '../../selection-button'
import { buildSearchResults, type Category } from './builder'
import { ENTITY_TYPES, getEntityIcon, getEntityId, getEntityLabel } from '@odigos/ui-utils'

interface Props {
  searchText: string
  onClose: () => void
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

export const SearchResults: FC<Props> = ({ searchText, onClose }) => {
  const theme = Theme.useTheme()
  const { onClickNode } = useClickNode()
  const { sources, destinations, actions, instrumentationRules } = useEntityStore()

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
        {categories.map(
          ({ category, label, count }) =>
            !!count && (
              <SelectionButton
                key={`category-select-${category}`}
                label={label}
                badgeLabel={count}
                isSelected={selectedCategory === category}
                onClick={() => setSelectedCategory(category as Category)}
              />
            )
        )}
      </HorizontalScroll>

      {searchResults.map(
        ({ category, label, entities }, catIdx) =>
          !!entities.length && (
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
                      onClickNode(null, { data: { type: category, id } })
                      onClose()
                    }}
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                    color='transparent'
                  />
                ))}
              </VerticalScroll>

              <Divider thickness={catIdx === searchResults.length - 1 ? 0 : 1} length='90%' margin='8px auto' />
            </Fragment>
          )
      )}
    </AbsoluteContainer>
  )
}
