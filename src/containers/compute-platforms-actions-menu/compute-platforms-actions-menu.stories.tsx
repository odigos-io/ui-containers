import React from 'react'
import type { StoryFn } from '@storybook/react'
import { NOTIFICATION_TYPE, PLATFORM_TYPE } from '@odigos/ui-utils'
import { ComputePlatformsActionsMenu, type ComputePlatformsActionsMenuProps } from '.'

export default {
  title: 'Containers/ComputePlatformsActionsMenu',
  component: ComputePlatformsActionsMenu,
}

export const Default: StoryFn<ComputePlatformsActionsMenuProps> = (props) => {
  return <ComputePlatformsActionsMenu {...props} />
}

Default.args = {
  computePlatforms: [
    {
      id: 'My_new_kubernates_cluster',
      type: PLATFORM_TYPE.K8S,
      connectionStatus: NOTIFICATION_TYPE.SUCCESS,
    },
    {
      id: 'Alon-org121',
      type: PLATFORM_TYPE.VM,
      connectionStatus: NOTIFICATION_TYPE.ERROR,
    },
    {
      id: 'Amir-playground',
      type: PLATFORM_TYPE.K8S,
      connectionStatus: NOTIFICATION_TYPE.ERROR,
    },
    {
      id: 'Lang-test',
      type: PLATFORM_TYPE.K8S,
      connectionStatus: NOTIFICATION_TYPE.ERROR,
    },
    {
      id: 'Szymon_cluster_123',
      type: PLATFORM_TYPE.VM,
      connectionStatus: NOTIFICATION_TYPE.ERROR,
    },
  ],
}
