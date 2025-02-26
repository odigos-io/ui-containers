import React from 'react'
import type { StoryFn } from '@storybook/react'
import { MOCK_SOURCES } from '@odigos/ui-utils'
import { KindDropdown, type KindDropdownProps } from '.'

export default {
  title: 'Helpers/KindDropdown',
  component: KindDropdown,
}

export const Default: StoryFn<KindDropdownProps> = (props) => {
  return <KindDropdown {...props} />
}

Default.args = {
  title: 'Kind',
  isMulti: true,
  sources: MOCK_SOURCES,
}
