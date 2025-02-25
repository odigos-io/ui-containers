import React from 'react'
import type { StoryFn } from '@storybook/react'
import { MOCK_SOURCES } from '@odigos/ui-utils'
import { SourceTable, type SourceTableProps } from '.'

export default {
  title: 'Containers/SourceTable',
  component: SourceTable,
}

export const Default: StoryFn<SourceTableProps> = (props) => {
  return <SourceTable {...props} />
}

Default.args = {
  sources: MOCK_SOURCES,
}
