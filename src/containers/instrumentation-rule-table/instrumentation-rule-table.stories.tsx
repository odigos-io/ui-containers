import React from 'react'
import type { StoryFn } from '@storybook/react'
import { MOCK_INSTRUMENTATION_RULES } from '@odigos/ui-utils'
import { InstrumentationRuleTable, type InstrumentationRuleTableProps } from '.'

export default {
  title: 'Containers/InstrumentationRuleTable',
  component: InstrumentationRuleTable,
}

export const Default: StoryFn<InstrumentationRuleTableProps> = (props) => {
  return <InstrumentationRuleTable {...props} />
}

Default.args = {
  instrumentationRules: MOCK_INSTRUMENTATION_RULES,
}
