import React, { useEffect } from 'react'
import { useEntityStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { ActionTable, type ActionTableProps } from '.'
import { ENTITY_TYPES, MOCK_ACTIONS } from '@odigos/ui-utils'

export default {
  title: 'Containers/ActionTable',
  component: ActionTable,
}

export const Default: StoryFn<ActionTableProps> = (props) => {
  const { setEntities } = useEntityStore()

  useEffect(() => {
    setEntities(ENTITY_TYPES.ACTION, MOCK_ACTIONS)
  }, [])

  return <ActionTable {...props} />
}

Default.args = {}
