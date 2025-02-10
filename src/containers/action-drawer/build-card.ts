import { type Action, ACTION_TYPE, DISPLAY_TITLES } from '@odigos/ui-utils'
import { DATA_CARD_FIELD_TYPES, type DataCardFieldsProps } from '@odigos/ui-components'

const buildCard = (action: Action) => {
  const {
    type,
    spec: {
      actionName,
      notes,
      signals,
      disabled,

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

  const arr: DataCardFieldsProps['data'] = [
    { title: DISPLAY_TITLES.TYPE, value: type },
    { type: DATA_CARD_FIELD_TYPES.ACTIVE_STATUS, title: DISPLAY_TITLES.STATUS, value: String(!disabled) },
    { title: DISPLAY_TITLES.NAME, value: actionName },
    { title: DISPLAY_TITLES.NOTES, value: notes },
    { type: DATA_CARD_FIELD_TYPES.DIVIDER, width: '100%' },
    { type: DATA_CARD_FIELD_TYPES.MONITORS, title: DISPLAY_TITLES.SIGNALS_FOR_PROCESSING, value: signals.map((str) => str.toLowerCase()).join(', ') },
  ]

  if (type === ACTION_TYPE.K8S_ATTRIBUTES) {
    arr.push({ title: 'Collect Container Attributes', value: String(collectContainerAttributes) })
    arr.push({ title: 'Collect Workload ID', value: String(collectWorkloadId) })
    arr.push({ title: 'Collect Cluster ID', value: String(collectClusterId) })

    labelsAttributes?.forEach(({ labelKey, attributeKey }, idx) => {
      let str = ''
      str += `Label Key: ${labelKey}\n`
      str += `Attribute Key: ${attributeKey}`

      arr.push({ title: `Label${labelsAttributes.length > 1 ? ` #${idx + 1}` : ''}`, value: str })
    })

    annotationsAttributes?.forEach(({ annotationKey, attributeKey }, idx) => {
      let str = ''
      str += `Annotation Key: ${annotationKey}\n`
      str += `Attribute Key: ${attributeKey}`

      arr.push({ title: `Annotation${annotationsAttributes.length > 1 ? ` #${idx + 1}` : ''}`, value: str })
    })
  }

  if (type === ACTION_TYPE.ADD_CLUSTER_INFO) {
    let str = ''
    clusterAttributes?.forEach(({ attributeName, attributeStringValue }, idx) => {
      str += `${attributeName}: ${attributeStringValue}`
      if (idx < clusterAttributes.length - 1) str += ', '
    })

    arr.push({ title: 'Attributes', value: str })
  }

  if (type === ACTION_TYPE.DELETE_ATTRIBUTES) {
    let str = ''
    attributeNamesToDelete?.forEach((attributeName, idx) => {
      str += attributeName
      if (idx < attributeNamesToDelete.length - 1) str += ', '
    })

    arr.push({ title: 'Attributes', value: str })
  }

  if (type === ACTION_TYPE.RENAME_ATTRIBUTES) {
    let str = ''
    const entries = Object.entries(renames || {})
    entries.forEach(([oldName, newName], idx) => {
      str += `${oldName}: ${newName}`
      if (idx < entries.length - 1) str += ', '
    })

    arr.push({ title: 'Attributes', value: str })
  }

  if (type === ACTION_TYPE.PII_MASKING) {
    let str = ''
    piiCategories?.forEach((attributeName, idx) => {
      str += attributeName
      if (idx < piiCategories.length - 1) str += ', '
    })

    arr.push({ title: 'Attributes', value: str })
  }

  if (type === ACTION_TYPE.ERROR_SAMPLER) {
    arr.push({ title: 'Sampling Ratio', value: String(fallbackSamplingRatio) })
  }

  if (type === ACTION_TYPE.PROBABILISTIC_SAMPLER) {
    arr.push({ title: 'Sampling Percentage', value: String(samplingPercentage) })
  }

  if (type === ACTION_TYPE.LATENCY_SAMPLER) {
    endpointsFilters?.forEach(({ serviceName, httpRoute, minimumLatencyThreshold, fallbackSamplingRatio }, idx) => {
      let str = ''
      str += `Service Name: ${serviceName}\n`
      str += `HTTP Route: ${httpRoute}\n`
      str += `Min. Latency: ${minimumLatencyThreshold}\n`
      str += `Sampling Ratio: ${fallbackSamplingRatio}`

      arr.push({ title: `Endpoint${endpointsFilters.length > 1 ? ` #${idx + 1}` : ''}`, value: str })
    })
  }

  return arr
}

export { buildCard }
