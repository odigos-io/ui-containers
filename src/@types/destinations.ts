import type { DropdownProps } from '@odigos/ui-components'
import type { Condition as CompareCondition } from '@odigos/ui-utils'
import type { Condition, ExportedSignals, SupportedSignals } from './common'

type YamlCompareArr = [string, CompareCondition, string] | ['true' | 'false']

export interface DestinationTypeItem {
  type: string
  testConnectionSupported: boolean
  displayName: string
  imageUrl: string
  supportedSignals: SupportedSignals
  fields: {
    [key: string]: string
  }
}

export interface GetDestinationTypesResponse {
  destinationTypes: {
    categories: {
      name: string
      items: DestinationTypeItem[]
    }[]
  }
}

export interface DestinationDetailsField {
  name: string
  displayName: string
  componentType: string
  componentProperties: string
  secret: boolean
  initialValue: string
  renderCondition: YamlCompareArr
  hideFromReadData: YamlCompareArr
  customReadDataLabels: {
    condition: string
    title: string
    value: string
  }[]
}

export interface DynamicField {
  componentType: string
  name: string
  title: string
  value: any
  type?: string
  placeholder?: string
  required?: boolean
  options?: DropdownProps['options']
  renderCondition: YamlCompareArr
}

export interface DestinationDetailsResponse {
  destinationTypeDetails: {
    fields: DestinationDetailsField[]
  }
}

export interface DestinationInput {
  name: string
  type: string
  exportedSignals: ExportedSignals
  fields: {
    key: string
    value: string
  }[]
}

export interface DestinationTypeDetail {
  title: string
  value: string
}

export interface ConfiguredDestination {
  displayName: string
  category: string
  type: string
  exportedSignals: ExportedSignals
  imageUrl: string
  destinationTypeDetails: DestinationTypeDetail[]
}

export interface SelectedDestination {
  type: string
  display_name: string
  image_url: string
  supported_signals: SupportedSignals
  test_connection_supported: boolean
}

export interface Destination {
  id: string
  name: string
  type: string
  signals: {
    traces: boolean
    metrics: boolean
    logs: boolean
  }
  fields: Record<string, any>
  conditions: Condition[]
  destination_type: {
    type: string
    display_name: string
    image_url: string
    supported_signals: SupportedSignals
  }
}

export interface DestinationConfig {
  type: string
  name: string
  signals: SupportedSignals
  fields: {
    [key: string]: string
  }
}

export interface ActualDestination {
  id: string
  name: string
  exportedSignals: {
    traces: boolean
    metrics: boolean
    logs: boolean
  }
  fields: string
  conditions: Condition[]
  destinationType: {
    type: string
    displayName: string
    imageUrl: string
    supportedSignals: SupportedSignals
  }
}
