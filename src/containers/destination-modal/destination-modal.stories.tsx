import React, { useEffect, useState } from 'react'
import { useModalStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { DestinationModal, type DestinationModalProps } from '.'
import { ENTITY_TYPES, MOCK_DESTINATION_CATEGORIES, MOCK_POTENTIAL_DESTINATIONS, sleep } from '@odigos/ui-utils'

export default {
  title: 'Containers/DestinationModal',
  component: DestinationModal,
}

export const Default: StoryFn<DestinationModalProps> = (props) => {
  const { setCurrentModal } = useModalStore()

  useEffect(() => {
    setCurrentModal(ENTITY_TYPES.DESTINATION)
  }, [])

  const [testLoading, setTestLoading] = useState(props.testLoading || false)
  const [testResult, setTestResult] = useState(props.testResult || undefined)

  return (
    <DestinationModal
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
  isOnboarding: false,
  addConfiguredDestination: () => {},
  createDestination: () => {},
  potentialDestinations: MOCK_POTENTIAL_DESTINATIONS,
  categories: MOCK_DESTINATION_CATEGORIES,
}
