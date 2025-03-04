import React, { useEffect, useState } from 'react'
import type { StoryFn } from '@storybook/react'
import { useDrawerStore, useEntityStore } from '../../store'
import { DestinationDrawer, type DestinationDrawerProps } from '.'
import { ENTITY_TYPES, MOCK_DESTINATION_CATEGORIES, MOCK_DESTINATIONS, sleep } from '@odigos/ui-utils'

export default {
  title: 'Containers/DestinationDrawer',
  component: DestinationDrawer,
}

export const Default: StoryFn<DestinationDrawerProps> = (props) => {
  const { setEntities } = useEntityStore()
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  useEffect(() => {
    setEntities(ENTITY_TYPES.DESTINATION, MOCK_DESTINATIONS)
    setDrawerType(ENTITY_TYPES.DESTINATION)
    setDrawerEntityId(MOCK_DESTINATIONS[0].id)
  }, [])

  const [testLoading, setTestLoading] = useState(props.testLoading || false)
  const [testResult, setTestResult] = useState(props.testResult || undefined)

  return (
    <DestinationDrawer
      {...props}
      testLoading={testLoading}
      testResult={testResult}
      testConnection={async () => {
        setTestLoading(true)
        await sleep(1000)
        setTestResult({ succeeded: true })
        setTestLoading(false)
      }}
    />
  )
}

Default.args = {
  categories: MOCK_DESTINATION_CATEGORIES,
  updateDestination: () => {},
  deleteDestination: () => {},
}
