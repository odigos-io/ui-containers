import React from 'react'
import { type StoryFn, type StoryObj } from '@storybook/react'
import { DataFlowActionsMenu, type DataFlowActionsMenuProps } from '.'
import { MOCK_ACTIONS, MOCK_DESTINATIONS, MOCK_INSTRUMENTATION_RULES, MOCK_SOURCES } from '@odigos/ui-utils'

export default {
  title: 'Containers/DataFlowActionsMenu',
  component: DataFlowActionsMenu,
}

// Create a master template for mapping props to render
const Template: StoryFn<DataFlowActionsMenuProps> = (props) => {
  return <DataFlowActionsMenu {...props} />
}

// Reuse that template for creating different stories
export const Default: StoryObj<DataFlowActionsMenuProps> = Template.bind({})

Default.args = {
  namespaces: [{ name: 'default' }, { name: 'kv-infra' }],
  sources: MOCK_SOURCES,
  destinations: MOCK_DESTINATIONS,
  actions: MOCK_ACTIONS,
  instrumentationRules: MOCK_INSTRUMENTATION_RULES,
}
