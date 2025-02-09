import React, { type FC, useEffect } from 'react'
import Theme from '@odigos/ui-theme'
import styled, { css } from 'styled-components'
import type { DestinationFormData } from '../../../@types'
import { Button, FadeLoader, Text } from '@odigos/ui-components'
import { getStatusIcon, NOTIFICATION_TYPE } from '@odigos/ui-utils'

interface TestConnectionProps {
  destination: DestinationFormData
  disabled: boolean
  validateForm: () => boolean

  status?: NOTIFICATION_TYPE
  testConnection: (destination: DestinationFormData) => Promise<void>
  testLoading: boolean
  testResult?: {
    succeeded: boolean
  }
  onError: () => void
  onSuccess: () => void
}

const ActionButton = styled(Button)<{ $status: TestConnectionProps['status'] }>`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ $status, theme }) =>
    $status === 'success'
      ? css`
          border-color: transparent;
          background-color: ${theme.colors.success};
        `
      : $status === 'error'
      ? css`
          border-color: transparent;
          background-color: ${theme.colors.error};
        `
      : css`
          background-color: transparent;
        `}
`

const TestConnection: FC<TestConnectionProps> = ({
  destination,
  disabled,
  status,
  onError,
  onSuccess,
  validateForm,
  testConnection,
  testLoading,
  testResult,
}) => {
  const theme = Theme.useTheme()

  useEffect(() => {
    if (testResult) {
      if (testResult.succeeded) onSuccess()
      else onError()
    }
  }, [testResult])

  const onClick = async () => {
    if (validateForm()) await testConnection(destination)
  }

  const Icon = !!status ? getStatusIcon(status, theme) : undefined

  return (
    <ActionButton $status={status} variant='secondary' disabled={disabled} onClick={onClick}>
      {testLoading ? <FadeLoader /> : Icon ? <Icon /> : null}

      <Text family='secondary' decoration='underline' size={14} color={!!status ? theme.text[status] : undefined}>
        {testLoading ? 'Checking' : status === 'success' ? 'Connection OK' : status === 'error' ? 'Connection Failed' : 'Test Connection'}
      </Text>
    </ActionButton>
  )
}

export { TestConnection, type TestConnectionProps }
