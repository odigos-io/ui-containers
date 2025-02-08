import React, { useEffect } from 'react'
import { useModalStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { useInstrumentationRuleFormData } from '../../helpers'
import { ENTITY_TYPES, INSTRUMENTATION_RULE_OPTIONS } from '@odigos/ui-utils'
import { InstrumentationRuleForm, type InstrumentationRuleFormProps } from '.'

export default {
  title: 'Containers/InstrumentationRuleForm',
  component: InstrumentationRuleForm,
}

export const Default: StoryFn<InstrumentationRuleFormProps> = (props) => {
  const { setCurrentModal } = useModalStore()
  const { formData, formErrors, handleFormChange } = useInstrumentationRuleFormData()

  useEffect(() => {
    setCurrentModal(ENTITY_TYPES.INSTRUMENTATION_RULE)
  }, [])

  return <InstrumentationRuleForm {...props} formData={formData} formErrors={formErrors} handleFormChange={handleFormChange} />
}

Default.args = {
  rule: INSTRUMENTATION_RULE_OPTIONS[0],
}
