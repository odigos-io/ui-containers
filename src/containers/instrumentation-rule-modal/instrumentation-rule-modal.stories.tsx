import React, { useEffect } from 'react'
import { useModalStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { ENTITY_TYPES } from '@odigos/ui-utils'
import { InstrumentationRuleModal, type InstrumentationRuleModalProps } from '.'

export default {
  title: 'Containers/InstrumentationRuleModal',
  component: InstrumentationRuleModal,
}

export const Default: StoryFn<InstrumentationRuleModalProps> = (props) => {
  const { setCurrentModal } = useModalStore()

  useEffect(() => {
    setCurrentModal(ENTITY_TYPES.INSTRUMENTATION_RULE)
  }, [])

  return <InstrumentationRuleModal {...props} />
}

Default.args = {
  isEnterprise: true,
  createInstrumentationRule: (instrumentationRule) => {},
}
