import React from 'react'
import type { StoryFn } from '@storybook/react'
import { MOCK_ACTIONS } from '@odigos/ui-utils'
import { ActionTable, type ActionTableProps } from '.'

export default {
  title: 'Containers/ActionTable',
  component: ActionTable,
}

export const Default: StoryFn<ActionTableProps> = (props) => {
  return <ActionTable {...props} />
}

Default.args = {
  actions: MOCK_ACTIONS,
}
