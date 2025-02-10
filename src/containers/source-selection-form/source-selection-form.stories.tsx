import React, { useState } from 'react'
import type { Namespace } from '../../@types'
import type { StoryFn } from '@storybook/react'
import { MOCK_SOURCES } from '@odigos/ui-utils'
import { useSourceSelectionFormData } from '../../helpers'
import { SourceSelectionForm, type SourceSelectionFormProps } from '.'

export default {
  title: 'Containers/SourceSelectionForm',
  component: SourceSelectionForm,
}

export const Default: StoryFn<SourceSelectionFormProps> = (props) => {
  const namespaces = props.namespaces || []

  const [selectedNamespace, setSelectedNamespace] = useState(props.selectedNamespace || '')
  const [namespacesLoading, setNamespacesLoading] = useState(props.namespacesLoading || false)
  const [namespace, setNamespace] = useState<Namespace | undefined>(undefined)

  const onSelectNamespace = (ns: string) => {
    setSelectedNamespace((prev) => {
      const val = prev === ns ? '' : ns

      setNamespace(!!val ? namespaces.find((n) => n.name === val) : undefined)

      return val
    })
  }

  const formState = useSourceSelectionFormData({
    namespaces,
    namespace,
    selectedNamespace,
    onSelectNamespace,
  })

  return (
    <SourceSelectionForm
      componentType={props.componentType || 'FAST'}
      isModal={props.isModal || false}
      namespaces={namespaces}
      namespacesLoading={namespacesLoading}
      selectedNamespace={selectedNamespace}
      onSelectNamespace={onSelectNamespace}
      {...formState}
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
