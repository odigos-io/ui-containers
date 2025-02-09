import React from 'react'
import type { StoryFn } from '@storybook/react'
import { SourceForm, type SourceFormProps } from '.'
import { useSourceFormData } from '../../helpers'

export default {
  title: 'Containers/SourceForm',
  component: SourceForm,
}

export const Default: StoryFn<SourceFormProps> = (props) => {
  const { formData, handleFormChange } = useSourceFormData()

  return <SourceForm {...props} formData={formData} handleFormChange={handleFormChange} />
}

Default.args = {}
