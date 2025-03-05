import React, { useEffect } from 'react'
import type { StoryFn } from '@storybook/react'
import { useEntityStore } from '../../../../store'
import { KindDropdown, type KindDropdownProps } from '.'
import { ENTITY_TYPES, MOCK_SOURCES } from '@odigos/ui-utils'

export default {
  title: 'Helpers/KindDropdown',
  component: KindDropdown,
}

export const Default: StoryFn<KindDropdownProps> = (props) => {
  const { setEntities } = useEntityStore()

  useEffect(() => {
    setEntities(ENTITY_TYPES.SOURCE, MOCK_SOURCES)
  }, [])

  return <KindDropdown {...props} />
}

Default.args = {
  title: 'Kind',
  isMulti: true,
}
