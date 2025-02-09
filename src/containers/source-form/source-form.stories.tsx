import React, { useState } from 'react'
import type { StoryFn } from '@storybook/react'
import { SourceForm, type SourceFormProps } from '.'

export default {
  title: 'Containers/SourceForm',
  component: SourceForm,
}

export const Default: StoryFn<SourceFormProps> = (props) => {
  const [formData, setFormData] = useState({ otelServiceName: '' })

  return <SourceForm {...props} formData={formData} handleFormChange={(k, v) => setFormData((prev) => ({ ...prev, [k]: v }))} />
}

Default.args = {}
