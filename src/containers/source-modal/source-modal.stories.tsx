import React, { useEffect, useState } from 'react'
import { useModalStore } from '../../store'
import type { Namespace } from '../../@types'
import type { StoryFn } from '@storybook/react'
import { SourceModal, type SourceModalProps } from '.'
import { ENTITY_TYPES, MOCK_SOURCES } from '@odigos/ui-utils'

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
  const [namespace, setNamespace] = useState<Namespace | undefined>(props.namespace || undefined)

  return (
    <SourceModal
      namespacesLoading={props.namespacesLoading || false}
      namespaces={namespaces}
      namespace={namespace}
      getNamespaceSources={(ns) => setNamespace(namespaces.find((n) => n.name === ns))}
      persistSources={async () => {}}
    />
  )
}

Default.args = {
  namespaces: [
    {
      name: 'default',
      selected: false,
      sources: MOCK_SOURCES.map((s) => ({ ...s, selected: false })),
    },
    {
      name: 'odigos-system',
      selected: false,
      sources: undefined,
    },
    {
      name: 'kube-public',
      selected: false,
      sources: undefined,
    },
  ],
}
