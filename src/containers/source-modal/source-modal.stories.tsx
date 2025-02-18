import React, { useEffect, useState } from 'react'
import { useModalStore } from '../../store'
import type { StoryFn } from '@storybook/react'
import { SourceModal, type SourceModalProps } from '.'
import { ENTITY_TYPES, MOCK_NAMESPACES } from '@odigos/ui-utils'

export default {
  title: 'Containers/SourceModal',
  component: SourceModal,
}

export const Default: StoryFn<SourceModalProps> = (props) => {
  const { setCurrentModal } = useModalStore()

  useEffect(() => {
    setCurrentModal(ENTITY_TYPES.SOURCE)
  }, [])

  const namespaces = props.namespaces || []
  const [selectedNamespace, setSelectedNamespace] = useState(props.selectedNamespace || '')
  const namespace = !!selectedNamespace ? namespaces.find((n) => n.name === selectedNamespace) : undefined

  return (
    <SourceModal
      namespaces={namespaces}
      namespace={namespace}
      namespacesLoading={props.namespacesLoading || false}
      selectedNamespace={selectedNamespace}
      setSelectedNamespace={setSelectedNamespace}
      persistSources={async () => {}}
    />
  )
}

Default.args = {
  namespaces: MOCK_NAMESPACES,
}
