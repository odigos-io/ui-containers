import { type Action, ACTION_TYPE } from '@odigos/ui-utils'

const buildSpecCell = (action: Action) => {
  const {
    type,
    spec: {
      collectContainerAttributes,
      collectWorkloadId,
      collectClusterId,
      labelsAttributes,
      annotationsAttributes,
      clusterAttributes,
      attributeNamesToDelete,
      renames,
      piiCategories,
      fallbackSamplingRatio,
      samplingPercentage,
      endpointsFilters,
    },
  } = action

  let str = ''

  if (type === ACTION_TYPE.K8S_ATTRIBUTES) {
    if (collectContainerAttributes) str += 'Container Attributes, '
    if (collectWorkloadId) str += 'Workload ID, '
    if (collectClusterId) str += 'Cluster ID, '
    labelsAttributes?.forEach(({ labelKey, attributeKey }, idx) => {
      let str = ''
      str += `Label: ${labelKey} ${attributeKey} `
      if (idx === labelsAttributes.length - 1) str += ', '
    })
    annotationsAttributes?.forEach(({ annotationKey, attributeKey }, idx) => {
      let str = ''
      str += `Annotation: ${annotationKey} ${attributeKey} `
      if (idx === annotationsAttributes.length - 1) str += ', '
    })
  }

  if (type === ACTION_TYPE.ADD_CLUSTER_INFO) {
    clusterAttributes?.forEach(({ attributeName, attributeStringValue }, idx) => {
      str += `${attributeName}: ${attributeStringValue}`
      if (idx < clusterAttributes.length - 1) str += ', '
    })
  }

  if (type === ACTION_TYPE.DELETE_ATTRIBUTES) {
    attributeNamesToDelete?.forEach((attributeName, idx) => {
      str += attributeName
      if (idx < attributeNamesToDelete.length - 1) str += ', '
    })
  }

  if (type === ACTION_TYPE.RENAME_ATTRIBUTES) {
    const entries = Object.entries(renames || {})
    entries.forEach(([oldName, newName], idx) => {
      str += `${oldName}: ${newName}`
      if (idx < entries.length - 1) str += ', '
    })
  }

  if (type === ACTION_TYPE.PII_MASKING) {
    piiCategories?.forEach((attributeName, idx) => {
      str += attributeName
      if (idx < piiCategories.length - 1) str += ', '
    })
  }

  if (type === ACTION_TYPE.ERROR_SAMPLER) {
    str += String(fallbackSamplingRatio)
  }

  if (type === ACTION_TYPE.PROBABILISTIC_SAMPLER) {
    str += String(samplingPercentage)
    str += '%'
  }

  if (type === ACTION_TYPE.LATENCY_SAMPLER) {
    endpointsFilters?.forEach(({ serviceName, httpRoute, minimumLatencyThreshold, fallbackSamplingRatio }, idx) => {
      str += `Endpoint${endpointsFilters.length > 1 ? ` #${idx + 1}` : ''}=${serviceName}${httpRoute}`
      str += ` Latency=${minimumLatencyThreshold}`
      str += ` Sampling=${fallbackSamplingRatio}`
      if (idx < endpointsFilters.length - 1) str += ', '
    })
  }

  return str
}

export { buildSpecCell }
