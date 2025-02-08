import React, { useEffect } from 'react'
import { useNotificationStore } from '../../store'
import { NOTIFICATION_TYPE, sleep } from '@odigos/ui-utils'
import { type StoryFn, type StoryObj } from '@storybook/react'
import { NotificationManager, type NotificationManagerProps } from '.'

export default {
  title: 'Containers/NotificationManager',
  component: NotificationManager,
}

// Create a master template for mapping props to render
const Template: StoryFn<NotificationManagerProps> = (props) => {
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

  return <NotificationManager {...props} />
}

// Reuse that template for creating different stories
export const Default: StoryObj<NotificationManagerProps> = Template.bind({})

Default.args = {}
