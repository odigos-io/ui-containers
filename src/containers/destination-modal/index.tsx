import React, { type FC, useState } from 'react'
import styled from 'styled-components'
import { ArrowIcon } from '@odigos/ui-icons'
import type { DestinationFormData } from '../../@types'
import { ChooseDestinationBody } from './choose-destination'
import { ModalBody, useDestinationFormData } from '../../helpers'
import { DestinationForm, type DestinationFormProps } from '../destination-form'
import { type StoredSetupDestination, useModalStore, useSetupStore } from '../../store'
import { DropdownProps, Modal, NavigationButtons, NavigationButtonsProps, Stepper } from '@odigos/ui-components'
import { CRUD, type DestinationCategories, type DestinationOption, ENTITY_TYPES, FIELD_TYPES, useKeyDown } from '@odigos/ui-utils'

interface DestinationModalProps {
  isOnboarding?: boolean
  categories: DestinationCategories
  potentialDestinations: DestinationOption[]
  createDestination: (destination: DestinationFormData) => Promise<void>
  testConnection: DestinationFormProps['testConnection']
  testLoading: DestinationFormProps['testLoading']
  testResult: DestinationFormProps['testResult']
}

const Container = styled.div`
  display: flex;
`

const SideMenuWrapper = styled.div`
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: 32px;
  width: 200px;
  @media (max-width: 1050px) {
    display: none;
  }
`

const DestinationModal: FC<DestinationModalProps> = ({
  isOnboarding,
  categories,
  potentialDestinations,
  createDestination,
  testConnection,
  testLoading,
  testResult,
}) => {
  const { addConfiguredDestination } = useSetupStore()
  const { currentModal, setCurrentModal } = useModalStore()
  const isOpen = currentModal === ENTITY_TYPES.DESTINATION

  const [selectedItem, setSelectedItem] = useState<DestinationOption | undefined>(undefined)
  const { formData, formErrors, handleFormChange, resetFormData, validateForm, setYamlFields, dynamicFields, setDynamicFields } =
    useDestinationFormData({
      supportedSignals: selectedItem?.supportedSignals,
      preLoadedFields: selectedItem?.fields,
    })

  const handleClose = () => {
    resetFormData()
    setSelectedItem(undefined)
    setCurrentModal('')
  }

  const handleBack = () => {
    resetFormData()
    setSelectedItem(undefined)
  }

  const handleSelect = (item: typeof selectedItem) => {
    resetFormData()
    handleFormChange('type', item?.type || '')
    setYamlFields(item?.fields || [])
    setSelectedItem(item)
  }

  const handleSubmit = async () => {
    const isFormOk = validateForm({ withAlert: !isOnboarding, alertTitle: CRUD.CREATE })
    if (!isFormOk) return null

    if (isOnboarding) {
      const destinationTypeDetails = dynamicFields.map((field) => ({
        title: field.title || '',
        value: (field.componentType === FIELD_TYPES.DROPDOWN
          ? (field.value as unknown as DropdownProps['options'][0])?.value || ''
          : field.value) as string,
      }))

      destinationTypeDetails.unshift({
        title: 'Destination name',
        value: formData.name,
      })

      const storedDestination: StoredSetupDestination = {
        type: selectedItem?.type || '',
        displayName: selectedItem?.displayName || '',
        imageUrl: selectedItem?.imageUrl || '',
        exportedSignals: formData.exportedSignals,
        destinationTypeDetails,
        category: '', // Could be handled in a more dynamic way if needed
      }

      addConfiguredDestination({ stored: storedDestination, form: formData })
    } else {
      await createDestination(formData)
    }

    handleClose()
  }

  const renderHeaderButtons = () => {
    const buttons: NavigationButtonsProps['buttons'] = [
      {
        label: 'DONE',
        variant: 'primary' as const,
        onClick: handleSubmit,
        disabled: !selectedItem,
      },
    ]

    if (!!selectedItem) {
      buttons.unshift({
        label: 'BACK',
        icon: ArrowIcon,
        variant: 'secondary' as const,
        onClick: handleBack,
      })
    }

    return buttons
  }

  useKeyDown({ key: 'Enter', active: isOpen }, () => handleSubmit())

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header={{ title: 'Add Destination' }}
      actionComponent={<NavigationButtons buttons={renderHeaderButtons()} />}
    >
      <Container>
        <SideMenuWrapper>
          <Stepper
            currentStep={!!selectedItem ? 2 : 1}
            data={[
              { stepNumber: 1, title: 'DESTINATIONS' },
              { stepNumber: 2, title: 'CONNECTION' },
            ]}
          />
        </SideMenuWrapper>

        <ModalBody style={{ margin: '32px 24px 12px 24px' }}>
          {/*
            in other modals we would render this out, but for this case we will use "hidden" instead,
            this is to preserve the filters-state when going back-and-forth between selections
          */}
          <ChooseDestinationBody
            hidden={!!selectedItem}
            categories={categories}
            potentialDestinations={potentialDestinations}
            onSelect={handleSelect}
          />

          {!!selectedItem && (
            <DestinationForm
              categoryItem={selectedItem}
              formData={formData}
              formErrors={formErrors}
              handleFormChange={handleFormChange}
              dynamicFields={dynamicFields}
              setDynamicFields={setDynamicFields}
              validateForm={validateForm}
              testConnection={testConnection}
              testLoading={testLoading}
              testResult={testResult}
            />
          )}
        </ModalBody>
      </Container>
    </Modal>
  )
}

export { DestinationModal, type DestinationModalProps }
