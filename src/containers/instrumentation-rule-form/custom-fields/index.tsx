import React, { type FC } from 'react'
import { CodeAttributes } from './code-attributes'
import { PayloadCollection } from './payload-collection'
import { INSTRUMENTATION_RULE_TYPE } from '@odigos/ui-utils'
import type { InstrumentationRuleFormData } from '../../../@types'

interface CustomFieldsProps {
  ruleType?: INSTRUMENTATION_RULE_TYPE
  value: InstrumentationRuleFormData
  setValue: (key: keyof InstrumentationRuleFormData, value: any) => void
  formErrors: Record<string, string>
}

interface ComponentProps {
  value: CustomFieldsProps['value']
  setValue: CustomFieldsProps['setValue']
  formErrors: CustomFieldsProps['formErrors']
}

type ComponentType = FC<ComponentProps> | null

const componentsMap: Record<INSTRUMENTATION_RULE_TYPE, ComponentType> = {
  [INSTRUMENTATION_RULE_TYPE.PAYLOAD_COLLECTION]: PayloadCollection,
  [INSTRUMENTATION_RULE_TYPE.CODE_ATTRIBUTES]: CodeAttributes,
  [INSTRUMENTATION_RULE_TYPE.UNKNOWN_TYPE]: null,
}

const CustomFields: FC<CustomFieldsProps> = ({ ruleType, value, setValue, formErrors }) => {
  if (!ruleType) return null

  const Component = componentsMap[ruleType]

  return Component ? <Component value={value} setValue={setValue} formErrors={formErrors} /> : null
}

export { CustomFields, type CustomFieldsProps }
