import React, { type FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { buildCard } from './build-card'
import { SourceForm } from '../source-form'
import { CodeIcon, ListIcon } from '@odigos/ui-icons'
import { useDrawerStore, useEntityStore } from '../../store'
import { OverviewDrawer, useSourceFormData } from '../../helpers'
import type { PersistSources, SourceFormData } from '../../@types'
import { type DescribeSource, DISPLAY_TITLES, ENTITY_TYPES, getEntityIcon, safeJsonStringify, type WorkloadId } from '@odigos/ui-utils'
import { CenterThis, ConditionDetails, DATA_CARD_FIELD_TYPES, DataCard, type DataCardFieldsProps, FadeLoader, Segment } from '@odigos/ui-components'
import { Describe } from './describe'

interface SourceDrawerProps {
  persistSources: PersistSources
  updateSource: (sourceId: WorkloadId, payload: SourceFormData) => Promise<void>
  fetchDescribeSource: (req: { variables: WorkloadId }) => Promise<{ data?: { describeSource: DescribeSource } }>
}

enum TABS {
  OVERVIEW = 'Overview',
  PODS = 'Pods',
}

const FormContainer = styled.div`
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 220px);
  overflow: overlay;
  overflow-y: auto;
`

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SourceDrawer: FC<SourceDrawerProps> = ({ persistSources, updateSource, fetchDescribeSource }) => {
  const { sources } = useEntityStore()
  const { drawerType, drawerEntityId, setDrawerEntityId, setDrawerType } = useDrawerStore()

  const isOpen = drawerType !== ENTITY_TYPES.SOURCE
  const onClose = () => {
    setDrawerType(null)
    setDrawerEntityId(null)
  }

  const [isEditing, setIsEditing] = useState(false)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [selectedTab, setSelectedTab] = useState(TABS.OVERVIEW)

  const { formData, handleFormChange, resetFormData, loadFormWithDrawerItem } = useSourceFormData()

  const thisItem = useMemo(() => {
    if (isOpen) return null

    const found = sources?.find(
      (x) =>
        x.namespace === (drawerEntityId as WorkloadId).namespace &&
        x.name === (drawerEntityId as WorkloadId).name &&
        x.kind === (drawerEntityId as WorkloadId).kind
    )
    if (!!found) loadFormWithDrawerItem(found)

    return found
  }, [isOpen, drawerEntityId, sources])

  if (!thisItem) return null

  const containersData =
    thisItem.containers?.map(
      (container) =>
        ({
          type: DATA_CARD_FIELD_TYPES.SOURCE_CONTAINER,
          value: JSON.stringify(container),
        } as DataCardFieldsProps['data'][0])
    ) || []

  const handleEdit = (bool?: boolean) => {
    setIsEditing(typeof bool === 'boolean' ? bool : true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsFormDirty(false)
    handleFormChange('otelServiceName', thisItem.otelServiceName || thisItem.name || '')
  }

  const handleDelete = async () => {
    const { namespace } = thisItem
    persistSources({ [namespace]: [{ ...thisItem, selected: false }] }, {})
    setIsEditing(false)
    setIsFormDirty(false)
    resetFormData()
    // close drawer, all other cases are handled in OverviewDrawer
    onClose()
  }

  const handleSave = async () => {
    const title = formData.otelServiceName !== thisItem.name ? formData.otelServiceName : ''
    handleFormChange('otelServiceName', title)
    await updateSource(drawerEntityId as WorkloadId, { ...formData, otelServiceName: title })
    setIsEditing(false)
    setIsFormDirty(false)
  }

  return (
    <OverviewDrawer
      title={thisItem.otelServiceName || thisItem.name}
      titleTooltip='This attribute is used to identify the name of the service (service.name) that is generating telemetry data.'
      icon={getEntityIcon(ENTITY_TYPES.SOURCE)}
      isEdit={isEditing}
      isFormDirty={isFormDirty}
      onEdit={selectedTab === TABS.OVERVIEW ? handleEdit : undefined}
      onSave={handleSave}
      onDelete={selectedTab === TABS.OVERVIEW ? handleDelete : undefined}
      onCancel={handleCancel}
      isLastItem={sources.length === 1}
      tabs={[
        {
          label: TABS.OVERVIEW,
          onClick: () => setSelectedTab(TABS.OVERVIEW),
          selected: selectedTab === TABS.OVERVIEW,
        },
        {
          label: TABS.PODS,
          onClick: () => setSelectedTab(TABS.PODS),
          selected: selectedTab === TABS.PODS,
        },
      ]}
    >
      {selectedTab === TABS.OVERVIEW ? (
        isEditing ? (
          <FormContainer>
            <SourceForm
              formData={formData}
              handleFormChange={(...params) => {
                setIsFormDirty(true)
                handleFormChange(...params)
              }}
            />
          </FormContainer>
        ) : (
          <DataContainer>
            <ConditionDetails conditions={thisItem.conditions || []} />
            <DataCard title={DISPLAY_TITLES.SOURCE_DETAILS} data={!!thisItem ? buildCard(thisItem) : []} />
            <DataCard
              title={DISPLAY_TITLES.DETECTED_CONTAINERS}
              titleBadge={containersData.length}
              description={DISPLAY_TITLES.DETECTED_CONTAINERS_DESCRIPTION}
              data={containersData}
            />
          </DataContainer>
        )
      ) : (
        <Describe source={thisItem} fetchDescribeSource={fetchDescribeSource} />
      )}
    </OverviewDrawer>
  )
}

export { SourceDrawer, type SourceDrawerProps }
