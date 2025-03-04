import React, { useEffect } from 'react'
import type { StoryFn } from '@storybook/react'
import { useEntityStore } from '../../../../store'
import { ErrorDropdown, type ErrorDropdownProps } from '.'
import { ENTITY_TYPES, MOCK_SOURCES } from '@odigos/ui-utils'

export default {
  title: 'Helpers/ErrorDropdown',
  component: ErrorDropdown,
}

export const Default: StoryFn<ErrorDropdownProps> = (props) => {
  const { setEntities } = useEntityStore()

  useEffect(() => {
    setEntities(ENTITY_TYPES.SOURCE, MOCK_SOURCES)
  }, [])

  return <ErrorDropdown {...props} />
}

Default.args = {
  title: 'Error Message',
  isMulti: true,
}
