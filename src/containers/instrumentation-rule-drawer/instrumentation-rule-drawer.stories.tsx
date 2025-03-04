import React, { useEffect } from 'react'
import { useDrawerStore, useEntityStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { ENTITY_TYPES, MOCK_INSTRUMENTATION_RULES } from '@odigos/ui-utils'
import { InstrumentationRuleDrawer, type InstrumentationRuleDrawerProps } from '.'

export default {
  title: 'Containers/InstrumentationRuleDrawer',
  component: InstrumentationRuleDrawer,
}

export const Default: StoryFn<InstrumentationRuleDrawerProps> = (props) => {
  const { setEntities } = useEntityStore()
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  useEffect(() => {
    setEntities(ENTITY_TYPES.INSTRUMENTATION_RULE, MOCK_INSTRUMENTATION_RULES)
    setDrawerType(ENTITY_TYPES.INSTRUMENTATION_RULE)
    setDrawerEntityId(MOCK_INSTRUMENTATION_RULES[0].ruleId)
  }, [])

  return <InstrumentationRuleDrawer {...props} />
}

Default.args = {
  updateInstrumentationRule: () => {},
  deleteInstrumentationRule: () => {},
}
