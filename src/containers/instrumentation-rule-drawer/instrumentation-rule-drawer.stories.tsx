import React, { useEffect } from 'react'
import { useDrawerStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { ENTITY_TYPES, MOCK_INSTRUMENTATION_RULES } from '@odigos/ui-utils'
import { InstrumentationRuleDrawer, type InstrumentationRuleDrawerProps } from '.'

export default {
  title: 'Containers/InstrumentationRuleDrawer',
  component: InstrumentationRuleDrawer,
}

export const Default: StoryFn<InstrumentationRuleDrawerProps> = (props) => {
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  useEffect(() => {
    setDrawerType(ENTITY_TYPES.INSTRUMENTATION_RULE)
    setDrawerEntityId('ui-instrumentation-rule-nxfzl')
  }, [])

  return <InstrumentationRuleDrawer {...props} />
}

Default.args = {
  instrumentationRules: MOCK_INSTRUMENTATION_RULES,
  updateInstrumentationRule: () => {},
  deleteInstrumentationRule: () => {},
}
