import React, { type FC, useState } from 'react'
import { useModalStore } from '../../store'
import { useSourceSelectionFormData } from '../../helpers'
import { ENTITY_TYPES, useKeyDown } from '@odigos/ui-utils'
import type { Namespace, PersistSources } from '../../@types'
import { Modal, NavigationButtons } from '@odigos/ui-components'
import { SourceSelectionForm, type SourceSelectionFormProps } from '../source-selection-form'

interface SourceModalProps {
  componentType?: SourceSelectionFormProps['componentType']
  namespacesLoading: boolean
  namespaces: Namespace[]
  namespace?: Namespace
  getNamespaceSources: (ns: string) => void
  persistSources: PersistSources
}

const SourceModal: FC<SourceModalProps> = ({
  componentType = 'FAST',
  namespacesLoading,
  namespaces,
  namespace,
  getNamespaceSources,
  persistSources,
}) => {
  const { currentModal, setCurrentModal } = useModalStore()
  const isOpen = currentModal === ENTITY_TYPES.SOURCE

  const [selectedNamespace, setSelectedNamespace] = useState('')

  const onSelectNamespace = (ns: string) => {
    setSelectedNamespace((prev) => {
      const val = prev === ns ? '' : ns

      getNamespaceSources(val)

      return val
    })
  }

  const formState = useSourceSelectionFormData({ namespaces, namespace, selectedNamespace, onSelectNamespace })
  const { getApiSourcesPayload, getApiFutureAppsPayload } = formState

  const handleClose = () => {
    setSelectedNamespace('')
    setCurrentModal('')
  }

  const handleSubmit = () => {
    persistSources(getApiSourcesPayload(), getApiFutureAppsPayload())
    handleClose()
  }

  useKeyDown({ key: 'Enter', active: isOpen }, () => handleSubmit())

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header={{ title: 'Add Source' }}
      actionComponent={
        <NavigationButtons
          buttons={[
            {
              label: 'DONE',
              variant: 'primary',
              onClick: handleSubmit,
            },
          ]}
        />
      }
    >
      <SourceSelectionForm
        componentType={componentType}
        isModal
        namespaces={namespaces}
        namespacesLoading={namespacesLoading}
        selectedNamespace={selectedNamespace}
        onSelectNamespace={onSelectNamespace}
        {...formState}
      />
    </Modal>
  )
}

export { SourceModal, type SourceModalProps }
