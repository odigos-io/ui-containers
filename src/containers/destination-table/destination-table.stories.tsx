import React, { useEffect } from 'react'
import { useEntityStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { DestinationTable, type DestinationTableProps } from '.'
import { ENTITY_TYPES, MOCK_DESTINATIONS } from '@odigos/ui-utils'

export default {
  title: 'Containers/DestinationTable',
  component: DestinationTable,
}

export const Default: StoryFn<DestinationTableProps> = (props) => {
  const { setEntities } = useEntityStore()

  useEffect(() => {
    setEntities(ENTITY_TYPES.DESTINATION, MOCK_DESTINATIONS)
  }, [])

  return <DestinationTable {...props} />
}

Default.args = {}
