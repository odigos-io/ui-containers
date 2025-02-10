import React, { type FC, useEffect, useState } from 'react'
import { css, styled } from '@odigos/ui-theme'
import type { ActionFormData, CustomFieldProps } from '../../../@types'
import { Checkbox, FieldError, FieldLabel } from '@odigos/ui-components'

type PiiMaskingProps = CustomFieldProps<ActionFormData>

const KEY = 'piiCategories'

const ListContainer = styled.div<{ $hasError: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 32px;
  ${({ $hasError }) =>
    $hasError &&
    css`
      border: 1px solid ${({ theme }) => theme.text.error};
      border-radius: 32px;
      padding: 8px;
    `}
`

const PII_OPTIONS = [
  {
    id: 'CREDIT_CARD',
    label: 'Credit Card',
  },
]

const PiiMasking: FC<PiiMaskingProps> = ({ value, setValue, formErrors }) => {
  const errorMessage = formErrors[KEY]
  const mappedValue = value[KEY] || []

  const [isLastSelection, setIsLastSelection] = useState(mappedValue.length === 1)

  const handleChange = (id: string, isAdd: boolean) => {
    const arr = isAdd ? [...mappedValue, id] : mappedValue.filter((str) => str !== id)
    setValue(KEY, arr)
    setIsLastSelection(arr.length === 1)
  }

  useEffect(() => {
    if (!mappedValue.length) {
      const arr = PII_OPTIONS.map(({ id }) => id)
      setValue(KEY, arr)
      setIsLastSelection(PII_OPTIONS.length === 1)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <FieldLabel title='Attributes to mask' required />
      <ListContainer $hasError={!!errorMessage}>
        {PII_OPTIONS.map(({ id, label }) => (
          <Checkbox
            key={id}
            title={label}
            disabled={isLastSelection && mappedValue.includes(id)}
            value={mappedValue.includes(id)}
            onChange={(bool) => handleChange(id, bool)}
          />
        ))}
      </ListContainer>
      {!!errorMessage && <FieldError>{errorMessage}</FieldError>}
    </div>
  )
}

export { PiiMasking, type PiiMaskingProps }
