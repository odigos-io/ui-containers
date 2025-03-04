import React, { type FC, useMemo, useState } from 'react'
import styled from 'styled-components'
import { buildCard } from './build-card'
import type { DestinationFormData } from '../../@types'
import { useDrawerStore, useEntityStore } from '../../store'
import { ConditionDetails, DataCard } from '@odigos/ui-components'
import { OverviewDrawer, useDestinationFormData } from '../../helpers'
import { DestinationForm, type DestinationFormProps } from '../destination-form'
import { CRUD, type DestinationCategories, DestinationYamlProperties, DISPLAY_TITLES, ENTITY_TYPES, safeJsonParse } from '@odigos/ui-utils'

interface DestinationDrawerProps {
  categories: DestinationCategories
  updateDestination: (id: string, destination: DestinationFormData) => void
  deleteDestination: (id: string) => void
  testConnection: DestinationFormProps['testConnection']
  testLoading: DestinationFormProps['testLoading']
  testResult: DestinationFormProps['testResult']
}

const FormContainer = styled.div`
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 220px);
  overflow: overlay;
  overflow-y: auto;
`

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const DestinationDrawer: FC<DestinationDrawerProps> = ({
  categories,
  updateDestination,
  deleteDestination,
  testConnection,
  testLoading,
  testResult,
}) => {
  const { destinations } = useEntityStore()
  const { drawerType, drawerEntityId, setDrawerEntityId, setDrawerType } = useDrawerStore()

  const isOpen = drawerType !== ENTITY_TYPES.DESTINATION
  const onClose = () => {
    setDrawerType(null)
    setDrawerEntityId(null)
  }

  const [isEditing, setIsEditing] = useState(false)
  const [isFormDirty, setIsFormDirty] = useState(false)
  // const [thisItem, setThisItem] = useState<Destination | undefined>(undefined)

  const {
    formData,
    formErrors,
    handleFormChange,
    resetFormData,
    validateForm,
    loadFormWithDrawerItem,
    yamlFields,
    setYamlFields,
    dynamicFields,
    setDynamicFields,
  } = useDestinationFormData({
    // preLoadedFields: thisItem?.fields,
    // TODO: supportedSignals: thisDestination?.supportedSignals,
    // currently, the real "supportedSignals" is being used by "destination" passed as prop to "DestinationFormBody"
  })

  const thisItem = useMemo(() => {
    if (isOpen) return null

    const found = destinations?.find((x) => x.id === drawerEntityId)
    if (!!found) {
      loadFormWithDrawerItem(found)

      const fields: DestinationYamlProperties[] = []
      const parsedCategories: typeof categories = JSON.parse(JSON.stringify(categories))

      for (const category of parsedCategories) {
        const autoFilledFields = safeJsonParse<{ [key: string]: string }>(found.fields, {})
        const idx = category.items.findIndex((item) => item.type === found.destinationType.type)

        if (idx !== -1) {
          fields.push(
            ...category.items[idx].fields.map((field) => ({
              ...field,
              initialValue: autoFilledFields[field.name],
            }))
          )
        }
      }

      setYamlFields(fields)
    }

    return found
  }, [isOpen, drawerEntityId, destinations])

  if (!thisItem) return null

  const thisOptionType = categories
    .map(({ items }) => items.filter(({ type }) => type === thisItem.destinationType.type))
    .filter((arr) => !!arr.length)?.[0]?.[0]

  const handleEdit = (bool?: boolean) => {
    setIsEditing(typeof bool === 'boolean' ? bool : true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsFormDirty(false)
    loadFormWithDrawerItem(thisItem)
  }

  const handleDelete = async () => {
    deleteDestination(drawerEntityId as string)
    setIsEditing(false)
    setIsFormDirty(false)
    resetFormData()
    // close drawer, all other cases are handled in OverviewDrawer
    onClose()
  }

  const handleSave = async (newTitle: string) => {
    if (validateForm({ withAlert: true, alertTitle: CRUD.UPDATE })) {
      const title = newTitle !== thisItem.destinationType.displayName ? newTitle : ''
      handleFormChange('name', title)
      updateDestination(drawerEntityId as string, { ...formData, name: title })
      setIsEditing(false)
      setIsFormDirty(false)
    }
  }

  return (
    <OverviewDrawer
      title={thisItem.name || thisItem.destinationType.displayName}
      iconSrc={thisItem.destinationType.imageUrl}
      isEdit={isEditing}
      isFormDirty={isFormDirty}
      onEdit={handleEdit}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancel={handleCancel}
      isLastItem={destinations.length === 1}
    >
      {isEditing ? (
        <FormContainer>
          <DestinationForm
            isUpdate
            categoryItem={thisOptionType}
            formData={formData}
            formErrors={formErrors}
            handleFormChange={(...params) => {
              setIsFormDirty(true)
              handleFormChange(...params)
            }}
            dynamicFields={dynamicFields}
            setDynamicFields={(...params) => {
              setIsFormDirty(true)
              setDynamicFields(...params)
            }}
            validateForm={validateForm}
            testConnection={testConnection}
            testLoading={testLoading}
            testResult={testResult}
          />
        </FormContainer>
      ) : (
        <DataContainer>
          <ConditionDetails conditions={thisItem.conditions || []} />
          <DataCard title={DISPLAY_TITLES.DESTINATION_DETAILS} data={!!thisItem ? buildCard(thisItem, yamlFields) : []} />
        </DataContainer>
      )}
    </OverviewDrawer>
  )
}

export { DestinationDrawer, type DestinationDrawerProps }
