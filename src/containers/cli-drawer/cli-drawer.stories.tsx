import React from 'react'
import type { StoryFn } from '@storybook/react'
import { CliDrawer, type CliDrawerProps } from '.'
import { MOCK_DESCRIBE_ODIGOS, MOCK_TOKENS, sleep } from '@odigos/ui-utils'

export default {
  title: 'Containers/CliDrawer',
  component: CliDrawer,
}

export const Default: StoryFn<CliDrawerProps> = (props) => {
  return <CliDrawer {...props} />
}

Default.args = {
  tokens: MOCK_TOKENS,
  saveToken: async () => {
    sleep(1000)
    return Promise.resolve()
  },
  fetchDescribeOdigos: async () => Promise.resolve({ data: { describeOdigos: MOCK_DESCRIBE_ODIGOS } }),
}
