import React, { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { Checkbox, FieldError, FieldLabel, Tooltip } from '@odigos/ui-components'
import { CODE_ATTRIBUTES_KEY_TYPES, type InstrumentationRuleFormData } from '../../../../@types'

type CodeAttributesProps = {
  value: InstrumentationRuleFormData
  setValue: (key: keyof InstrumentationRuleFormData, value: any) => void
  formErrors: Record<string, string>
}

type Parsed = InstrumentationRuleFormData['codeAttributes']

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

const recommendedList = [
  {
    id: CODE_ATTRIBUTES_KEY_TYPES.FILE_PATH,
    label: 'Collect File Path',
    tooltip: 'Indicates whether to record the `code.filepath` attribute.',
  },
  {
    id: CODE_ATTRIBUTES_KEY_TYPES.FUNCTION,
    label: 'Collect Function',
    tooltip: 'Indicates whether to record the `code.function` attribute.',
  },
  {
    id: CODE_ATTRIBUTES_KEY_TYPES.LINE_NUMBER,
    label: 'Collect Line Number',
    tooltip: 'Indicates whether to record the `code.lineno` attribute.',
  },
]

const verboseList = [
  {
    id: CODE_ATTRIBUTES_KEY_TYPES.COLUMN,
    label: 'Collect Column',
    tooltip: 'Indicates whether to record the `code.column` attribute.',
  },
  {
    id: CODE_ATTRIBUTES_KEY_TYPES.NAMESPACE,
    label: 'Collect Namespace',
    tooltip: 'Indicates whether to record the `code.namespace` attribute.',
  },
  {
    id: CODE_ATTRIBUTES_KEY_TYPES.STACKTRACE,
    label: 'Collect Stacktrace',
    tooltip: 'Indicates whether to record the `code.stacktrace` attribute.',
  },
]

const CodeAttributes: React.FC<CodeAttributesProps> = ({ value, setValue, formErrors }) => {
  const errorMessage = formErrors['codeAttributes']

  const mappedValue = useMemo(
    () =>
      Object.entries(value['codeAttributes'] || {})
        .filter(([k, v]) => !!v)
        .map(([k]) => k),
    [value]
  )

  const [isLastSelection, setIsLastSelection] = useState(mappedValue.length === 1)

  useEffect(() => {
    if (!mappedValue.length) {
      const payload: Parsed = {
        [CODE_ATTRIBUTES_KEY_TYPES.COLUMN]: null,
        [CODE_ATTRIBUTES_KEY_TYPES.FILE_PATH]: true,
        [CODE_ATTRIBUTES_KEY_TYPES.FUNCTION]: true,
        [CODE_ATTRIBUTES_KEY_TYPES.LINE_NUMBER]: true,
        [CODE_ATTRIBUTES_KEY_TYPES.NAMESPACE]: null,
        [CODE_ATTRIBUTES_KEY_TYPES.STACKTRACE]: null,
      }

      setValue('codeAttributes', payload)
      setIsLastSelection(false)
    }
    // eslint-disable-next-line
  }, [])

  const handleChange = (id: string, isAdd: boolean) => {
    const arr = isAdd ? [...mappedValue, id] : mappedValue.filter((str) => str !== id)

    const payload = Object.values(CODE_ATTRIBUTES_KEY_TYPES).reduce((acc, attribute) => {
      // @ts-ignore - TS doesn't know that `acc` is initialized 2 rows below
      acc[attribute] = arr.includes(attribute) ? true : null
      return acc
    }, {} as Parsed) // Explicitly initializing with an empty object as Parsed type

    setValue('codeAttributes', payload)
    setIsLastSelection(arr.length === 1)
  }

  return (
    <>
      <div>
        <FieldLabel title='Recommended data to collect' required />
        <ListContainer $hasError={!!errorMessage}>
          {recommendedList.map(({ id, label, tooltip }) => (
            <Tooltip key={id} text={tooltip} withIcon>
              <Checkbox
                title={label}
                disabled={isLastSelection && mappedValue.includes(id)}
                value={mappedValue.includes(id)}
                onChange={(bool) => handleChange(id, bool)}
              />
            </Tooltip>
          ))}
        </ListContainer>
        {!!errorMessage && <FieldError>{errorMessage}</FieldError>}
      </div>

      <div>
        <FieldLabel title='Verbose data to collect' required />
        <ListContainer $hasError={!!errorMessage}>
          {verboseList.map(({ id, label, tooltip }) => (
            <Tooltip key={id} text={tooltip} withIcon>
              <Checkbox
                title={label}
                disabled={isLastSelection && mappedValue.includes(id)}
                value={mappedValue.includes(id)}
                onChange={(bool) => handleChange(id, bool)}
              />
            </Tooltip>
          ))}
        </ListContainer>
        {!!errorMessage && <FieldError>{errorMessage}</FieldError>}
      </div>
    </>
  )
}

export { CodeAttributes, type CodeAttributesProps }
