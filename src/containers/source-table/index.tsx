import React, { type CSSProperties, useMemo, type FC, useCallback } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { filterSources, TableCellConditions } from '../../helpers'
import { useDrawerStore, useEntityStore, useFilterStore, useInstrumentStore, usePendingStore, useSelectedStore } from '../../store'
import {
  DISPLAY_TITLES,
  ENTITY_TYPES,
  formatBytes,
  getConditionsBooleans,
  getContainersIcons,
  getContainersInstrumentedCount,
  getEntityIcon,
  getEntityLabel,
  getMetricForEntity,
  type Metrics,
  NOTIFICATION_TYPE,
  type Source,
} from '@odigos/ui-utils'
import {
  Badge,
  CenterThis,
  Checkbox,
  FlexColumn,
  FlexRow,
  IconGroup,
  IconTitleBadge,
  InteractiveTable,
  NoDataFound,
  type RowCell,
  Status,
  Text,
  TraceLoader,
} from '@odigos/ui-components'

interface SourceTableProps {
  metrics: Metrics
  maxHeight?: CSSProperties['maxHeight']
  maxWidth?: CSSProperties['maxWidth']
}

const TableWrap = styled.div<{ $maxHeight: SourceTableProps['maxHeight'] }>`
  width: 100%;
  max-height: ${({ $maxHeight }) => $maxHeight || 'unset'};
  overflow-y: auto;
`

const columns = [
  { key: 'checkbox-and-icon', title: '' },
  { key: 'name', title: DISPLAY_TITLES.NAME, sortable: true },
  { key: 'type', title: 'Kubernetes Type', sortable: true },
  { key: 'namespace', title: DISPLAY_TITLES.NAMESPACE, sortable: true },
  { key: 'containers', title: DISPLAY_TITLES.DETECTED_CONTAINERS },
  { key: 'conditions', title: 'Conditions' },
  { key: 'throughput', title: 'Throughput', sortable: true },
]

