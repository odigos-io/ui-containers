# Odigos UI Containers

This library is not re-usable, these "containers" are considered complex components that contain logic, they designed to re-use across multiple deployments of the same Odigos UI (e.g. cluster, cloud, etc.)

## Installation

Using **npm**:

```shell
npm i @odigos/ui-containers
```

Using **yarn**:

```shell
yarn add @odigos/ui-containers
```

## Usage

Wrap your app with the theme provider from [@odigos/ui-theme](https://github.com/odigos-io/ui-theme):

```tsx
import Theme from '@odigos/ui-theme'

const AppProviders = () => {
  return (
    <Theme.Provider>
      <App />
    </Theme.Provider>
  )
}
```

Import a container, and call it with it's props:

```tsx
import { useEffect } from 'react'
import { NOTIFICATION_TYPE } from '@odigos/ui-utils'
import { ToastList, useNotificationStore } from '@odigos/ui-containers'

const App = () => {
  const { addNotification } = useNotificationStore()

  useEffect(() => {
    addNotification({
      type: NOTIFICATION_TYPE.SUCCESS,
      title: 'Mounted',
      message: 'App mounted successfully',
    })
  }, [])

  return <ToastList />
}
```
