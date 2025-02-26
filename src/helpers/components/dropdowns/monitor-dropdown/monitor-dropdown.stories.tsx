import React from 'react'
import type { StoryFn } from '@storybook/react'
import { MonitorDropdown, type MonitorDropdownProps } from '.'

export default {
  title: 'Helpers/MonitorDropdown',
  component: MonitorDropdown,
}

export const Default: StoryFn<MonitorDropdownProps> = (props) => {
  return <MonitorDropdown {...props} />
}

Default.args = {
  title: 'Monitors',
  isMulti: true,
}
