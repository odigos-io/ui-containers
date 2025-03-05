import React, { useEffect } from 'react'
import type { StoryFn } from '@storybook/react'
import { ActionDrawer, type ActionDrawerProps } from '.'
import { useDrawerStore, useEntityStore } from '../../store'
import { ENTITY_TYPES, MOCK_ACTIONS } from '@odigos/ui-utils'

export default {
  title: 'Containers/ActionDrawer',
  component: ActionDrawer,
}

export const Default: StoryFn<ActionDrawerProps> = (props) => {
  const { setEntities } = useEntityStore()
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  useEffect(() => {
    setEntities(ENTITY_TYPES.ACTION, MOCK_ACTIONS)
    setDrawerType(ENTITY_TYPES.ACTION)
    setDrawerEntityId(MOCK_ACTIONS[0].id)
  }, [])

  return <ActionDrawer {...props} />
}

Default.args = {
  updateAction: () => {},
  deleteAction: () => {},
}
