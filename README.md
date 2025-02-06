# Odigos UI Containers

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

Wrap your app with the theme provider from [`@odigos/ui-theme`](https://github.com/odigos-io/ui-theme):

```tsx
import { Theme } from '@odigos/ui-theme'

const AppProviders = () => {
  const darkMode = true

  return (
    <Theme.Provider darkMode={darkMode}>
      <App />
    </Theme.Provider>
  )
}
```

Import a container, and call it with it's props:

```tsx
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
