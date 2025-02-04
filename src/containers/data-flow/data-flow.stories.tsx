import React, { useEffect } from 'react'
import { type StoryFn, type StoryObj } from '@storybook/react'
import { Theme } from '@odigos/ui-theme'
import { DataFlow, type DataFlowProps } from '.'

interface Props extends DataFlowProps {
  darkMode: boolean
}

export default {
  title: 'Components/DataFlow',
  component: DataFlow,
}

// Create a master template for mapping props to render
const Template: StoryFn<Props> = ({ darkMode, ...props }) => {
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#000' : '#fff'
  }, [darkMode])

  return (
    <Theme.Provider darkMode={darkMode}>
      <DataFlow {...props} />
    </Theme.Provider>
  )
}

// Reuse that template for creating different stories
export const Default: StoryObj<Props> = Template.bind({})

Default.args = {
  darkMode: true,
  sources: {
    loading: false,
    entities: [],
    unfilteredCount: 0,
  },
  destinations: {
    loading: false,
    entities: [],
    unfilteredCount: 0,
  },
  actions: {
    loading: false,
    entities: [],
    unfilteredCount: 0,
  },
  instrumentationRules: {
    loading: false,
    entities: [],
    unfilteredCount: 0,
  },
  metrics: {
    sources: [],
    destinations: [],
  },
  onNodeClick: () => {},
}
