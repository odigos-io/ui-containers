import React from 'react'
import type { StoryFn } from '@storybook/react'
import { AwaitPipeline, type AwaitPipelineProps } from '.'

export default {
  title: 'Containers/AwaitPipeline',
  component: AwaitPipeline,
}

export const Default: StoryFn<AwaitPipelineProps> = (props) => {
  return <AwaitPipeline {...props} />
}

Default.args = {}
