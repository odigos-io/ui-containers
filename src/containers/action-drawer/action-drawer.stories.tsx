import React, { useEffect } from 'react'
import { useDrawerStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { ActionDrawer, type ActionDrawerProps } from '.'
import { ENTITY_TYPES, MOCK_ACTIONS } from '@odigos/ui-utils'

export default {
  title: 'Containers/ActionDrawer',
  component: ActionDrawer,
}

export const Default: StoryFn<ActionDrawerProps> = (props) => {
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  useEffect(() => {
    setDrawerType(ENTITY_TYPES.ACTION)
    setDrawerEntityId('da-w9wtd')
  }, [])

  return <ActionDrawer {...props} />
}

Default.args = {
  actions: MOCK_ACTIONS,
  updateAction: () => {},
  deleteAction: () => {},
}
