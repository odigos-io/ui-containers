import React from 'react'
import type { StoryFn } from '@storybook/react'
import { MOCK_SOURCES } from '@odigos/ui-utils'
import { ErrorDropdown, type ErrorDropdownProps } from '.'

export default {
  title: 'Helpers/ErrorDropdown',
  component: ErrorDropdown,
}

export const Default: StoryFn<ErrorDropdownProps> = (props) => {
  return <ErrorDropdown {...props} />
}

Default.args = {
  title: 'Error Message',
  isMulti: true,
  sources: MOCK_SOURCES,
}
