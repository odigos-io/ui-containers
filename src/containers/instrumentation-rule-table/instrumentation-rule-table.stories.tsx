import React, { useEffect } from 'react'
import { useEntityStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { ENTITY_TYPES, MOCK_INSTRUMENTATION_RULES } from '@odigos/ui-utils'
import { InstrumentationRuleTable, type InstrumentationRuleTableProps } from '.'

export default {
  title: 'Containers/InstrumentationRuleTable',
  component: InstrumentationRuleTable,
}

export const Default: StoryFn<InstrumentationRuleTableProps> = (props) => {
  const { setEntities } = useEntityStore()

  useEffect(() => {
    setEntities(ENTITY_TYPES.INSTRUMENTATION_RULE, MOCK_INSTRUMENTATION_RULES)
  }, [])

  return <InstrumentationRuleTable {...props} />
}

Default.args = {}
