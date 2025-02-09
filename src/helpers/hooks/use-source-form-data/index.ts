import { useNotificationStore } from '../../../store'
import type { SourceFormData } from '../../../@types'
import { FORM_ALERTS, NOTIFICATION_TYPE, type Source, useGenericForm } from '@odigos/ui-utils'

const INITIAL: SourceFormData = {
  otelServiceName: '',
}

export const useSourceFormData = () => {
  const { addNotification } = useNotificationStore()
  const { formData, formErrors, handleFormChange, handleErrorChange, resetFormData } = useGenericForm<SourceFormData>(INITIAL)

  const validateForm = (params?: { withAlert?: boolean; alertTitle?: string }) => {
    const errors: typeof formErrors = {}
    let ok = true

    // Sources don't have any specific validations yet, no required fields at this time

    if (!ok && params?.withAlert) {
      addNotification({
        type: NOTIFICATION_TYPE.WARNING,
        title: params.alertTitle,
        message: FORM_ALERTS.REQUIRED_FIELDS,
        hideFromHistory: true,
      })
    }

    handleErrorChange(undefined, undefined, errors)

    return ok
  }

  const loadFormWithDrawerItem = ({ otelServiceName, name }: Source) => {
    const updatedData: SourceFormData = {
      ...INITIAL,
      otelServiceName: otelServiceName || name || '',
    }

    handleFormChange(undefined, undefined, updatedData)
  }

  return {
    formData,
    formErrors,
    handleFormChange,
    resetFormData,
    validateForm,
    loadFormWithDrawerItem,
  }
}
