import React, { useState } from 'react'
import type { StoryFn } from '@storybook/react'
import { MOCK_NAMESPACES } from '@odigos/ui-utils'
import { SourceSelectionForm, type SourceSelectionFormProps } from '.'

export default {
  title: 'Containers/SourceSelectionForm',
  component: SourceSelectionForm,
}

export const Default: StoryFn<SourceSelectionFormProps> = (props) => {
  const [selectedNamespace, setSelectedNamespace] = useState(props.selectedNamespace || '')
  const onSelectNamespace = (ns: string) => setSelectedNamespace((prev) => (prev === ns ? '' : ns))

  const namespaces = props.namespaces || []
  const namespace = !!selectedNamespace ? namespaces.find((n) => n.name === selectedNamespace) : undefined

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
  namespaces: MOCK_NAMESPACES.map((ns) => ({
    ...ns,
    sources: ns.sources?.map((src) => ({
      ...src,
      selected: false,
    })),
  })),
}
