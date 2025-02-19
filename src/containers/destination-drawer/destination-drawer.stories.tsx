import React, { useEffect, useState } from 'react'
import { useDrawerStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { DestinationDrawer, type DestinationDrawerProps } from '.'
import { ENTITY_TYPES, MOCK_DESTINATION_CATEGORIES, MOCK_DESTINATIONS, sleep } from '@odigos/ui-utils'

export default {
  title: 'Containers/DestinationDrawer',
  component: DestinationDrawer,
}

export const Default: StoryFn<DestinationDrawerProps> = (props) => {
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  useEffect(() => {
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
  destinations: MOCK_DESTINATIONS,
  updateDestination: () => {},
  deleteDestination: () => {},
}
