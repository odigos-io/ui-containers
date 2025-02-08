import React, { type FC } from 'react'
import { KeyValueInputsList } from '@odigos/ui-components'
import type { ActionFormData, CustomFieldProps } from '../../../@types'

type RenameAttributesProps = CustomFieldProps<ActionFormData>

const KEY = 'renames'

const RenameAttributes: FC<RenameAttributesProps> = ({ value, setValue, formErrors }) => {
  const errorMessage = formErrors[KEY]
  const mappedValue = Object.entries(value[KEY] || {}).map(([k, v]) => ({ key: k, value: v }))

  const handleChange = (arr: { key: string; value: string }[]) => {
    const payload: ActionFormData['renames'] = {}
    arr.forEach((obj) => (payload[obj.key] = obj.value))
    setValue(KEY, payload)
  }

  return <KeyValueInputsList title='Attributes to rename' value={mappedValue} onChange={handleChange} required errorMessage={errorMessage} />
}

export { RenameAttributes, type RenameAttributesProps }
