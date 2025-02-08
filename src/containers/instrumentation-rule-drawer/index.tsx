import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { buildCard } from './build-card'
import { DataCard } from '@odigos/ui-components'
import { useDrawerStore, useNotificationStore } from '../../store'
import { InstrumentationRuleForm } from '../instrumentation-rule-form'
import { OverviewDrawer, useInstrumentationRuleFormData } from '../../helpers'
import type { InstrumentationRule, InstrumentationRuleFormData } from '../../@types'
import { CRUD, ENTITY_TYPES, FORM_ALERTS, getInstrumentationRuleIcon, INSTRUMENTATION_RULE_OPTIONS, NOTIFICATION_TYPE } from '@odigos/ui-utils'

interface InstrumentationRuleDrawerProps {
  instrumentationRules: InstrumentationRule[]
  updateInstrumentationRule: (ruleId: string, instrumentationRule: InstrumentationRuleFormData) => void
  deleteInstrumentationRule: (ruleId: string) => void
}

const FormContainer = styled.div`
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 220px);
  overflow: overlay;
  overflow-y: auto;
`

const InstrumentationRuleDrawer: React.FC<InstrumentationRuleDrawerProps> = ({
  instrumentationRules,
  updateInstrumentationRule,
  deleteInstrumentationRule,
}) => {
  const { addNotification } = useNotificationStore()
  const { drawerType, drawerEntityId, setDrawerType, setDrawerEntityId } = useDrawerStore()

  const isOpen = drawerType !== ENTITY_TYPES.INSTRUMENTATION_RULE
  const onClose = () => {
    setDrawerType(null)
    setDrawerEntityId(null)
  }

  const [isEditing, setIsEditing] = useState(false)
  const [isFormDirty, setIsFormDirty] = useState(false)

  const { formData, formErrors, handleFormChange, resetFormData, validateForm, loadFormWithDrawerItem } = useInstrumentationRuleFormData()

  const thisItem = useMemo(() => {
    if (isOpen) return null

    const found = instrumentationRules?.find((x) => x.ruleId === drawerEntityId)
    if (!!found) loadFormWithDrawerItem(found)

    return found
  }, [isOpen, drawerEntityId, instrumentationRules])

  if (!thisItem) return null

  const thisOptionType = INSTRUMENTATION_RULE_OPTIONS.find(({ type }) => type === thisItem.type)

  const handleEdit = (bool?: boolean) => {
    if (!thisItem.mutable && (bool || bool === undefined)) {
      addNotification({
        type: NOTIFICATION_TYPE.WARNING,
        title: FORM_ALERTS.FORBIDDEN,
        message: FORM_ALERTS.CANNOT_EDIT_RULE,
        crdType: ENTITY_TYPES.INSTRUMENTATION_RULE,
        target: drawerEntityId as string,
        hideFromHistory: true,
      })
    } else {
      setIsEditing(typeof bool === 'boolean' ? bool : true)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsFormDirty(false)
    loadFormWithDrawerItem(thisItem)
  }

  const handleDelete = () => {
    if (!thisItem.mutable) {
      addNotification({
        type: NOTIFICATION_TYPE.WARNING,
        title: FORM_ALERTS.FORBIDDEN,
        message: FORM_ALERTS.CANNOT_DELETE_RULE,
        crdType: ENTITY_TYPES.INSTRUMENTATION_RULE,
        target: drawerEntityId as string,
        hideFromHistory: true,
      })
    } else {
      deleteInstrumentationRule(drawerEntityId as string)
      setIsEditing(false)
      setIsFormDirty(false)
      resetFormData()
      // close drawer, all other cases are handled in OverviewDrawer
      onClose()
    }
  }

  const handleSave = (newTitle: string) => {
    if (validateForm({ withAlert: true, alertTitle: CRUD.UPDATE })) {
      const title = newTitle !== thisItem.type ? newTitle : ''
      handleFormChange('ruleName', title)
      updateInstrumentationRule(drawerEntityId as string, { ...formData, ruleName: title })
      setIsEditing(false)
      setIsFormDirty(false)
    }
  }

  return (
    <OverviewDrawer
      title={thisItem.ruleName || thisItem.type}
      icon={getInstrumentationRuleIcon(thisItem.type)}
      isEdit={isEditing}
      isFormDirty={isFormDirty}
      onEdit={handleEdit}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancel={handleCancel}
    >
      {isEditing && thisOptionType ? (
        <FormContainer>
          <InstrumentationRuleForm
            isUpdate
            rule={thisOptionType}
            formData={formData}
            formErrors={formErrors}
            handleFormChange={(...params) => {
              setIsFormDirty(true)
              handleFormChange(...params)
            }}
          />
        </FormContainer>
      ) : (
        <DataCard title='Instrumentation Rule Details' data={!!thisItem ? buildCard(thisItem) : []} />
      )}
    </OverviewDrawer>
  )
}

export { InstrumentationRuleDrawer, type InstrumentationRuleDrawerProps }
