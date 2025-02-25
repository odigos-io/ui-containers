import React from 'react'
import { type StoryFn, type StoryObj } from '@storybook/react'
import { DataFlowActionsMenu, type DataFlowActionsMenuProps } from '.'
import { ENTITY_TYPES, MOCK_ACTIONS, MOCK_DESTINATIONS, MOCK_INSTRUMENTATION_RULES, MOCK_NAMESPACES, MOCK_SOURCES } from '@odigos/ui-utils'

export default {
  title: 'Containers/DataFlowActionsMenu',
  component: DataFlowActionsMenu,
}

// Create a master template for mapping props to render
const Template: StoryFn<DataFlowActionsMenuProps> = (props) => {
  return <DataFlowActionsMenu {...props} />
}

export const Default: StoryObj<DataFlowActionsMenuProps> = Template.bind({})

Default.args = {
  namespaces: MOCK_NAMESPACES,
  sources: MOCK_SOURCES,
  destinations: MOCK_DESTINATIONS,
  actions: MOCK_ACTIONS,
  instrumentationRules: MOCK_INSTRUMENTATION_RULES,
}

export const FocusedSources: StoryObj<DataFlowActionsMenuProps> = Template.bind({})

FocusedSources.args = {
  namespaces: MOCK_NAMESPACES,
  sources: MOCK_SOURCES,
  destinations: [],
  actions: [],
  instrumentationRules: [],
  addEntity: ENTITY_TYPES.SOURCE,
}
