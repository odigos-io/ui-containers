import { DISPLAY_TITLES, type InstrumentationRule } from '@odigos/ui-utils'
import { DATA_CARD_FIELD_TYPES, type DataCardFieldsProps } from '@odigos/ui-components'

const buildCard = (rule: InstrumentationRule) => {
  const { type, ruleName, notes, disabled, profileName, payloadCollection, codeAttributes } = rule

  const arr: DataCardFieldsProps['data'] = [
    { title: DISPLAY_TITLES.TYPE, value: type },
    { type: DATA_CARD_FIELD_TYPES.ACTIVE_STATUS, title: DISPLAY_TITLES.STATUS, value: String(!disabled) },
    { title: DISPLAY_TITLES.NAME, value: ruleName },
    { title: DISPLAY_TITLES.NOTES, value: notes },
    { title: DISPLAY_TITLES.MANAGED_BY_PROFILE, value: profileName },
    { type: DATA_CARD_FIELD_TYPES.DIVIDER },
  ]

  if (!!payloadCollection) {
    const str = Object.entries(payloadCollection)
      .filter(([key, val]) => !!val)
      .map(([key, val]) => key)
      .join(', ')

    if (!!str) arr.push({ title: 'Collect', value: str })
  }

  if (!!codeAttributes) {
    const str = Object.entries(codeAttributes)
      .filter(([key, val]) => !!val)
      .map(([key, val]) => key)
      .join(', ')

    if (!!str) arr.push({ title: 'Collect', value: str })
  }

  return arr
}

export { buildCard }
