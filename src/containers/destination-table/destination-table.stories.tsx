import React from 'react'
import type { StoryFn } from '@storybook/react'
import { MOCK_DESTINATIONS } from '@odigos/ui-utils'
import { DestinationTable, type DestinationTableProps } from '.'

export default {
  title: 'Containers/DestinationTable',
  component: DestinationTable,
}

export const Default: StoryFn<DestinationTableProps> = (props) => {
  return <DestinationTable {...props} />
}

Default.args = {
  destinations: MOCK_DESTINATIONS,
}
