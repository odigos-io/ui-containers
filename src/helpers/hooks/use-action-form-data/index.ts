import { Action, ACTION_TYPE, FORM_ALERTS, isEmpty, NOTIFICATION_TYPE, useGenericForm } from '@odigos/ui-utils'
import type { ActionFormData } from '../../../@types'
import { useNotificationStore } from '../../../store'

const INITIAL: ActionFormData = {
  // @ts-ignore (TS complains about empty string because we expect an "ActionsType", but it's fine)
  type: '',
  name: '',
  notes: '',
  signals: [],
  disabled: false,

  clusterAttributes: null,
  renames: null,
  attributeNamesToDelete: null,
  piiCategories: null,
  fallbackSamplingRatio: null,
  samplingPercentage: null,
  endpointsFilters: null,
}

export const useActionFormData = () => {
  const { addNotification } = useNotificationStore()
  const { formData, formErrors, handleFormChange, handleErrorChange, resetFormData } = useGenericForm<ActionFormData>(INITIAL)

  const validateForm = (params?: { withAlert?: boolean; alertTitle?: string }) => {
    const errors: typeof formErrors = {}
    let ok = true

    Object.entries(formData).forEach(([k, v]) => {
      switch (k) {
        case 'type':
        case 'signals':
          if (isEmpty(v)) errors[k as keyof typeof errors] = FORM_ALERTS.FIELD_IS_REQUIRED
          break

        case 'clusterAttributes':
          if (formData.type === ACTION_TYPE.ADD_CLUSTER_INFO && isEmpty(v)) errors[k as keyof typeof errors] = FORM_ALERTS.FIELD_IS_REQUIRED
          break
        case 'renames':
          if (formData.type === ACTION_TYPE.RENAME_ATTRIBUTES && isEmpty(v)) errors[k as keyof typeof errors] = FORM_ALERTS.FIELD_IS_REQUIRED
          break
        case 'attributeNamesToDelete':
          if (formData.type === ACTION_TYPE.DELETE_ATTRIBUTES && isEmpty(v)) errors[k as keyof typeof errors] = FORM_ALERTS.FIELD_IS_REQUIRED
          break
        case 'piiCategories':
          if (formData.type === ACTION_TYPE.PII_MASKING && isEmpty(v)) errors[k as keyof typeof errors] = FORM_ALERTS.FIELD_IS_REQUIRED
          break
        case 'fallbackSamplingRatio':
          if (formData.type === ACTION_TYPE.ERROR_SAMPLER && isEmpty(v)) errors[k as keyof typeof errors] = FORM_ALERTS.FIELD_IS_REQUIRED
          break
        case 'samplingPercentage':
          if (formData.type === ACTION_TYPE.PROBABILISTIC_SAMPLER && isEmpty(v)) errors[k as keyof typeof errors] = FORM_ALERTS.FIELD_IS_REQUIRED
          break
        case 'endpointsFilters':
          if (formData.type === ACTION_TYPE.LATENCY_SAMPLER) {
            if (isEmpty(v)) errors[k as keyof typeof errors] = FORM_ALERTS.FIELD_IS_REQUIRED
            ;(v as (typeof formData)['endpointsFilters'])?.forEach((endpoint) => {
              if (endpoint.httpRoute.charAt(0) !== '/') errors[k as keyof typeof errors] = FORM_ALERTS.LATENCY_HTTP_ROUTE
            })
          }
          break

        default:
          break
      }
    })

    ok = !Object.values(errors).length

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

  const loadFormWithDrawerItem = ({ type, spec }: Action) => {
    const updatedData: ActionFormData = {
      ...INITIAL,
      type,
    }

    Object.entries(spec).forEach(([k, v]) => {
      if (!!v) {
        switch (k) {
          case 'actionName': {
            updatedData['name'] = v as string
            break
          }

          case 'type':
          case 'notes':
          case 'signals':
          case 'disabled':
          case 'clusterAttributes':
          case 'attributeNamesToDelete':
          case 'renames':
          case 'piiCategories':
          case 'fallbackSamplingRatio':
          case 'samplingPercentage':
          case 'endpointsFilters': {
            // @ts-ignore
            updatedData[k] = v
            break
          }
        }
      }
    })

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
