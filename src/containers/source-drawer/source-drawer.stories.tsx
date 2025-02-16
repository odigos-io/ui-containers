import React, { useEffect } from 'react'
import { useDrawerStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { SourceDrawer, type SourceDrawerProps } from '.'
import { ENTITY_TYPES, MOCK_DESCRIBE_SOURCE, MOCK_SOURCES } from '@odigos/ui-utils'

export default {
  title: 'Containers/SourceDrawer',
  component: SourceDrawer,
}

export const Default: StoryFn<SourceDrawerProps> = (props) => {
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  useEffect(() => {
    setDrawerType(ENTITY_TYPES.SOURCE)
    setDrawerEntityId({ namespace: MOCK_SOURCES[0].namespace, name: MOCK_SOURCES[0].name, kind: MOCK_SOURCES[0].kind })
  }, [])

  return <SourceDrawer {...props} />
}

Default.args = {
  sources: MOCK_SOURCES,
  persistSources: async () => {},
  updateSource: async () => {},
  fetchDescribeSource: async () => Promise.resolve({ data: { describeSource: MOCK_DESCRIBE_SOURCE } }),
}
