import React, { useEffect } from 'react'
import { useDrawerStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { ActionDrawer, type ActionDrawerProps } from '.'
import { ACTION_TYPE, CONDITION_STATUS, ENTITY_TYPES, SIGNAL_TYPE } from '@odigos/ui-utils'

export default {
  title: 'Containers/ActionDrawer',
  component: ActionDrawer,
}

export const Default: StoryFn<ActionDrawerProps> = (props) => {
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  useEffect(() => {
    setDrawerType(ENTITY_TYPES.ACTION)
    setDrawerEntityId('da-w9wtd')
  }, [])

  return <ActionDrawer {...props} />
}

Default.args = {
  actions: [
    {
      id: 'da-w9wtd',
      type: ACTION_TYPE.DELETE_ATTRIBUTES,
      spec: {
        signals: [SIGNAL_TYPE.LOGS, SIGNAL_TYPE.METRICS, SIGNAL_TYPE.TRACES],
        attributeNamesToDelete: ['test'],
      },
      conditions: [
        {
          status: CONDITION_STATUS.TRUE,
          type: 'TransformedToProcessor',
          reason: 'ProcessorCreated',
          message: 'The action has been reconciled to a processor resource.',
          lastTransitionTime: '2025-02-08T18:00:40Z',
        },
      ],
    },
    {
      id: 'ra-8n79v',
      type: ACTION_TYPE.RENAME_ATTRIBUTES,
      spec: {
        signals: [SIGNAL_TYPE.LOGS, SIGNAL_TYPE.METRICS, SIGNAL_TYPE.TRACES],
        renames: { orel: 'otel' },
      },
      conditions: [
        {
          status: CONDITION_STATUS.TRUE,
          type: 'TransformedToProcessor',
          reason: 'ProcessorCreated',
          message: 'The action has been reconciled to a processor resource.',
          lastTransitionTime: '2025-02-08T18:00:51Z',
        },
      ],
    },
    {
      id: 'pi-rxn2z',
      type: ACTION_TYPE.PII_MASKING,
      spec: {
        signals: [SIGNAL_TYPE.TRACES],
        piiCategories: ['CREDIT_CARD'],
      },
      conditions: [
        {
          status: CONDITION_STATUS.TRUE,
          type: 'TransformedToProcessor',
          reason: 'ProcessorCreated',
          message: 'The action has been reconciled to a processor resource.',
          lastTransitionTime: '2025-02-08T18:00:27Z',
        },
      ],
    },
  ],
  updateAction: (id, action) => {},
  deleteAction: (id, actionType) => {},
}
