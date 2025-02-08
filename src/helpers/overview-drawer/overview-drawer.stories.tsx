import React, { useState } from 'react'
import type { StoryFn } from '@storybook/react'
import { OverviewDrawer, type OverviewDrawerProps } from '.'
import { getProgrammingLanguageIcon, PROGRAMMING_LANGUAGES } from '@odigos/ui-utils'

export default {
  title: 'Helpers/OverviewDrawer',
  component: OverviewDrawer,
}

export const Default: StoryFn<OverviewDrawerProps> = (props) => {
  const [isEdit, setIsEdit] = useState(props.isEdit)
  const toggleEdit = () => setIsEdit((prev) => !prev)

  return <OverviewDrawer {...props} isEdit={isEdit} onEdit={toggleEdit} onSave={toggleEdit} onCancel={toggleEdit} onDelete={() => {}} />
}

Default.args = {
  width: 555,
  title: 'load-generator',
  titleTooltip: 'k8s service name',
  iconSrc: getProgrammingLanguageIcon(PROGRAMMING_LANGUAGES.GO),
  isEdit: false,
  isFormDirty: true,
  isLastItem: false,
}
