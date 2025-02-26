import React from 'react'
import type { StoryFn } from '@storybook/react'
import { MOCK_NAMESPACES } from '@odigos/ui-utils'
import { NamespaceDropdown, type NamespaceDropdownProps } from '.'

export default {
  title: 'Helpers/NamespaceDropdown',
  component: NamespaceDropdown,
}

export const Default: StoryFn<NamespaceDropdownProps> = (props) => {
  return <NamespaceDropdown {...props} />
}

Default.args = {
  title: 'Namespace',
  isMulti: true,
  namespaces: MOCK_NAMESPACES,
}
