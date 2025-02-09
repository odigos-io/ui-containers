import { useState, useEffect } from 'react'
import { useNotificationStore } from '../../../store'
import type { DestinationDynamicField, DestinationFormData } from '../../../@types'
import {
  type Destination,
  type DestinationCategories,
  type DestinationYamlProperties,
  FIELD_TYPES,
  FORM_ALERTS,
  NOTIFICATION_TYPE,
  safeJsonParse,
  useGenericForm,
} from '@odigos/ui-utils'

const INITIAL: DestinationFormData = {
  type: '',
  name: '',
  exportedSignals: {
    logs: false,
    metrics: false,
    traces: false,
  },
  fields: [],
}

interface Params {
  supportedSignals?: Destination['destinationType']['supportedSignals']
  preLoadedFields?: string | DestinationCategories[0]['items'][0]['fields']
}

const buildFormDynamicFields = (fields: DestinationYamlProperties[]): DestinationDynamicField[] => {
  return fields
    .filter((f) => !!f)
    .map((f) => {
      const { name, componentType, componentProperties, displayName, initialValue, renderCondition } = f

      switch (componentType) {
        case FIELD_TYPES.DROPDOWN: {
          const componentPropertiesJson = safeJsonParse<{ [key: string]: string }>(componentProperties, {})
          const options = Array.isArray(componentPropertiesJson.values)
            ? componentPropertiesJson.values.map((value) => ({
                id: value,
                value,
              }))
            : Object.entries(componentPropertiesJson.values).map(([key, value]) => ({
                id: key,
                value,
              }))

          return {
            name,
            componentType: componentType as FIELD_TYPES,
            title: displayName,
            value: initialValue,
            placeholder: componentPropertiesJson.placeholder || 'Select an option',
            options,
            renderCondition,
            ...componentPropertiesJson,
          }
        }

        default: {
          const componentPropertiesJson = safeJsonParse<{ [key: string]: string }>(componentProperties, {})

          return {
            name,
            componentType,
            title: displayName,
            value: initialValue,
            renderCondition,
            ...componentPropertiesJson,
          }
        }
      }
    })
}

export const useDestinationFormData = (params?: Params) => {
  const { supportedSignals, preLoadedFields } = params || {}

  const { addNotification } = useNotificationStore()
  const { formData, formErrors, handleFormChange, handleErrorChange, resetFormData } = useGenericForm<DestinationFormData>(INITIAL)

  const [yamlFields, setYamlFields] = useState<DestinationYamlProperties[]>([])
  const [dynamicFields, setDynamicFields] = useState<DestinationDynamicField[]>([])

  useEffect(() => {
    if (yamlFields) {
      setDynamicFields(
        buildFormDynamicFields(yamlFields).map((field) => {
          // if we have preloaded fields, we need to set the value of the field
          // (this can be from an odigos-detected-destination during create, or from an existing destination during edit/update)
          if (!!preLoadedFields) {
            const parsedFields = typeof preLoadedFields === 'string' ? safeJsonParse<Record<string, string>>(preLoadedFields, {}) : preLoadedFields

            if (field.name in parsedFields) {
              return {
                ...field,
                // @ts-ignore
                value: parsedFields[field.name],
              }
            }
          }

          return field
        })
      )
    } else {
      setDynamicFields([])
    }
  }, [yamlFields, preLoadedFields])

  useEffect(() => {
    handleFormChange(
      'fields',
      dynamicFields.map((field) => ({
        key: field.name,
        value: field.value,
      }))
    )
  }, [dynamicFields])

  useEffect(() => {
    const { logs, metrics, traces } = supportedSignals || {}

    handleFormChange('exportedSignals', {
      logs: logs?.supported || false,
      metrics: metrics?.supported || false,
      traces: traces?.supported || false,
    })
  }, [supportedSignals])

  const validateForm = (params?: { withAlert?: boolean; alertTitle?: string }) => {
    const errors: Record<DestinationDynamicField['name'], string> = {}
    let ok = true

    dynamicFields.forEach(({ name, value, required }) => {
      if (required && !value) {
        ok = false
        errors[name] = FORM_ALERTS.FIELD_IS_REQUIRED
      }
    })

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

  const loadFormWithDrawerItem = ({ destinationType: { type }, name, exportedSignals, fields }: Destination) => {
    const updatedData: DestinationFormData = {
      ...INITIAL,
      type,
      name,
      exportedSignals,
      fields: Object.entries(safeJsonParse(fields, {})).map(([key, value]) => ({ key, value })) as DestinationFormData['fields'],
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

    yamlFields,
    setYamlFields,
    dynamicFields,
    setDynamicFields,
  }
}
