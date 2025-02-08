import React, { type FC } from 'react'
import { KeyValueInputsList } from '@odigos/ui-components'
import type { ActionFormData, CustomFieldProps } from '../../../@types'

type AddClusterInfoProps = CustomFieldProps<ActionFormData>

const KEY = 'clusterAttributes'

const AddClusterInfo: FC<AddClusterInfoProps> = ({ value, setValue, formErrors }) => {
  const errorMessage = formErrors[KEY]
  const mappedValue =
    value[KEY]?.map((obj) => ({
      key: obj.attributeName,
      value: obj.attributeStringValue,
    })) || []
  const handleChange = (arr: { key: string; value: string }[]) =>
    setValue(
      KEY,
      arr.map((obj) => ({
        attributeName: obj.key,
        attributeStringValue: obj.value,
      }))
    )

  return <KeyValueInputsList title='Resource Attributes' value={mappedValue} onChange={handleChange} required errorMessage={errorMessage} />
}

export { AddClusterInfo, type AddClusterInfoProps }
