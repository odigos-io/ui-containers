import React, { useEffect } from 'react'
import { type StoryFn, type StoryObj } from '@storybook/react'
import { Theme } from '@odigos/ui-theme'
import { ToastList, type ToastListProps } from '.'
import { useNotificationStore } from '../../store'
import { NOTIFICATION_TYPE, sleep } from '@odigos/ui-utils'

interface Props extends ToastListProps {
  darkMode: boolean
}

export default {
  title: 'Components/ToastList',
  component: ToastList,
}

// Create a master template for mapping props to render
const Template: StoryFn<Props> = ({ darkMode, ...props }) => {
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#000' : '#fff'
  }, [darkMode])

  const { addNotification } = useNotificationStore()

  useEffect(() => {
    ;(async () => {
      addNotification({
        type: NOTIFICATION_TYPE.DEFAULT,
        title: 'Hello',
        message: 'Welcome to Odigos.',
      })

      await sleep(1000)

      addNotification({
        type: NOTIFICATION_TYPE.INFO,
        title: 'Connecting',
        message: 'Connecting to the server.',
      })

      await sleep(1000)

      addNotification({
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Connected',
        message: 'Connected to the server.',
      })

      await sleep(1000)

      addNotification({
        type: NOTIFICATION_TYPE.WARNING,
        title: 'Disconnected',
        message: 'Disconnected from the server. Retrying connection.',
      })

      await sleep(1000)

      addNotification({
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Connection Error',
        message: 'Connection to the server failed. Please reboot the application.',
      })
    })()
  }, [])

  return (
    <Theme.Provider darkMode={darkMode}>
      <ToastList {...props} />
    </Theme.Provider>
  )
}

// Reuse that template for creating different stories
export const Default: StoryObj<Props> = Template.bind({})

Default.args = {
  darkMode: true,
}
