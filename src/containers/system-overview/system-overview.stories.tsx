import React from 'react'
import type { StoryFn } from '@storybook/react'
import { SystemOverview, type SystemOverviewProps } from '.'
import { MOCK_DESCRIBE_ODIGOS, MOCK_TOKENS, sleep } from '@odigos/ui-utils'

export default {
  title: 'Containers/SystemOverview',
  component: SystemOverview,
}

export const Default: StoryFn<SystemOverviewProps> = (props) => {
  return <SystemOverview {...props} />
}

Default.args = {
  tokens: MOCK_TOKENS,
  saveToken: async () => {
    sleep(1000)
    return Promise.resolve()
  },
  fetchDescribeOdigos: async () => Promise.resolve({ data: { describeOdigos: MOCK_DESCRIBE_ODIGOS } }),
}
