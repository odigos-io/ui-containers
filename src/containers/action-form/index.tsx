import React, { type FC } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { CustomFields } from './custom-fields'
import { type ActionFormData } from '../../@types'
import { type ActionOption } from '@odigos/ui-utils'
import { CheckCircledIcon, CrossCircledIcon } from '@odigos/ui-icons'
import { DocsButton, Input, MonitorsCheckboxes, SectionTitle, Segment, Text, TextArea } from '@odigos/ui-components'

interface ActionFormProps {
  isUpdate?: boolean
  action: ActionOption
  formData: ActionFormData
  formErrors: Record<string, string>
  handleFormChange: (key: keyof ActionFormData, val: any) => void
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 4px;
`

const FieldTitle = styled(Text)`
  margin-bottom: 12px;
`

const ActionForm: FC<ActionFormProps> = ({ isUpdate, action, formData, formErrors, handleFormChange }) => {
  const theme = Theme.useTheme()

  return (
    <Container>
      {isUpdate && (
        <div>
          <FieldTitle>Status</FieldTitle>
          <Segment
            options={[
              { icon: CheckCircledIcon, label: 'active', value: false, selectedBgColor: theme.text.success + Theme.opacity.hex['050'] },
              { icon: CrossCircledIcon, label: 'inactive', value: true, selectedBgColor: theme.text.error + Theme.opacity.hex['050'] },
            ]}
            selected={formData.disabled}
            setSelected={(bool) => handleFormChange('disabled', bool)}
          />
        </div>
      )}

      {!isUpdate && (
        <SectionTitle title='' description={action.docsDescription as string} actionButton={<DocsButton endpoint={action.docsEndpoint} />} />
      )}

      <MonitorsCheckboxes
        title='Signals for Processing'
        required
        allowedSignals={action.allowedSignals}
        selectedSignals={formData['signals']}
        setSelectedSignals={(value) => handleFormChange('signals', value)}
        errorMessage={formErrors['signals']}
      />

      {!isUpdate && (
        <Input
          title='Action name'
          placeholder='Use a name that describes the action'
          value={formData['name']}
          onChange={({ target: { value } }) => handleFormChange('name', value)}
          errorMessage={formErrors['name']}
        />
      )}

      <CustomFields actionType={action.type} value={formData} setValue={(key, val) => handleFormChange(key, val)} formErrors={formErrors} />

      <TextArea
        title='Notes'
        value={formData['notes']}
        onChange={({ target: { value } }) => handleFormChange('notes', value)}
        errorMessage={formErrors['notes']}
      />
    </Container>
  )
}

export { ActionForm, type ActionFormProps }
