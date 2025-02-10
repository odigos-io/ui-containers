import type { Action } from '@odigos/ui-utils'

export interface ActionFormData {
  type: Action['type']
  name: Action['spec']['actionName']
  notes: Action['spec']['notes']
  signals: Action['spec']['signals']
  disabled: Action['spec']['disabled']

  collectContainerAttributes: Action['spec']['collectContainerAttributes']
  collectWorkloadId: Action['spec']['collectWorkloadId']
  collectClusterId: Action['spec']['collectClusterId']
  labelsAttributes: Action['spec']['labelsAttributes']
  annotationsAttributes: Action['spec']['annotationsAttributes']
  clusterAttributes: Action['spec']['clusterAttributes']
  attributeNamesToDelete: Action['spec']['attributeNamesToDelete']
  renames: Action['spec']['renames']
  piiCategories: Action['spec']['piiCategories']
  fallbackSamplingRatio: Action['spec']['fallbackSamplingRatio']
  samplingPercentage: Action['spec']['samplingPercentage']
  endpointsFilters: Action['spec']['endpointsFilters']
}
