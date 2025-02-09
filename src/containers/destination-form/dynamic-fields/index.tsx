import React, { type FC } from 'react'
import type { DestinationDynamicField } from '../../../@types'
import { compareCondition, FIELD_TYPES, safeJsonParse } from '@odigos/ui-utils'
import { Checkbox, Dropdown, Input, InputList, KeyValueInputsList, TextArea } from '@odigos/ui-components'

interface DynamicFieldsProps {
  fields: DestinationDynamicField[]
  onChange: (name: string, value: any) => void
  formErrors: Record<string, string>
}

const DynamicFields: FC<DynamicFieldsProps> = ({ fields, onChange, formErrors }) => {
  return fields?.map((field) => {
    const { componentType, renderCondition, ...rest } = field

    const shouldRender = renderCondition ? compareCondition(renderCondition, fields) : true
    if (!shouldRender) return null

    switch (componentType) {
      case FIELD_TYPES.INPUT:
        return <Input key={field.name} {...rest} onChange={(e) => onChange(field.name, e.target.value)} errorMessage={formErrors[field.name]} />
      case FIELD_TYPES.DROPDOWN:
        return (
          <Dropdown
            key={field.name}
            {...rest}
            value={{ id: rest.value || '', value: rest.value || '' }}
            options={rest.options || []}
            onSelect={(option) => onChange(field.name, option.value)}
            errorMessage={formErrors[field.name]}
          />
        )
      case FIELD_TYPES.MULTI_INPUT:
        return (
          <InputList
            key={field.name}
            {...rest}
            value={typeof rest.value === 'string' ? safeJsonParse(rest.value, []) : rest.value}
            onChange={(value) => onChange(field.name, JSON.stringify(value))}
            errorMessage={formErrors[field.name]}
          />
        )
      case FIELD_TYPES.KEY_VALUE_PAIR:
        return (
          <KeyValueInputsList
            key={field.name}
            {...rest}
            value={typeof rest.value === 'string' ? safeJsonParse(rest.value, []) : rest.value}
            onChange={(value) => onChange(field.name, JSON.stringify(value))}
            errorMessage={formErrors[field.name]}
          />
        )
      case FIELD_TYPES.TEXTAREA:
        return <TextArea key={field.name} {...rest} onChange={(e) => onChange(field.name, e.target.value)} errorMessage={formErrors[field.name]} />
      case FIELD_TYPES.CHECKBOX:
        return (
          <Checkbox
            key={field.name}
            {...rest}
            value={rest.value == 'true'}
            onChange={(bool) => onChange(field.name, String(bool))}
            errorMessage={formErrors[field.name]}
          />
        )
      default:
        return null
    }
  })
}

export { DynamicFields, type DynamicFieldsProps }