const SourceTable: FC<SourceTableProps> = ({ metrics, maxHeight, maxWidth }) => {
  const theme = Theme.useTheme()
  const filters = useFilterStore()
  const { sources } = useEntityStore()
  const { isThisPending } = usePendingStore()
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()
  const { selectedSources, setSelectedSources } = useSelectedStore()

  const [hasSelected, totalSelectedSources] = useMemo(() => {
    let num = 0

    Object.values(selectedSources).forEach((selectedSources) => {
      num += selectedSources.length
    })

    return [num !== 0, num]
  }, [selectedSources])

  const onSelectAll = useCallback(
    (bool: boolean) => {
      if (bool) {
        const payload: Record<string, Source[]> = {}

        sources?.forEach((source) => {
          const id = { namespace: source.namespace, name: source.name, kind: source.kind }
          const isPending = isThisPending({ entityType: ENTITY_TYPES.SOURCE, entityId: id })

          if (!isPending) {
            if (!payload[source.namespace]) {
              payload[source.namespace] = [source]
            } else {
              payload[source.namespace].push(source)
            }
          }
        })

        setSelectedSources(payload)
      } else {
        setSelectedSources({})
      }
    },
    [sources]
  )

  const onSelectOne = useCallback(
    (source: Source) => {
      const { namespace, name, kind } = source

      const payload = { ...selectedSources }
      if (!payload[namespace]) payload[namespace] = []

      const foundIndex = payload[namespace].findIndex((x) => x.name === name && x.kind === kind)
      if (foundIndex === -1) {
        payload[namespace].push(source)
      } else {
        payload[namespace].splice(foundIndex, 1)
      }

      setSelectedSources(payload)
    },
    [selectedSources]
  )

  const { isAwaitingInstrumentation, sourcesToCreate, sourcesCreated, sourcesToDelete, sourcesDeleted } = useInstrumentStore()
  const instrumentingPercent =
    (!!sourcesToCreate
      ? Math.floor((100 / sourcesToCreate) * sourcesCreated)
      : !!sourcesToDelete
      ? Math.floor((100 / sourcesToDelete) * sourcesDeleted)
      : 0) || 1

  const filtered = useMemo(() => filterSources(sources, filters), [sources, filters])

  const rows = useMemo(
    () =>
      filtered.map((source) => {
        const id = { namespace: source.namespace, name: source.name, kind: source.kind }
        const { hasErrors, hasWarnings, hasDisableds } = getConditionsBooleans(source.conditions || [])

        const isPending = isThisPending({ entityType: ENTITY_TYPES.SOURCE, entityId: id })
        const isChecked = !!selectedSources[id.namespace]?.find((x) => x.namespace === id.namespace && x.name === id.name && x.kind === id.kind)

        return {
          status: hasErrors ? NOTIFICATION_TYPE.ERROR : hasWarnings ? NOTIFICATION_TYPE.WARNING : undefined,
          faded: hasDisableds,
          cells: [
            {
              columnKey: 'checkbox-and-icon',
              component: () => (
                <FlexRow $gap={16}>
                  <Checkbox disabled={isPending} value={isChecked} onChange={() => onSelectOne(source)} />
                  <IconGroup iconSrcs={getContainersIcons(source.containers)} />
                </FlexRow>
              ),
            },
            {
              columnKey: 'name',
              value: getEntityLabel(source, ENTITY_TYPES.SOURCE, { extended: true }),
            },
            {
              columnKey: 'type',
              value: source.kind,
              textColor: theme.text.info,
            },
            {
              columnKey: 'namespace',
              value: source.namespace,
              textColor: theme.text.info,
            },
            {
              columnKey: 'throughput',
              value: formatBytes(getMetricForEntity(metrics, ENTITY_TYPES.SOURCE, id).throughput),
              textColor: theme.text.info,
            },
            {
              columnKey: 'conditions',
              component: () => <TableCellConditions conditions={source.conditions || []} />,
            },
            {
              columnKey: 'containers',
              component: () => (
                <div style={{ lineHeight: 1 }}>
                  <Status status={NOTIFICATION_TYPE.INFO} title={getContainersInstrumentedCount(source.containers)} withBorder />
                </div>
              ),
            },
          ] as RowCell[],
        }
      }),
    [filtered, selectedSources, metrics, onSelectOne]
  )

  return (
    <FlexColumn style={{ maxWidth: maxWidth || 'unset', width: '100%' }}>
      <FlexRow $gap={16} style={{ padding: '16px' }}>
        <Checkbox
          partiallyChecked={hasSelected && sources?.length !== totalSelectedSources}
          value={hasSelected && sources?.length === totalSelectedSources}
          onChange={onSelectAll}
          disabled={!sources?.length}
        />
        <IconTitleBadge
          icon={getEntityIcon(ENTITY_TYPES.SOURCE)}
          title='Sources'
          badge={filtered.length !== sources.length ? `${filtered.length}/${sources.length}` : sources.length}
        />
      </FlexRow>

      <TableWrap $maxHeight={maxHeight}>
        <InteractiveTable
          columns={columns}
          rows={isAwaitingInstrumentation ? [] : rows}
          onRowClick={(idx) => {
            setDrawerType(ENTITY_TYPES.SOURCE)
            setDrawerEntityId({ namespace: filtered[idx].namespace, name: filtered[idx].name, kind: filtered[idx].kind })
          }}
        />
      </TableWrap>

      {isAwaitingInstrumentation ? (
        <CenterThis style={{ marginTop: '2rem', gap: '24px' }}>
          <TraceLoader width={420} />
          <FlexRow $gap={16}>
            <Text color={theme.text.info}>{!!sourcesToCreate ? 'Instrumenting' : 'Uninstrumenting'} workloads...</Text>
            <Badge label={`${instrumentingPercent}%`} />
          </FlexRow>
        </CenterThis>
      ) : !filtered.length ? (
        <CenterThis style={{ marginTop: '2rem' }}>
          <NoDataFound />
        </CenterThis>
      ) : null}
    </FlexColumn>
  )
}

export { SourceTable, type SourceTableProps }
