import React, { type FC } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { CustomFields } from './custom-fields'
import type { InstrumentationRuleFormData } from '../../@types'
import type { InstrumentationRuleOption } from '@odigos/ui-utils'
import { CheckCircledIcon, CrossCircledIcon } from '@odigos/ui-icons'
import { DocsButton, Input, SectionTitle, Segment, Text, TextArea } from '@odigos/ui-components'

interface InstrumentationRuleFormProps {
  isUpdate?: boolean
  rule: InstrumentationRuleOption
  formData: InstrumentationRuleFormData
  formErrors: Record<string, string>
  handleFormChange: (key: keyof InstrumentationRuleFormData, val: any) => void
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

const InstrumentationRuleForm: FC<InstrumentationRuleFormProps> = ({ isUpdate, rule, formData, formErrors, handleFormChange }) => {
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

      {!isUpdate && <SectionTitle title='' description={rule.docsDescription as string} actionButton={<DocsButton endpoint={rule.docsEndpoint} />} />}

      {!isUpdate && (
        <Input
          title='Rule name'
          placeholder='Use a name that describes the rule'
          value={formData['ruleName']}
          onChange={({ target: { value } }) => handleFormChange('ruleName', value)}
          errorMessage={formErrors['ruleName']}
        />
      )}

      <CustomFields ruleType={rule.type} value={formData} setValue={(key, val) => handleFormChange(key, val)} formErrors={formErrors} />

      <TextArea
        title='Notes'
        value={formData['notes']}
        onChange={({ target: { value } }) => handleFormChange('notes', value)}
        errorMessage={formErrors['notes']}
      />
    </Container>
  )
}

export { InstrumentationRuleForm, type InstrumentationRuleFormProps }
