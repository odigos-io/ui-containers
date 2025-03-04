import React, { useEffect } from 'react'
import { useEntityStore, useSelectedStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { SourceTable, type SourceTableProps } from '.'
import { ENTITY_TYPES, MOCK_SOURCES, NOTIFICATION_TYPE, OTHER_STATUS } from '@odigos/ui-utils'

export default {
  title: 'Containers/SourceTable',
  component: SourceTable,
}

export const Default: StoryFn<SourceTableProps> = (props) => {
  const { setEntities } = useEntityStore()
  const { selectedSources } = useSelectedStore()

  useEffect(() => {
    MOCK_SOURCES[0].conditions = MOCK_SOURCES[0].conditions?.map((c) => ({ ...c, status: NOTIFICATION_TYPE.WARNING })) || []
    MOCK_SOURCES[1].conditions = MOCK_SOURCES[1].conditions?.map((c) => ({ ...c, status: OTHER_STATUS.DISABLED })) || []

    setEntities(ENTITY_TYPES.SOURCE, MOCK_SOURCES)
  }, [])

  return <SourceTable {...props} />
}

Default.args = {}
