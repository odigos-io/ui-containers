import React, { type FC } from 'react'
import { InputList } from '@odigos/ui-components'
import type { ActionFormData, CustomFieldProps } from '../../../@types'

type DeleteAttributesProps = CustomFieldProps<ActionFormData>

const KEY = 'attributeNamesToDelete'

const DeleteAttributes: FC<DeleteAttributesProps> = ({ value, setValue, formErrors }) => {
  const errorMessage = formErrors[KEY]
  const mappedValue = value[KEY] || []
  const handleChange = (arr: string[]) => setValue(KEY, arr)

  return <InputList title='Attributes to delete' value={mappedValue} onChange={handleChange} required errorMessage={errorMessage} />
}

export { DeleteAttributes, type DeleteAttributesProps }
