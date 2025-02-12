import React, { type FC, useMemo, useState } from 'react'
import styled from 'styled-components'
import { buildCard } from './build-card'
import { ActionForm } from '../action-form'
import { useDrawerStore } from '../../store'
import type { ActionFormData } from '../../@types'
import { OverviewDrawer, useActionFormData } from '../../helpers'
import { ConditionDetails, DataCard } from '@odigos/ui-components'
import { type Action, ACTION_OPTIONS, ACTION_TYPE, CRUD, DISPLAY_TITLES, ENTITY_TYPES, type FetchedCondition, getActionIcon } from '@odigos/ui-utils'

interface ActionDrawerProps {
  actions: Action[]
  updateAction: (id: string, action: ActionFormData) => void
  deleteAction: (id: string, actionType: ACTION_TYPE) => void
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

const ActionDrawer: FC<ActionDrawerProps> = ({ actions, updateAction, deleteAction }) => {
  const { drawerType, drawerEntityId, setDrawerEntityId, setDrawerType } = useDrawerStore()

  const isOpen = drawerType !== ENTITY_TYPES.ACTION
  const onClose = () => {
    setDrawerType(null)
    setDrawerEntityId(null)
  }

  const [isEditing, setIsEditing] = useState(false)
  const [isFormDirty, setIsFormDirty] = useState(false)

  const { formData, formErrors, handleFormChange, resetFormData, validateForm, loadFormWithDrawerItem } = useActionFormData()

  const thisItem = useMemo(() => {
    if (isOpen) return null

    const found = actions?.find((x) => x.id === drawerEntityId)
    if (!!found) loadFormWithDrawerItem(found)

    return found
  }, [isOpen, drawerEntityId, actions])

  if (!thisItem) return null

  const thisOptionType =
    ACTION_OPTIONS.find(({ type }) => type === thisItem.type) ||
    ACTION_OPTIONS.find(({ id }) => id === 'attributes')?.items?.find(({ type }) => type === thisItem.type) ||
    ACTION_OPTIONS.find(({ id }) => id === 'sampler')?.items?.find(({ type }) => type === thisItem.type)

  const handleEdit = (bool?: boolean) => {
    setIsEditing(typeof bool === 'boolean' ? bool : true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsFormDirty(false)
    loadFormWithDrawerItem(thisItem)
  }

  const handleDelete = () => {
    deleteAction(drawerEntityId as string, thisItem.type)
    setIsEditing(false)
    setIsFormDirty(false)
    resetFormData()
    // close drawer, all other cases are handled in OverviewDrawer
    onClose()
  }

  const handleSave = (newTitle: string) => {
    if (validateForm({ withAlert: true, alertTitle: CRUD.UPDATE })) {
      const title = newTitle !== thisItem.type ? newTitle : ''
      handleFormChange('name', title)
      updateAction(drawerEntityId as string, { ...formData, name: title })
      setIsEditing(false)
      setIsFormDirty(false)
    }
  }

  return (
    <OverviewDrawer
      title={thisItem.spec.actionName || thisItem.type}
      icon={getActionIcon(thisItem.type)}
      isEdit={isEditing}
      isFormDirty={isFormDirty}
      onEdit={handleEdit}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancel={handleCancel}
    >
      {isEditing && thisOptionType ? (
        <FormContainer>
          <ActionForm
            isUpdate
            action={thisOptionType}
            formData={formData}
            formErrors={formErrors}
            handleFormChange={(...params) => {
              setIsFormDirty(true)
              handleFormChange(...params)
            }}
          />
        </FormContainer>
      ) : (
        <DataContainer>
          <ConditionDetails conditions={thisItem.conditions || []} />
          <DataCard title={DISPLAY_TITLES.ACTION_DETAILS} data={!!thisItem ? buildCard(thisItem) : []} />
        </DataContainer>
      )}
    </OverviewDrawer>
  )
}

export { ActionDrawer, type ActionDrawerProps }
