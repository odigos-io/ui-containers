import type { DropdownProps } from '@odigos/ui-components'
import { type Comparison, Destination, FIELD_TYPES } from '@odigos/ui-utils'

export interface DestinationFormData {
  type: Destination['destinationType']['type']
  name: Destination['destinationType']['displayName']
  exportedSignals: Destination['exportedSignals']
  fields: { key: string; value: string }[]
}

export type DestinationCategories = {
  name: 'managed' | 'self hosted'
  description: string
  items: {
    type: Destination['destinationType']['type']
    displayName: Destination['destinationType']['displayName']
    imageUrl: Destination['destinationType']['imageUrl']
    supportedSignals: Destination['destinationType']['supportedSignals']
    testConnectionSupported: boolean
    fields: DestinationYamlProperties[]
  }[]
}[]

type YamlCompareArr = [string, Comparison, string] | ['true' | 'false']

export interface DestinationYamlProperties {
  name: string // keyName (e.g. JAEGER_ENDPOINT_URL)
  componentType: FIELD_TYPES
  componentProperties?: string
  displayName?: string
  secret?: boolean
  initialValue?: string
  renderCondition?: YamlCompareArr
  hideFromReadData?: YamlCompareArr
  customReadDataLabels?: {
    condition: string
    title: string
    value: string
  }[]
}

export interface DestinationDynamicField {
  name: DestinationYamlProperties['name']
  componentType: DestinationYamlProperties['componentType']
  title: DestinationYamlProperties['displayName']
  value?: DestinationYamlProperties['initialValue']
  renderCondition?: DestinationYamlProperties['renderCondition']

  // from "componentProperties"
  type?: string
  required?: boolean
  placeholder?: string
  options?: DropdownProps['options']
}
