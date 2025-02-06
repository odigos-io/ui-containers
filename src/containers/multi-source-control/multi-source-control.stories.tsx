import React, { useEffect, useState } from 'react'
import { type StoryFn, type StoryObj } from '@storybook/react'
import { Theme } from '@odigos/ui-theme'
import { MultiSourceControl, type MultiSourceControlProps } from '.'
import { Button } from '@odigos/ui-components'
import { useSelectedStore } from '../../store'

interface Props extends MultiSourceControlProps {
  darkMode: boolean
}

export default {
  title: 'Components/MultiSourceControl',
  component: MultiSourceControl,
}

// Create a master template for mapping props to render
const Template: StoryFn<Props> = ({ darkMode, ...props }) => {
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#000' : '#fff'
  }, [darkMode])

  const { setSelectedSources } = useSelectedStore()

  return (
    <Theme.Provider darkMode={darkMode}>
      <div style={{ position: 'relative' }}>
        <Button onClick={() => setSelectedSources({ default: new Array(69).fill({}) })}>click me to reavel controls</Button>
        <MultiSourceControl {...props} uninstrumentSources={() => setSelectedSources({})} />
      </div>
    </Theme.Provider>
  )
}

// Reuse that template for creating different stories
export const Default: StoryObj<Props> = Template.bind({})

Default.args = {
  darkMode: true,
  totalSourceCount: 69,
}
