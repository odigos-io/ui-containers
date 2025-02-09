import React, { useEffect } from 'react'
import { useModalStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { useDestinationFormData } from '../../helpers'
import { ENTITY_TYPES, FIELD_TYPES } from '@odigos/ui-utils'
import { DestinationForm, type DestinationFormProps } from '.'

export default {
  title: 'Containers/DestinationForm',
  component: DestinationForm,
}

export const Default: StoryFn<DestinationFormProps> = (props) => {
  const { setCurrentModal } = useModalStore()
  const { formData, formErrors, handleFormChange } = useDestinationFormData()

  useEffect(() => {
    setCurrentModal(ENTITY_TYPES.ACTION)
  }, [])

  return <DestinationForm {...props} formData={formData} formErrors={formErrors} handleFormChange={handleFormChange} />
}

Default.args = {
  categoryItem: {
    type: 'jaeger',
    testConnectionSupported: true,
    displayName: 'Jaeger',
    imageUrl: 'https:/d15jtxgb40qetw.cloudfront.net/jaeger.svg',
    supportedSignals: {
      logs: {
        supported: false,
      },
      metrics: {
        supported: false,
      },
      traces: {
        supported: true,
      },
    },
    fields: [
      {
        name: 'JAEGER_URL',
        displayName: 'Jaeger OTLP gRPC Endpoint',
        componentType: FIELD_TYPES.INPUT,
        componentProperties:
          '{"required":true,"tooltip":"The format is `host:port`, host is required, port is optional and defaults to the default OTLP gRPC port `4317`"}',
        secret: false,
        initialValue: '',
        renderCondition: undefined,
        hideFromReadData: undefined,
        customReadDataLabels: [],
      },
      {
        name: 'JAEGER_TLS_ENABLED',
        displayName: 'Enable TLS',
        componentType: FIELD_TYPES.CHECKBOX,
        componentProperties: '{"required":false,"tooltip":"Secure connection"}',
        secret: false,
        initialValue: 'false',
        renderCondition: undefined,
        hideFromReadData: undefined,
        customReadDataLabels: [
          {
            condition: 'true',
            title: 'TLS',
            value: 'Encrypted',
          },
          {
            condition: 'false',
            title: 'TLS',
            value: 'Unencrypted',
          },
        ],
      },
      {
        name: 'JAEGER_CA_PEM',
        displayName: 'Certificate Authority',
        componentType: FIELD_TYPES.TEXTAREA,
        componentProperties:
          '{"placeholder":"-----BEGIN CERTIFICATE-----","required":false,"tooltip":"When using TLS, provide the CA certificate in PEM format to verify the server. If empty uses system root CA"}',
        secret: false,
        initialValue: '',
        renderCondition: ['JAEGER_TLS_ENABLED', '==', 'true'],
        hideFromReadData: ['true'],
        customReadDataLabels: [],
      },
    ],
  },

  dynamicFields: [
    {
      name: 'JAEGER_URL',
      componentType: FIELD_TYPES.INPUT,
      title: 'Jaeger OTLP gRPC Endpoint',
      value: 'jaeger.tracing:4317',
    },
    {
      name: 'JAEGER_TLS_ENABLED',
      componentType: FIELD_TYPES.CHECKBOX,
      title: 'Enable TLS',
    },
    {
      name: 'JAEGER_CA_PEM',
      componentType: FIELD_TYPES.TEXTAREA,
      title: 'Certificate Authority',
    },
  ],
  setDynamicFields: () => {},

  testConnection: async () => {},
  testLoading: false,
  testResult: undefined,
}
