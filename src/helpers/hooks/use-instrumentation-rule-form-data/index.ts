import { useNotificationStore } from '../../../store'
import { FORM_ALERTS, NOTIFICATION_TYPE, useGenericForm } from '@odigos/ui-utils'
import { CODE_ATTRIBUTES_KEY_TYPES, type InstrumentationRuleFormData, PAYLOAD_COLLECTION_KEY_TYPES, type InstrumentationRule } from '../../../@types'

const INITIAL: InstrumentationRuleFormData = {
  ruleName: '',
  notes: '',
  disabled: false,
  workloads: null,
  instrumentationLibraries: null,
  payloadCollection: {
    [PAYLOAD_COLLECTION_KEY_TYPES.HTTP_REQUEST]: null,
    [PAYLOAD_COLLECTION_KEY_TYPES.HTTP_RESPONSE]: null,
    [PAYLOAD_COLLECTION_KEY_TYPES.DB_QUERY]: null,
    [PAYLOAD_COLLECTION_KEY_TYPES.MESSAGING]: null,
  },
  codeAttributes: {
    [CODE_ATTRIBUTES_KEY_TYPES.COLUMN]: null,
    [CODE_ATTRIBUTES_KEY_TYPES.FILE_PATH]: null,
    [CODE_ATTRIBUTES_KEY_TYPES.FUNCTION]: null,
    [CODE_ATTRIBUTES_KEY_TYPES.LINE_NUMBER]: null,
    [CODE_ATTRIBUTES_KEY_TYPES.NAMESPACE]: null,
    [CODE_ATTRIBUTES_KEY_TYPES.STACKTRACE]: null,
  },
}

export const useInstrumentationRuleFormData = () => {
  const { addNotification } = useNotificationStore()
  const { formData, formErrors, handleFormChange, handleErrorChange, resetFormData } = useGenericForm<InstrumentationRuleFormData>(INITIAL)

  const validateForm = (params?: { withAlert?: boolean; alertTitle?: string }) => {
    const errors: typeof formErrors = {}
    let ok = true

    // Instru Rules don't have any specific validations yet, no required fields at this time

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

  const loadFormWithDrawerItem = ({ ruleName, notes, disabled, payloadCollection, codeAttributes }: InstrumentationRule) => {
    const updatedData: InstrumentationRuleFormData = {
      ...INITIAL,
      ruleName,
      notes,
      disabled,
    }

    if (payloadCollection) {
      updatedData['payloadCollection'] = {
        [PAYLOAD_COLLECTION_KEY_TYPES.HTTP_REQUEST]: !!payloadCollection[PAYLOAD_COLLECTION_KEY_TYPES.HTTP_REQUEST] ? {} : null,
        [PAYLOAD_COLLECTION_KEY_TYPES.HTTP_RESPONSE]: !!payloadCollection[PAYLOAD_COLLECTION_KEY_TYPES.HTTP_RESPONSE] ? {} : null,
        [PAYLOAD_COLLECTION_KEY_TYPES.DB_QUERY]: !!payloadCollection[PAYLOAD_COLLECTION_KEY_TYPES.DB_QUERY] ? {} : null,
        [PAYLOAD_COLLECTION_KEY_TYPES.MESSAGING]: !!payloadCollection[PAYLOAD_COLLECTION_KEY_TYPES.MESSAGING] ? {} : null,
      }
    }

    if (codeAttributes) {
      updatedData['codeAttributes'] = {
        [CODE_ATTRIBUTES_KEY_TYPES.COLUMN]: codeAttributes[CODE_ATTRIBUTES_KEY_TYPES.COLUMN] || null,
        [CODE_ATTRIBUTES_KEY_TYPES.FILE_PATH]: codeAttributes[CODE_ATTRIBUTES_KEY_TYPES.FILE_PATH] || null,
        [CODE_ATTRIBUTES_KEY_TYPES.FUNCTION]: codeAttributes[CODE_ATTRIBUTES_KEY_TYPES.FUNCTION] || null,
        [CODE_ATTRIBUTES_KEY_TYPES.LINE_NUMBER]: codeAttributes[CODE_ATTRIBUTES_KEY_TYPES.LINE_NUMBER] || null,
        [CODE_ATTRIBUTES_KEY_TYPES.NAMESPACE]: codeAttributes[CODE_ATTRIBUTES_KEY_TYPES.NAMESPACE] || null,
        [CODE_ATTRIBUTES_KEY_TYPES.STACKTRACE]: codeAttributes[CODE_ATTRIBUTES_KEY_TYPES.STACKTRACE] || null,
      }
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
