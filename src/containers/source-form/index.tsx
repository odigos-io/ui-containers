import React, { type FC } from 'react'
import { styled } from '@odigos/ui-theme'
import { Input } from '@odigos/ui-components'
import type { SourceFormData } from '../../@types'

interface SourceFormProps {
  formData: SourceFormData
  handleFormChange: (key: keyof SourceFormData, val: any) => void
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 4px;
`

const SourceForm: FC<SourceFormProps> = ({ formData, handleFormChange }) => {
  return (
    <Container>
      <Input
        name='sourceName'
        title='Source name'
        tooltip='This overrides the default service name that runs in your cluster.'
        placeholder='Use a name that overrides the source name'
        value={formData.otelServiceName}
        onChange={({ target: { value } }) => handleFormChange('otelServiceName', value)}
      />
    </Container>
  )
}

export { SourceForm, type SourceFormProps }
