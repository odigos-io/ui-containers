import React, { useState } from 'react'
import { Theme } from '@odigos/ui-theme'
import type { Preview } from '@storybook/react'
import { ToggleDarkMode } from '@odigos/ui-components'

const preview: Preview = {
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story, {}) => {
      const [darkMode, setDarkMode] = useState(true)

      return (
        <Theme.Provider darkMode={darkMode}>
          <ToggleDarkMode
            darkMode={darkMode}
            setDarkMode={(bool) => {
              setDarkMode(bool)
              document.body.style.backgroundColor = bool ? '#000' : '#fff'
            }}
          />

          <div style={{ marginTop: '1rem' }}>
            <Story />
          </div>
        </Theme.Provider>
      )
    },
  ],
}

export default preview
