import React, { useEffect } from 'react'
import { useEntityStore } from '../../store'
import { DataFlow, type DataFlowProps } from '.'
import type { StoryFn, StoryObj } from '@storybook/react'
import { ENTITY_TYPES, MOCK_ACTIONS, MOCK_DESTINATIONS, MOCK_SOURCES, sleep } from '@odigos/ui-utils'

export default {
  title: 'Containers/DataFlow',
  component: DataFlow,
}

// Create a master template for mapping props to render
const Template: StoryFn<DataFlowProps> = (props) => {
  const { setEntitiesLoading, setEntities, addEntities } = useEntityStore()

  useEffect(() => {
    setEntitiesLoading(ENTITY_TYPES.INSTRUMENTATION_RULE, true)
    setEntities(ENTITY_TYPES.INSTRUMENTATION_RULE, []) // MOCK_INSTRUMENTATION_RULES
    setEntities(ENTITY_TYPES.DESTINATION, MOCK_DESTINATIONS)
    setEntities(ENTITY_TYPES.ACTION, MOCK_ACTIONS)
    setEntities(ENTITY_TYPES.SOURCE, [])
    ;(async () => {
      setEntitiesLoading(ENTITY_TYPES.SOURCE, true)

      for await (const [idx] of new Array(10).fill(0).entries()) {
        await sleep(500)
        addEntities(
          ENTITY_TYPES.SOURCE,
          MOCK_SOURCES.map((source) => ({ ...source, name: `${source.name}-${idx + 1}` }))
        )
      }

      setEntitiesLoading(ENTITY_TYPES.SOURCE, false)
    })()
  }, [])

  return <DataFlow {...props} />
}

// Reuse that template for creating different stories
export const Default: StoryObj<DataFlowProps> = Template.bind({})

Default.args = {
  heightToRemove: '0',
  metrics: {
    sources: [],
    destinations: [],
  },
}
