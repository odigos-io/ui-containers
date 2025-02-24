import React, { useState } from 'react'
import type { Platform } from '../../@types'
import { type StoryFn } from '@storybook/react'
import { NOTIFICATION_TYPE, PLATFORM_TYPE } from '@odigos/ui-utils'
import { ComputePlatformSelect, type ComputePlatformSelectProps } from '.'

export default {
  title: 'Containers/ComputePlatformSelect',
  component: ComputePlatformSelect,
}

export const Default: StoryFn<ComputePlatformSelectProps> = (props) => {
  const [selected, setSelected] = useState<Platform | undefined>(undefined)

  return <ComputePlatformSelect {...props} selected={selected} onSelect={setSelected} />
}

Default.args = {
  computePlatforms: [
    {
      id: 'Ben Cluster',
      type: PLATFORM_TYPE.K8S,
      connectionStatus: NOTIFICATION_TYPE.SUCCESS,
    },
    {
      id: 'Alon Cluster',
      type: PLATFORM_TYPE.K8S,
      connectionStatus: NOTIFICATION_TYPE.SUCCESS,
    },
    {
      id: 'Amir Hackster',
      type: PLATFORM_TYPE.K8S,
      connectionStatus: NOTIFICATION_TYPE.ERROR,
    },
    {
      id: '12345',
      type: PLATFORM_TYPE.K8S,
      connectionStatus: NOTIFICATION_TYPE.ERROR,
    },
    {
      id: '1-2-3-4-5',
      type: PLATFORM_TYPE.K8S,
      connectionStatus: NOTIFICATION_TYPE.ERROR,
    },
    {
      id: 'abcde',
      type: PLATFORM_TYPE.K8S,
      connectionStatus: NOTIFICATION_TYPE.ERROR,
    },
    {
      id: 'a-b-c-d-e',
      type: PLATFORM_TYPE.K8S,
      connectionStatus: NOTIFICATION_TYPE.ERROR,
    },
  ],
}
