import React, { useRef, useState } from 'react'
import { SearchIcon } from '@odigos/ui-icons'
import { Input } from '@odigos/ui-components'
import { RelativeContainer } from '../styled'
import { SearchResults } from './search-results'
import { type AllEntities } from '../../../@types'
import { useKeyDown, useOnClickOutside } from '@odigos/ui-utils'
// import { RecentSearches } from './recent-searches';

interface Props extends AllEntities {}

export const Search: React.FC<Props> = ({ sources, actions, destinations, instrumentationRules }) => {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)

  const onClose = () => {
    setInput('')
    setFocused(false)
  }

  const containerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, () => setFocused(false))
  useKeyDown({ key: 'Escape', active: !!input || focused }, onClose)

  return (
    <RelativeContainer ref={containerRef}>
      <Input
        placeholder='Search'
        icon={SearchIcon}
        value={input}
        onChange={(e) => setInput(e.target.value.toLowerCase())}
        onFocus={() => setFocused(true)}
      />

      {!!input || focused ? (
        <SearchResults
          searchText={input}
          onClose={onClose}
          sources={sources}
          actions={actions}
          destinations={destinations}
          instrumentationRules={instrumentationRules}
        />
      ) : null}

      {/* TODO: recent searches...

        {!!input ? (
          <SearchResults
            searchText={input}
            onClose={() => {
              setInput('');
              setFocused(false);
            }}
          />
        ) : focused ? (
          <RecentSearches />
        ) : null} */}
    </RelativeContainer>
  )
}
