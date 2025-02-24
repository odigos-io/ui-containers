import React, { useEffect, useState } from 'react'
import { DataFlow, type DataFlowProps } from '.'
import type { StoryFn, StoryObj } from '@storybook/react'
import { MOCK_ACTIONS, MOCK_DESTINATIONS, MOCK_SOURCES, sleep, Source } from '@odigos/ui-utils'

export default {
  title: 'Containers/DataFlow',
  component: DataFlow,
}

// Create a master template for mapping props to render
const Template: StoryFn<DataFlowProps> = (props) => {
  const [paginated, setPaginated] = useState<Source[]>([])
  const [loading, setLoading] = useState(props.sourcesLoading)

  useEffect(() => {
    ;(async () => {
      setLoading(true)

      for await (const [idx] of new Array(10).fill(0).entries()) {
        await sleep(500)
        setPaginated((prev) => prev.concat(MOCK_SOURCES.map((source) => ({ ...source, name: `${source.name}-${idx}` }))))
      }

      setLoading(false)
    })()
  }, [])

  return <DataFlow {...props} sources={paginated} sourcesLoading={loading} />
}

// Reuse that template for creating different stories
export const Default: StoryObj<DataFlowProps> = Template.bind({})

Default.args = {
  heightToRemove: '0',
  sources: [],
  sourcesLoading: false,
  destinations: MOCK_DESTINATIONS,
  destinationsLoading: false,
  actions: MOCK_ACTIONS,
  actionsLoading: false,
  instrumentationRules: [], // MOCK_INSTRUMENTATION_RULES,
  instrumentationRulesLoading: true,
  metrics: {
    sources: [],
    destinations: [],
  },
}
