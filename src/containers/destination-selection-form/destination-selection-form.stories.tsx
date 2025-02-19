import React, { useState } from 'react'
import type { StoryFn } from '@storybook/react'
import { DestinationSelectionForm, type DestinationSelectionFormProps } from '.'
import { MOCK_DESTINATION_CATEGORIES, MOCK_POTENTIAL_DESTINATIONS, sleep } from '@odigos/ui-utils'

export default {
  title: 'Containers/DestinationSelectionForm',
  component: DestinationSelectionForm,
}

export const Default: StoryFn<DestinationSelectionFormProps> = (props) => {
  const [testLoading, setTestLoading] = useState(props.testLoading || false)
  const [testResult, setTestResult] = useState(props.testResult || undefined)

  return (
    <DestinationSelectionForm
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
  potentialDestinations: MOCK_POTENTIAL_DESTINATIONS,
  createDestination: () => {},
  isLoading: false,
  isSourcesListEmpty: true,
  goToSources: () => {},
}
