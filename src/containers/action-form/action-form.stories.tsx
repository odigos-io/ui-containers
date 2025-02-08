import React, { useEffect } from 'react'
import { useModalStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { useActionFormData } from '../../helpers'
import { ActionForm, type ActionFormProps } from '.'
import { ACTION_OPTIONS, ENTITY_TYPES } from '@odigos/ui-utils'

export default {
  title: 'Containers/ActionForm',
  component: ActionForm,
}

export const Default: StoryFn<ActionFormProps> = (props) => {
  const { setCurrentModal } = useModalStore()
  const { formData, formErrors, handleFormChange } = useActionFormData()

  useEffect(() => {
    setCurrentModal(ENTITY_TYPES.ACTION)
  }, [])

  return <ActionForm {...props} formData={formData} formErrors={formErrors} handleFormChange={handleFormChange} />
}

Default.args = {
  // @ts-ignore
  action: ACTION_OPTIONS[0].items[0],
}
