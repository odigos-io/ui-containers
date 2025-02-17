import React, { useState } from 'react'
import type { Platform } from '../../@types'
import { type StoryFn } from '@storybook/react'
import { PlatformSelect, type PlatformSelectProps } from '.'
import { NOTIFICATION_TYPE, PLATFORM_TYPE } from '@odigos/ui-utils'

export default {
  title: 'Containers/PlatformSelect',
  component: PlatformSelect,
}

export const Default: StoryFn<PlatformSelectProps> = (props) => {
  const [selected, setSelected] = useState<Platform | undefined>(undefined)

  return <PlatformSelect {...props} selected={selected} onSelect={setSelected} />
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
      connectionStatus: NOTIFICATION_TYPE.SUCCESS,
    },
    {
      id: '12345',
      type: PLATFORM_TYPE.K8S,
      connectionStatus: NOTIFICATION_TYPE.SUCCESS,
    },
    {
      id: '1-2-3-4-5',
      type: PLATFORM_TYPE.K8S,
      connectionStatus: NOTIFICATION_TYPE.SUCCESS,
    },
    {
      id: 'abcde',
      type: PLATFORM_TYPE.K8S,
      connectionStatus: NOTIFICATION_TYPE.SUCCESS,
    },
    {
      id: 'a-b-c-d-e',
      type: PLATFORM_TYPE.K8S,
      connectionStatus: NOTIFICATION_TYPE.SUCCESS,
    },
  ],
}
