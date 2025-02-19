import React, { type FC } from 'react'
import { isEmpty } from '@odigos/ui-utils'
import { Input } from '@odigos/ui-components'
import type { ActionFormData, CustomFieldProps } from '../../../@types'

type ErrorSamplerProps = CustomFieldProps<ActionFormData>

const KEY = 'fallbackSamplingRatio',
  MIN = 0,
  MAX = 100

const ErrorSampler: FC<ErrorSamplerProps> = ({ value, setValue, formErrors }) => {
  const errorMessage = formErrors[KEY]
  const mappedValue = value[KEY]
  const handleChange = (val: string) => setValue(KEY, Math.max(MIN, Math.min(Number(val), MAX)) || MIN)

  return (
    <Input
      title='Fallback sampling ratio'
      required
      type='number'
      min={MIN}
      max={MAX}
      value={!isEmpty(mappedValue) ? String(mappedValue) : ''}
      onChange={({ target: { value: v } }) => handleChange(v)}
      errorMessage={errorMessage}
    />
  )
}

export { ErrorSampler, type ErrorSamplerProps }
