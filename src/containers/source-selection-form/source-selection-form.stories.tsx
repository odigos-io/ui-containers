import React, { useState } from 'react'
import type { StoryFn } from '@storybook/react'
import { MOCK_SOURCES } from '@odigos/ui-utils'
import { SourceSelectionForm, type SourceSelectionFormProps } from '.'

export default {
  title: 'Containers/SourceSelectionForm',
  component: SourceSelectionForm,
}

export const Default: StoryFn<SourceSelectionFormProps> = (props) => {
  const [selectedNamespace, setSelectedNamespace] = useState(props.selectedNamespace || '')

  const namespaces = props.namespaces || []
  const namespace = !!selectedNamespace ? namespaces.find((n) => n.name === selectedNamespace) : undefined

  const onSelectNamespace = (ns: string) => {
    setSelectedNamespace((prev) => (prev === ns ? '' : ns))
  }

  return (
    <SourceSelectionForm
      componentType={props.componentType || 'FAST'}
      isModal={props.isModal || false}
      namespaces={namespaces}
      namespace={namespace}
      namespacesLoading={props.namespacesLoading || false}
      selectedNamespace={selectedNamespace}
      onSelectNamespace={onSelectNamespace}
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
