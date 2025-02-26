import type { InstrumentationRule } from '@odigos/ui-utils'

const buildSpecCell = (rule: InstrumentationRule) => {
  const { payloadCollection, codeAttributes } = rule

  let str = ''

  if (!!payloadCollection) {
    str += Object.entries(payloadCollection)
      .filter(([key, val]) => !!val)
      .map(([key, val]) => key)
      .join(', ')
  }

  if (!!codeAttributes) {
    str += Object.entries(codeAttributes)
      .filter(([key, val]) => !!val)
      .map(([key, val]) => key)
      .join(', ')
  }

  return str
}

export { buildSpecCell }
