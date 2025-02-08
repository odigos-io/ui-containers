import React, { type FC, useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { Checkbox, FieldError, FieldLabel } from '@odigos/ui-components'
import { type InstrumentationRuleFormData, PAYLOAD_COLLECTION_KEY_TYPES } from '../../../../@types'

type PayloadCollectionProps = {
  value: InstrumentationRuleFormData
  setValue: (key: keyof InstrumentationRuleFormData, value: any) => void
  formErrors: Record<string, string>
}

type Parsed = InstrumentationRuleFormData['payloadCollection']

const ListContainer = styled.div<{ $hasError: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
  ${({ $hasError }) =>
    $hasError &&
    css`
      border: 1px solid ${({ theme }) => theme.text.error};
      border-radius: 16px;
      padding: 8px;
    `}
`

const strictPicklist = [
  {
    id: PAYLOAD_COLLECTION_KEY_TYPES.HTTP_REQUEST,
    label: 'Collect HTTP Request',
  },
  {
    id: PAYLOAD_COLLECTION_KEY_TYPES.HTTP_RESPONSE,
    label: 'Collect HTTP Response',
  },
  {
    id: PAYLOAD_COLLECTION_KEY_TYPES.DB_QUERY,
    label: 'Collect DB Query',
  },
  {
    id: PAYLOAD_COLLECTION_KEY_TYPES.MESSAGING,
    label: 'Collect Messaging',
  },
]

const PayloadCollection: FC<PayloadCollectionProps> = ({ value, setValue, formErrors }) => {
  const errorMessage = formErrors['payloadCollection']

  const mappedValue = useMemo(
    () =>
      Object.entries(value['payloadCollection'] || {})
        .filter(([k, v]) => !!v)
        .map(([k]) => k),
    [value]
  )

  const [isLastSelection, setIsLastSelection] = useState(mappedValue.length === 1)

  useEffect(() => {
    if (!mappedValue.length) {
      const payload: Parsed = {
        [PAYLOAD_COLLECTION_KEY_TYPES.HTTP_REQUEST]: {},
        [PAYLOAD_COLLECTION_KEY_TYPES.HTTP_RESPONSE]: {},
        [PAYLOAD_COLLECTION_KEY_TYPES.DB_QUERY]: {},
        [PAYLOAD_COLLECTION_KEY_TYPES.MESSAGING]: {},
      }

      setValue('payloadCollection', payload)
      setIsLastSelection(false)
    }
    // eslint-disable-next-line
  }, [])

  const handleChange = (id: string, isAdd: boolean) => {
    const arr = isAdd ? [...mappedValue, id] : mappedValue.filter((str) => str !== id)

    const payload: Parsed = {
      [PAYLOAD_COLLECTION_KEY_TYPES.HTTP_REQUEST]: arr.includes(PAYLOAD_COLLECTION_KEY_TYPES.HTTP_REQUEST) ? {} : null,
      [PAYLOAD_COLLECTION_KEY_TYPES.HTTP_RESPONSE]: arr.includes(PAYLOAD_COLLECTION_KEY_TYPES.HTTP_RESPONSE) ? {} : null,
      [PAYLOAD_COLLECTION_KEY_TYPES.DB_QUERY]: arr.includes(PAYLOAD_COLLECTION_KEY_TYPES.DB_QUERY) ? {} : null,
      [PAYLOAD_COLLECTION_KEY_TYPES.MESSAGING]: arr.includes(PAYLOAD_COLLECTION_KEY_TYPES.MESSAGING) ? {} : null,
    }

    setValue('payloadCollection', payload)
    setIsLastSelection(arr.length === 1)
  }

  return (
    <div>
      <FieldLabel title='Type of data to collect' required />
      <ListContainer $hasError={!!errorMessage}>
        {strictPicklist.map(({ id, label }) => (
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

export { PayloadCollection, type PayloadCollectionProps }
