import React, { useEffect } from 'react'
import Theme from '@odigos/ui-theme'
import type { Preview } from '@storybook/react'

const DarkModeSettings = () => {
  const { darkMode } = Theme.useDarkMode()

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#000' : '#fff'
  }, [darkMode])

  return null
}

const preview: Preview = {
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story, {}) => {
      return (
        <Theme.Provider>
          <Theme.ToggleDarkMode />
          <DarkModeSettings />

          <div style={{ marginTop: '1rem' }}>
            <Story />
          </div>
        </Theme.Provider>
      )
    },
  ],
}

export default preview
