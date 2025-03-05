import React, { useEffect } from 'react'
import { useEntityStore } from '../../store'
import { type StoryFn, type StoryObj } from '@storybook/react'
import { DataFlowActionsMenu, type DataFlowActionsMenuProps } from '.'
import { ENTITY_TYPES, MOCK_ACTIONS, MOCK_DESTINATIONS, MOCK_INSTRUMENTATION_RULES, MOCK_NAMESPACES, MOCK_SOURCES } from '@odigos/ui-utils'

export default {
  title: 'Containers/DataFlowActionsMenu',
  component: DataFlowActionsMenu,
}

// Create a master template for mapping props to render
const Template: StoryFn<DataFlowActionsMenuProps> = (props) => {
  const { setEntities } = useEntityStore()

  useEffect(() => {
    setEntities(ENTITY_TYPES.INSTRUMENTATION_RULE, MOCK_INSTRUMENTATION_RULES)
    setEntities(ENTITY_TYPES.DESTINATION, MOCK_DESTINATIONS)
    setEntities(ENTITY_TYPES.ACTION, MOCK_ACTIONS)
    setEntities(ENTITY_TYPES.SOURCE, MOCK_SOURCES)
  }, [])

  return <DataFlowActionsMenu {...props} />
}

export const Default: StoryObj<DataFlowActionsMenuProps> = Template.bind({})

Default.args = {
  namespaces: MOCK_NAMESPACES,
}

export const FocusedSources: StoryObj<DataFlowActionsMenuProps> = Template.bind({})

FocusedSources.args = {
  namespaces: MOCK_NAMESPACES,
  addEntity: ENTITY_TYPES.SOURCE,
}

export const FocusedDestinations: StoryObj<DataFlowActionsMenuProps> = Template.bind({})

FocusedDestinations.args = {
  namespaces: [],
  addEntity: ENTITY_TYPES.DESTINATION,
}
