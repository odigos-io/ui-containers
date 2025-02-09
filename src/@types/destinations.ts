import type { DropdownProps } from '@odigos/ui-components'
import type { Destination, DestinationYamlProperties } from '@odigos/ui-utils'

export interface DestinationFormData {
  type: Destination['destinationType']['type']
  name: Destination['destinationType']['displayName']
  exportedSignals: Destination['exportedSignals']
  fields: { key: string; value: string }[]
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
