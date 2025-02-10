import React, { forwardRef, useImperativeHandle } from 'react'
import { Fast } from './fast'
import { Simple } from './simple'
import type { Namespace } from '../../@types'
import { useSourceSelectionFormData } from '../../helpers'
import type { AvailableSourcesByNamespace, NamespaceSelectionFormData, SourceSelectionFormData } from '../../store'

interface SourceSelectionFormProps {
  componentType: 'SIMPLE' | 'FAST'
  isModal?: boolean

  namespaces: Namespace[]
  namespace?: Namespace
  namespacesLoading: boolean
  selectedNamespace: string
  onSelectNamespace: (namespace: string) => void
}

interface SourceSelectionFormRef {
  getFormValues: () => {
    initial: AvailableSourcesByNamespace
    apps: SourceSelectionFormData
    futureApps: NamespaceSelectionFormData
  }
}

const SourceSelectionForm = forwardRef<SourceSelectionFormRef, SourceSelectionFormProps>(
  ({ componentType, isModal, namespaces, namespace, namespacesLoading, selectedNamespace, onSelectNamespace }, ref) => {
    const formState = useSourceSelectionFormData({ namespaces, namespace, selectedNamespace, onSelectNamespace })
    const { recordedInitialSources, getApiSourcesPayload, getApiFutureAppsPayload } = formState

    useImperativeHandle(ref, () => ({
      getFormValues: () => ({
        initial: recordedInitialSources,
        apps: getApiSourcesPayload(),
        futureApps: getApiFutureAppsPayload(),
      }),
    }))

    switch (componentType) {
      case 'SIMPLE':
        return (
          <Simple
            isModal={isModal}
            namespaces={namespaces}
            namespacesLoading={namespacesLoading}
            selectedNamespace={selectedNamespace}
            onSelectNamespace={onSelectNamespace}
            {...formState}
          />
        )

      case 'FAST':
        return (
          <Fast
            isModal={isModal}
            namespacesLoading={namespacesLoading}
            selectedNamespace={selectedNamespace}
            onSelectNamespace={onSelectNamespace}
            {...formState}
          />
        )

      default:
        return null
    }
  }
)

export { SourceSelectionForm, type SourceSelectionFormProps, type SourceSelectionFormRef }
