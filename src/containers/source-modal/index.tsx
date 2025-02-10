import React, { useRef, type Dispatch, type FC, type SetStateAction } from 'react'
import { useModalStore } from '../../store'
import { ENTITY_TYPES, useKeyDown } from '@odigos/ui-utils'
import type { Namespace, PersistSources } from '../../@types'
import { Modal, NavigationButtons } from '@odigos/ui-components'
import { SourceSelectionForm, type SourceSelectionFormRef, type SourceSelectionFormProps } from '../source-selection-form'

interface SourceModalProps {
  componentType?: SourceSelectionFormProps['componentType']
  namespaces: Namespace[]
  namespace?: Namespace // after selecting namespace, we should retrieve the single namespace with it's sources array
  namespacesLoading: boolean
  selectedNamespace: string
  setSelectedNamespace: Dispatch<SetStateAction<string>>
  persistSources: PersistSources
}

const SourceModal: FC<SourceModalProps> = ({
  componentType = 'FAST',
  namespaces,
  namespace,
  namespacesLoading,
  selectedNamespace,
  setSelectedNamespace,
  persistSources,
}) => {
  const { currentModal, setCurrentModal } = useModalStore()
  const isOpen = currentModal === ENTITY_TYPES.SOURCE

  const onSelectNamespace = (ns: string) => {
    setSelectedNamespace((prev) => (prev === ns ? '' : ns))
  }

  const handleClose = () => {
    setSelectedNamespace('')
    setCurrentModal('')
  }

  const handleSubmit = async () => {
    if (formRef.current) {
      const { apps, futureApps } = formRef.current.getFormValues()
      await persistSources(apps, futureApps)
      handleClose()
    }
  }

  const formRef = useRef<SourceSelectionFormRef>(null)
  useKeyDown({ key: 'Enter', active: isOpen }, handleSubmit)

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
        ref={formRef}
        componentType={componentType}
        isModal
        namespaces={namespaces}
        namespace={namespace}
        namespacesLoading={namespacesLoading}
        selectedNamespace={selectedNamespace}
        onSelectNamespace={onSelectNamespace}
      />
    </Modal>
  )
}

export { SourceModal, type SourceModalProps }
