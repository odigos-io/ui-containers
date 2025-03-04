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

interface SourceDrawerProps {
  persistSources: PersistSources
  updateSource: (sourceId: WorkloadId, payload: SourceFormData) => Promise<void>
  fetchDescribeSource: (req: { variables: WorkloadId }) => Promise<{ data?: { describeSource: DescribeSource } }>
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

  const [describe, setDescribe] = useState<DescribeSource | null>(null)
  const [isPrettyMode, setIsPrettyMode] = useState(true)

  useEffect(() => {
    if (!thisItem) return

    const doFetch = () => {
      fetchDescribeSource({ variables: { namespace: thisItem.namespace, name: thisItem.name, kind: thisItem.kind } }).then(({ data }) => {
        setDescribe(data?.describeSource || null)
      })
    }

    doFetch()

    // const interval = setInterval(doFetch, 5000)
    // return () => clearInterval(interval)
  }, [fetchDescribeSource, thisItem])

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

  // This function is used to restructure the data, so that it reflects the output given by "odigos describe" command in the CLI.
  // This is not really needed, but it's a nice-to-have feature to make the data more readable.
  const restructureForPrettyMode = () => {
    if (!describe) return {}

    const payload: Record<string, any> = {}

    const mapObjects = (obj: any, category?: string, options?: { keyPrefix?: string }) => {
      if (typeof obj === 'object' && !!obj?.name) {
        let key = options?.keyPrefix ? `${options?.keyPrefix}${obj.name}` : obj.name
        let val = obj.value

        if (obj.explain) key += `@tooltip=${obj.explain}`
        if (obj.status) val += `@status=${obj.status}`
        else val += '@status=none'

        if (!!category && !payload[category]) payload[category] = {}
        if (!!category) payload[category][key] = val
        else payload[key] = val
      }
    }

    Object.values(describe).forEach((val) => mapObjects(val))
    Object.values(describe?.sourceObjects || {}).forEach((val) => mapObjects(val, 'Sources'))
    Object.values(describe?.otelAgents || {}).forEach((val) => mapObjects(val, 'Instrumentation Config'))
    describe.otelAgents?.containers?.forEach((obj, i) =>
      Object.values(obj).forEach((val) => mapObjects(val, 'Instrumentation Config', { keyPrefix: `Container #${i + 1} - ` }))
    )
    describe.runtimeInfo?.containers?.forEach((obj, i) =>
      Object.values(obj).forEach((val) => mapObjects(val, 'Runtime Info', { keyPrefix: `Container #${i + 1} - ` }))
    )

    payload['Pods'] = { 'Total Pods': `${describe.totalPods}@status=none` }
    describe.pods.forEach((obj) => {
      Object.values(obj).forEach((val) => mapObjects(val, 'Pods'))
      obj.containers?.forEach((containers, i) => {
        Object.values(containers).forEach((val) => mapObjects(val, 'Pods', { keyPrefix: `Container #${i + 1} - ` }))
        containers?.instrumentationInstances.forEach((obj, i) =>
          Object.values(obj).forEach((val) => mapObjects(val, 'Pods', { keyPrefix: `Instrumentation Instance #${i + 1} - ` }))
        )
      })
    })

    return payload
  }

  return (
    <OverviewDrawer
      title={thisItem.otelServiceName || thisItem.name}
      titleTooltip='This attribute is used to identify the name of the service (service.name) that is generating telemetry data.'
      icon={getEntityIcon(ENTITY_TYPES.SOURCE)}
      isEdit={isEditing}
      isFormDirty={isFormDirty}
      onEdit={handleEdit}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancel={handleCancel}
      isLastItem={sources.length === 1}
    >
      {isEditing ? (
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
          {!!describe ? (
            <DataCard
              title={DISPLAY_TITLES.DESCRIBE_SOURCE}
              action={
                <Segment
                  options={[
                    { icon: ListIcon, value: true },
                    { icon: CodeIcon, value: false },
                  ]}
                  selected={isPrettyMode}
                  setSelected={setIsPrettyMode}
                />
              }
              data={[
                {
                  type: DATA_CARD_FIELD_TYPES.CODE,
                  value: JSON.stringify({
                    language: 'json',
                    code: safeJsonStringify(isPrettyMode ? restructureForPrettyMode() : describe),
                    pretty: isPrettyMode,
                  }),
                },
              ]}
            />
          ) : (
            <CenterThis>
              <FadeLoader scale={2} />
            </CenterThis>
          )}
        </DataContainer>
      )}
    </OverviewDrawer>
  )
}

export { SourceDrawer, type SourceDrawerProps }
