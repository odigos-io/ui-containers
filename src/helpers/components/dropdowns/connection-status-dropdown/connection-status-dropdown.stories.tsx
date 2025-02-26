import React from 'react'
import type { StoryFn } from '@storybook/react'
import { NOTIFICATION_TYPE, PLATFORM_TYPE } from '@odigos/ui-utils'
import { ConnectionStatusDropdown, type ConnectionStatusDropdownProps } from '.'

export default {
  title: 'Helpers/ConnectionStatusDropdown',
  component: ConnectionStatusDropdown,
}

export const Default: StoryFn<ConnectionStatusDropdownProps> = (props) => {
  return <ConnectionStatusDropdown {...props} />
}

Default.args = {
  title: 'Connection Status',
  isMulti: true,
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
      type: PLATFORM_TYPE.VM,
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
