import React, { type FC, useState } from 'react'
import { useModalStore } from '../../store'
import { ActionForm } from '../action-form'
import { ActionFormData } from '../../@types'
import { ModalBody, useActionFormData } from '../../helpers'
import { ACTION_OPTIONS, CRUD, ENTITY_TYPES, useKeyDown, type ActionOption } from '@odigos/ui-utils'
import { AutocompleteInput, Divider, Modal, NavigationButtons, SectionTitle } from '@odigos/ui-components'

interface ActionModalProps {
  createAction: (action: ActionFormData) => void
}

const ActionModal: FC<ActionModalProps> = ({ createAction }) => {
  const { currentModal, setCurrentModal } = useModalStore()
  const isOpen = currentModal === ENTITY_TYPES.ACTION

  const { formData, formErrors, handleFormChange, resetFormData, validateForm } = useActionFormData()

  const [selectedItem, setSelectedItem] = useState<ActionOption | undefined>(undefined)

  const handleClose = () => {
    resetFormData()
    setSelectedItem(undefined)
    setCurrentModal('')
  }

  const handleSelect = (item?: ActionOption) => {
    resetFormData()
    handleFormChange('type', item?.type || '')
    setSelectedItem(item)
  }

  const handleSubmit = () => {
    const isFormOk = validateForm({ withAlert: true, alertTitle: CRUD.CREATE })
    if (!isFormOk) return null

    createAction(formData)
    handleClose()
  }

  useKeyDown({ key: 'Enter', active: isOpen }, () => handleSubmit())

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header={{ title: 'Add Action' }}
      actionComponent={
        <NavigationButtons
          buttons={[
            {
              variant: 'primary',
              label: 'DONE',
              onClick: handleSubmit,
              disabled: !selectedItem,
            },
          ]}
        />
      }
    >
      <ModalBody>
        <SectionTitle
          title='Select Action'
          description='Select an action to modify telemetry data before it`s sent to destinations. Choose an action type and configure its details.'
        />
        <AutocompleteInput
          options={ACTION_OPTIONS}
          selectedOption={selectedItem}
          onOptionSelect={handleSelect}
          style={{ marginTop: '24px' }}
          autoFocus={!selectedItem?.type}
        />

        {!!selectedItem?.type ? (
          <div>
            <Divider margin='16px 0' />
            <ActionForm action={selectedItem} formData={formData} formErrors={formErrors} handleFormChange={handleFormChange} />
          </div>
        ) : null}
      </ModalBody>
    </Modal>
  )
}

export { ActionModal, type ActionModalProps }
