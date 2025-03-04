import React, { forwardRef, type PropsWithChildren, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import Theme from '@odigos/ui-theme'
import { EditIcon, TrashIcon, type SVG } from '@odigos/ui-icons'
import { useDrawerStore, useNotificationStore, usePendingStore } from '../../../store'
import { ENTITY_TYPES, NOTIFICATION_TYPE, useKeyDown, WorkloadId } from '@odigos/ui-utils'
import { CancelWarning, DeleteWarning, Drawer, DrawerProps, Input, Text } from '@odigos/ui-components'

interface OverviewDrawerProps extends PropsWithChildren {
  width?: number
  title: string
  titleTooltip?: string
  icon?: SVG
  iconSrc?: string
  isEdit?: boolean
  isFormDirty?: boolean
  isLastItem?: boolean
  onEdit?: (bool?: boolean) => void
  onSave?: (newTitle: string) => void
  onDelete?: () => void
  onCancel?: () => void
  tabs?: DrawerProps['header']['tabs']
}

interface EditTitleRef {
  getTitle: () => string
  clearTitle: () => void
}

const OverviewDrawer: React.FC<OverviewDrawerProps> = ({
  children,
  width = 640,
  title,
  titleTooltip,
  icon,
  iconSrc,
  isEdit = false,
  isFormDirty = false,
  isLastItem = false,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  tabs,
}) => {
  const theme = Theme.useTheme()
  const { isThisPending } = usePendingStore()
  const { addNotification } = useNotificationStore()
  const { drawerType, drawerEntityId, setDrawerType, setDrawerEntityId } = useDrawerStore()

  useKeyDown({ key: 'Enter', active: isEdit }, () => clickSave())

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

  const titleRef = useRef<EditTitleRef>(null)
  const isSource = drawerType === ENTITY_TYPES.SOURCE

  const closeDrawer = () => {
    setDrawerType(null)
    setDrawerEntityId(null)
    if (onEdit) onEdit(false)
    setIsDeleteModalOpen(false)
    setIsCancelModalOpen(false)
  }

  const closeWarningModals = () => {
    setIsDeleteModalOpen(false)
    setIsCancelModalOpen(false)
  }

  const handleCancel = () => {
    titleRef.current?.clearTitle()
    if (onCancel) onCancel()
    closeWarningModals()
  }

  const clickCancel = () => {
    const isTitleDirty = titleRef.current?.getTitle() !== title
    if (isFormDirty || isTitleDirty) {
      setIsCancelModalOpen(true)
    } else {
      handleCancel()
    }
  }

  const handleDelete = () => {
    if (onDelete) onDelete()
    closeWarningModals()
  }

  const clickDelete = () => {
    setIsDeleteModalOpen(true)
  }

  const clickSave = () => {
    if (onSave) onSave(titleRef.current?.getTitle() || '')
  }

  const isPending = useMemo(() => {
    if (!drawerType) return false

    return isThisPending({
      entityType: drawerType as ENTITY_TYPES,
      entityId: drawerEntityId as string | WorkloadId,
    })
  }, [drawerType, drawerEntityId])

  const handlePending = (action: string) => {
    addNotification({
      type: NOTIFICATION_TYPE.WARNING,
      title: 'Pending',
      message: `Cannot click ${action}, ${drawerType} is pending`,
      hideFromHistory: true,
    })
  }

  const actionButtons: DrawerProps['header']['actionButtons'] = []

  if (!!onEdit && !isEdit)
    actionButtons.push({
      'data-id': 'drawer-edit',
      variant: 'tertiary',
      onClick: isPending ? () => handlePending('edit') : onEdit ? () => onEdit(true) : undefined,
      children: (
        <>
          <EditIcon />
          <Text size={14} family='secondary' decoration='underline'>
            Edit
          </Text>
        </>
      ),
    })

  if (!!onDelete && !isEdit)
    actionButtons.push({
      'data-id': 'drawer-delete',
      variant: 'tertiary',
      onClick: isPending ? () => handlePending(isSource ? 'uninstrument' : 'delete') : onEdit ? clickDelete : undefined,
      children: (
        <>
          <TrashIcon />
          <Text color={theme.text.error} size={14} family='secondary' decoration='underline'>
            {isSource ? 'Uninstrument' : 'Delete'}
          </Text>
        </>
      ),
    })

  return (
    <>
      <Drawer
        isOpen
        onClose={isEdit ? clickCancel : closeDrawer}
        closeOnEscape={!isDeleteModalOpen && !isCancelModalOpen}
        width={`${width + 64}px`} // +64 because of "ContentArea" padding
        header={{
          icon,
          iconSrc,
          title,
          titleTooltip,
          replaceTitleWith: !isSource && isEdit ? () => <EditTitle ref={titleRef} title={title} /> : undefined,
          actionButtons,
          tabs,
        }}
        footer={{
          isOpen: isEdit,
          leftButtons: [
            {
              'data-id': 'drawer-save',
              variant: 'primary',
              onClick: clickSave,
              children: 'save',
            },
            {
              'data-id': 'drawer-cancel',
              variant: 'secondary',
              onClick: clickCancel,
              children: 'cancel',
            },
          ],
          rightButtons: [
            {
              'data-id': 'drawer-delete',
              variant: 'tertiary',
              onClick: clickDelete,
              children: (
                <>
                  <TrashIcon />
                  <Text size={14} color={theme.text.error} family='secondary' decoration='underline'>
                    delete
                  </Text>
                </>
              ),
            },
          ],
        }}
      >
        {children}
      </Drawer>

      <DeleteWarning
        isOpen={isDeleteModalOpen}
        noOverlay
        name={`${drawerType}${title ? ` (${title})` : ''}`}
        type={drawerType as ENTITY_TYPES}
        isLastItem={isLastItem}
        onApprove={handleDelete}
        onDeny={closeWarningModals}
      />
      <CancelWarning isOpen={isCancelModalOpen} noOverlay name='edit mode' onApprove={handleCancel} onDeny={closeWarningModals} />
    </>
  )
}

const EditTitle = forwardRef<EditTitleRef, { title: string }>(({ title }, ref) => {
  const [inputValue, setInputValue] = useState(title)

  useEffect(() => {
    setInputValue(title)
  }, [title])

  useImperativeHandle(ref, () => ({
    getTitle: () => inputValue,
    clearTitle: () => setInputValue(title),
  }))

  return <Input data-id='title' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
})

export { OverviewDrawer, type OverviewDrawerProps }
