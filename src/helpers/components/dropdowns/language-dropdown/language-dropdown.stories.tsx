import React, { useEffect } from 'react'
import type { StoryFn } from '@storybook/react'
import { useEntityStore } from '../../../../store'
import { ENTITY_TYPES, MOCK_SOURCES } from '@odigos/ui-utils'
import { LanguageDropdown, type LanguageDropdownProps } from '.'

export default {
  title: 'Helpers/LanguageDropdown',
  component: LanguageDropdown,
}

export const Default: StoryFn<LanguageDropdownProps> = (props) => {
  const { setEntities } = useEntityStore()

  useEffect(() => {
    setEntities(ENTITY_TYPES.SOURCE, MOCK_SOURCES)
  }, [])

  return <LanguageDropdown {...props} />
}

Default.args = {
  title: 'Programming Language',
  isMulti: true,
}
