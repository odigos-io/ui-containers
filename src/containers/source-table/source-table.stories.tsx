import React from 'react'
import type { StoryFn } from '@storybook/react'
import { MOCK_SOURCES, NOTIFICATION_TYPE } from '@odigos/ui-utils'
import { SourceTable, type SourceTableProps } from '.'

export default {
  title: 'Containers/SourceTable',
  component: SourceTable,
}

export const Default: StoryFn<SourceTableProps> = (props) => {
  return <SourceTable {...props} />
}

MOCK_SOURCES[0].conditions = MOCK_SOURCES[0].conditions?.map((c) => ({ ...c, status: NOTIFICATION_TYPE.WARNING })) || []
MOCK_SOURCES[1].conditions = MOCK_SOURCES[1].conditions?.map((c) => ({ ...c, status: 'disabled' })) || []

Default.args = {
  sources: MOCK_SOURCES,
}
