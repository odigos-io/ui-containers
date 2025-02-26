import React from 'react'
import type { StoryFn } from '@storybook/react'
import { MOCK_SOURCES } from '@odigos/ui-utils'
import { LanguageDropdown, type LanguageDropdownProps } from '.'

export default {
  title: 'Helpers/LanguageDropdown',
  component: LanguageDropdown,
}

export const Default: StoryFn<LanguageDropdownProps> = (props) => {
  return <LanguageDropdown {...props} />
}

Default.args = {
  title: 'Programming Language',
  isMulti: true,
  sources: MOCK_SOURCES,
}
