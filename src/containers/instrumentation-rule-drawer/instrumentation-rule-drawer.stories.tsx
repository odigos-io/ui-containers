import React, { useEffect } from 'react'
import { useDrawerStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { ENTITY_TYPES, INSTRUMENTATION_RULE_TYPE } from '@odigos/ui-utils'
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
  instrumentationRules: [
    {
      type: INSTRUMENTATION_RULE_TYPE.CODE_ATTRIBUTES,
      ruleId: 'ui-instrumentation-rule-nxfzl',
      ruleName: '',
      notes: '',
      disabled: false,
      mutable: true,
      profileName: '',
      payloadCollection: {
        httpRequest: null,
        httpResponse: null,
        dbQuery: null,
        messaging: null,
      },
      codeAttributes: {
        column: null,
        filePath: true,
        function: true,
        lineNumber: true,
        namespace: null,
        stacktrace: null,
      },
    },
    {
      type: INSTRUMENTATION_RULE_TYPE.PAYLOAD_COLLECTION,
      ruleId: 'ui-instrumentation-rule-p4kbw',
      ruleName: '',
      notes: '',
      disabled: false,
      mutable: true,
      profileName: '',
      payloadCollection: {
        httpRequest: {
          mimeTypes: null,
          maxPayloadLength: null,
          dropPartialPayloads: null,
        },
        httpResponse: {
          mimeTypes: null,
          maxPayloadLength: null,
          dropPartialPayloads: null,
        },
        dbQuery: {
          maxPayloadLength: null,
          dropPartialPayloads: null,
        },
        messaging: {
          maxPayloadLength: null,
          dropPartialPayloads: null,
        },
      },
      codeAttributes: {
        column: null,
        filePath: null,
        function: null,
        lineNumber: null,
        namespace: null,
        stacktrace: null,
      },
    },
  ],
  updateInstrumentationRule: (ruleId, instrumentationRule) => {},
  deleteInstrumentationRule: (ruleId) => {},
}
