import React from 'react'
import type { StoryFn } from '@storybook/react'
import { SlackInvite, type SlackInviteProps } from '.'
import { NOTIFICATION_TYPE, PLATFORM_TYPE } from '@odigos/ui-utils'

export default {
  title: 'Containers/SlackInvite',
  component: SlackInvite,
}

export const Default: StoryFn<SlackInviteProps> = (props) => {
  return <SlackInvite {...props} />
}

Default.args = {}
