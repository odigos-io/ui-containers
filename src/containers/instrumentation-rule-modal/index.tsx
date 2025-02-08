import React, { useState, type FC } from 'react'
import { useModalStore } from '../../store'
import { type InstrumentationRuleFormData } from '../../@types'
import { InstrumentationRuleForm } from '../instrumentation-rule-form'
import { ModalBody, useInstrumentationRuleFormData } from '../../helpers'
import { AutocompleteInput, Divider, Modal, NavigationButtons, NotificationNote, SectionTitle } from '@odigos/ui-components'
import {
  CRUD,
  ENTITY_TYPES,
  FORM_ALERTS,
  INSTRUMENTATION_RULE_OPTIONS,
  type InstrumentationRuleOption,
  NOTIFICATION_TYPE,
  useKeyDown,
} from '@odigos/ui-utils'

interface InstrumentationRuleModalProps {
  isEnterprise: boolean
  createInstrumentationRule: (instrumentationRule: InstrumentationRuleFormData) => void
}

const InstrumentationRuleModal: FC<InstrumentationRuleModalProps> = ({ isEnterprise, createInstrumentationRule }) => {
  const { currentModal, setCurrentModal } = useModalStore()
  const isOpen = currentModal === ENTITY_TYPES.INSTRUMENTATION_RULE

  const { formData, formErrors, handleFormChange, resetFormData, validateForm } = useInstrumentationRuleFormData()
  const [selectedItem, setSelectedItem] = useState<InstrumentationRuleOption | undefined>(undefined)

  const handleClose = () => {
    resetFormData()
    setSelectedItem(undefined)
    setCurrentModal('')
  }

  const handleSelect = (item?: InstrumentationRuleOption) => {
    resetFormData()
    setSelectedItem(item)
  }

  const handleSubmit = () => {
    const isFormOk = validateForm({ withAlert: true, alertTitle: CRUD.CREATE })
    if (!isFormOk) return null

    createInstrumentationRule(formData)
    handleClose()
  }

  useKeyDown({ key: 'Enter', active: isOpen }, () => handleSubmit())

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header={{ title: 'Add Instrumentation Rule' }}
      actionComponent={
        <NavigationButtons
          buttons={[
            {
              variant: 'primary',
              label: 'DONE',
              onClick: handleSubmit,
              disabled: !isEnterprise || !selectedItem,
              tooltip: !isEnterprise ? FORM_ALERTS.ENTERPRISE_ONLY('Instrumentation Rules') : '',
            },
          ]}
        />
      }
    >
      <ModalBody>
        <SectionTitle
          title='Select Instrumentation Rule'
          description='Define how telemetry is recorded from your application. Choose a rule type and configure the details.'
        />
        {!isEnterprise && (
          <NotificationNote
            type={NOTIFICATION_TYPE.DEFAULT}
            message={FORM_ALERTS.ENTERPRISE_ONLY('Instrumentation Rules')}
            style={{ marginTop: '24px' }}
          />
        )}

        <AutocompleteInput
          options={INSTRUMENTATION_RULE_OPTIONS}
          selectedOption={selectedItem}
          onOptionSelect={handleSelect}
          style={{ marginTop: isEnterprise ? '24px' : '12px' }}
          autoFocus={!selectedItem?.type}
        />

        {!!selectedItem?.type ? (
          <div>
            <Divider margin='16px 0' />
            <InstrumentationRuleForm rule={selectedItem} formData={formData} formErrors={formErrors} handleFormChange={handleFormChange} />
          </div>
        ) : null}
      </ModalBody>
    </Modal>
  )
}

export { InstrumentationRuleModal, type InstrumentationRuleModalProps }
