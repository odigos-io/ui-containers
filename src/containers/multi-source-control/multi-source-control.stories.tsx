import React from 'react'
import { useSelectedStore } from '../../store'
import { Button } from '@odigos/ui-components'
import { type StoryFn, type StoryObj } from '@storybook/react'
import { MultiSourceControl, type MultiSourceControlProps } from '.'

export default {
  title: 'Components/MultiSourceControl',
  component: MultiSourceControl,
}

// Create a master template for mapping props to render
const Template: StoryFn<MultiSourceControlProps> = (props) => {
  const { setSelectedSources } = useSelectedStore()

  return (
    <div style={{ position: 'relative' }}>
      <Button onClick={() => setSelectedSources({ default: new Array(69).fill({}) })}>click me to reavel controls</Button>
      <MultiSourceControl {...props} uninstrumentSources={() => setSelectedSources({})} />
    </div>
  )
}

// Reuse that template for creating different stories
export const Default: StoryObj<MultiSourceControlProps> = Template.bind({})

Default.args = {
  totalSourceCount: 69,
}
