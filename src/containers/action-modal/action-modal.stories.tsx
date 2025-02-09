import React, { useEffect } from 'react'
import { useModalStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { ENTITY_TYPES } from '@odigos/ui-utils'
import { ActionModal, type ActionModalProps } from '.'

export default {
  title: 'Containers/ActionModal',
  component: ActionModal,
}

export const Default: StoryFn<ActionModalProps> = (props) => {
  const { setCurrentModal } = useModalStore()

  useEffect(() => {
    setCurrentModal(ENTITY_TYPES.ACTION)
  }, [])

  return <ActionModal {...props} />
}

Default.args = {
  createAction: () => {},
}
