import { DATA_CARD_FIELD_TYPES, type DataCardFieldsProps } from '@odigos/ui-components'
import { compareCondition, type Destination, type DestinationYamlProperties, DISPLAY_TITLES, safeJsonParse, SIGNAL_TYPE } from '@odigos/ui-utils'

const buildMonitorsList = (exportedSignals: Destination['exportedSignals']): string =>
  Object.keys(exportedSignals)
    .filter((key) => exportedSignals[key as SIGNAL_TYPE])
    .join(', ')

const buildCard = (destination: Destination, yamlFields: DestinationYamlProperties[]) => {
  const { exportedSignals, destinationType, fields } = destination

  const arr: DataCardFieldsProps['data'] = [
    { title: DISPLAY_TITLES.NAME, value: destinationType.displayName },
    { title: DISPLAY_TITLES.TYPE, value: destinationType.type },
    { type: DATA_CARD_FIELD_TYPES.MONITORS, title: DISPLAY_TITLES.MONITORS, value: buildMonitorsList(exportedSignals) },
    { type: DATA_CARD_FIELD_TYPES.DIVIDER, width: '100%' },
  ]

  const parsedFields = safeJsonParse<Record<string, string>>(fields, {})
  const sortedParsedFields =
    yamlFields.map((field) => ({ key: field.name, value: parsedFields[field.name] ?? null })).filter((item) => item.value !== null) ||
    Object.entries(parsedFields).map(([key, value]) => ({ key, value }))

  sortedParsedFields.map(({ key, value }) => {
    const { displayName, secret, componentProperties, hideFromReadData, customReadDataLabels } = yamlFields.find((field) => field.name === key) || {}

    const shouldHide = !!hideFromReadData?.length
      ? compareCondition(
          hideFromReadData,
          yamlFields.map((field) => ({ name: field.name, value: parsedFields[field.name] ?? null }))
        )
      : false

    if (!shouldHide) {
      const { type } = safeJsonParse(componentProperties, { type: '' })
      const isSecret = (secret || type === 'password') && !!value.length ? new Array(10).fill('•').join('') : ''

      if (!!customReadDataLabels?.length) {
        customReadDataLabels.forEach(({ condition, ...custom }) => {
          if (condition == value) {
            arr.push({
              title: custom.title,
              value: custom.value,
            })
          }
        })
      } else {
        arr.push({
          title: displayName || key,
          value: isSecret || value,
        })
      }
    }
  })

  return arr
}

export { buildCard }
