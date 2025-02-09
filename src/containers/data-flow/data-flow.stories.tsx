import React from 'react'
import { DataFlow, type DataFlowProps } from '.'
import type { StoryFn, StoryObj } from '@storybook/react'
import { MOCK_ACTIONS, MOCK_DESTINATIONS, MOCK_INSTRUMENTATION_RULES, MOCK_SOURCES } from '@odigos/ui-utils'

export default {
  title: 'Containers/DataFlow',
  component: DataFlow,
}

// Create a master template for mapping props to render
const Template: StoryFn<DataFlowProps> = (props) => {
  return <DataFlow {...props} />
}

// Reuse that template for creating different stories
export const Default: StoryObj<DataFlowProps> = Template.bind({})

Default.args = {
  heightToRemove: '100px',
  sources: MOCK_SOURCES,
  sourcesLoading: false,
  sourcesTotalCount: MOCK_SOURCES.length,
  destinations: MOCK_DESTINATIONS,
  destinationsLoading: false,
  destinationsTotalCount: MOCK_DESTINATIONS.length,
  actions: MOCK_ACTIONS,
  actionsLoading: false,
  actionsTotalCount: MOCK_ACTIONS.length,
  instrumentationRules: MOCK_INSTRUMENTATION_RULES,
  instrumentationRulesLoading: true,
  instrumentationRulesTotalCount: MOCK_INSTRUMENTATION_RULES.length,
  metrics: {
    sources: [],
    destinations: [],
  },
}
