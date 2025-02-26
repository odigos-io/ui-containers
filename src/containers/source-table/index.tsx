import React, { type CSSProperties, useMemo, type FC } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import type { Metrics } from '../../@types'
import { filterSources } from '../../helpers'
import { ErrorTriangleIcon } from '@odigos/ui-icons'
import { useDrawerStore, useFilterStore, useInstrumentStore, usePendingStore, useSelectedStore } from '../../store'
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
  Tooltip,
  TraceLoader,
} from '@odigos/ui-components'
import {
  CONDITION_STATUS,
  DISPLAY_TITLES,
  ENTITY_TYPES,
  formatBytes,
  getEntityIcon,
  getEntityLabel,
  getProgrammingLanguageIcon,
  NOTIFICATION_TYPE,
  splitCamelString,
  type Source,
} from '@odigos/ui-utils'

interface SourceTableProps {
  sources: Source[]
  metrics: Metrics
  maxHeight?: CSSProperties['maxHeight']
  maxWidth?: CSSProperties['maxWidth']
}

const TableWrap = styled.div<{ $maxHeight: SourceTableProps['maxHeight'] }>`
  width: 100%;
  max-height: ${({ $maxHeight }) => $maxHeight || 'unset'};
  overflow-y: auto;
`

const SourceTable: FC<SourceTableProps> = ({ sources, metrics, maxHeight, maxWidth }) => {
  const theme = Theme.useTheme()
  const filters = useFilterStore()
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

  const onSelectAll = (bool: boolean) => {
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
  }

  const onSelectOne = (source: Source) => {
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
  }

  const filtered = useMemo(() => filterSources(sources, filters), [sources, filters])

  const { isAwaitingInstrumentation, sourcesToCreate, sourcesCreated, sourcesToDelete, sourcesDeleted } = useInstrumentStore()
  const instrumentingPercent =
    (!!sourcesToCreate
      ? Math.floor((100 / sourcesToCreate) * sourcesCreated)
      : !!sourcesToDelete
      ? Math.floor((100 / sourcesToDelete) * sourcesDeleted)
      : 0) || 1

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
          columns={[
            { key: 'checkbox-and-icon', title: '' },
            { key: 'name', title: DISPLAY_TITLES.NAME },
            { key: 'type', title: 'Kubernetes Type' },
            { key: 'namespace', title: DISPLAY_TITLES.NAMESPACE },
            { key: 'containers', title: DISPLAY_TITLES.DETECTED_CONTAINERS },
            { key: 'conditions', title: 'Conditions' },
            { key: 'throughput', title: 'Throughput' },
            { key: 'totalDataSent', title: 'Total Data Sent' },
          ]}
          rows={
            isAwaitingInstrumentation
              ? []
              : filtered.map((source) => {
                  const isPending = isThisPending({
                    entityType: ENTITY_TYPES.SOURCE,
                    entityId: { namespace: source.namespace, name: source.name, kind: source.kind },
                  })

                  const isChecked = !!selectedSources[source.namespace]?.find(
                    (x) => x.namespace === source.namespace && x.name === source.name && x.kind === source.kind
                  )

                  const iconSrcs = source.containers?.map(({ language }) => getProgrammingLanguageIcon(language)) || []
                  const instrumentedCount = source.containers?.reduce((prev, curr) => (curr.instrumented ? prev + 1 : prev), 0)
                  const containerCount = source.containers?.length || 0

                  const errors =
                    source.conditions?.filter(({ status }) => status === CONDITION_STATUS.FALSE || status === NOTIFICATION_TYPE.ERROR) || []
                  const metric = metrics?.sources.find((m) => m.kind === source.kind && m.name === source.name && m.namespace === source.namespace)

                  return {
                    status: errors.length ? NOTIFICATION_TYPE.ERROR : undefined,
                    cells: [
                      {
                        columnKey: 'checkbox-and-icon',
                        component: () => (
                          <FlexRow $gap={16}>
                            <Checkbox disabled={isPending} value={isChecked} onChange={() => onSelectOne(source)} />
                            <IconGroup iconSrcs={iconSrcs} />
                          </FlexRow>
                        ),
                      },
                      { columnKey: 'name', value: getEntityLabel(source, ENTITY_TYPES.SOURCE, { extended: true }) },
                      { columnKey: 'type', value: source.kind, textColor: theme.text.info },
                      { columnKey: 'namespace', value: source.namespace, textColor: theme.text.info },
                      { columnKey: 'throughput', value: formatBytes(metric?.throughput), textColor: theme.text.info },
                      { columnKey: 'totalDataSent', value: metric?.totalDataSent, textColor: theme.text.info },
                      {
                        columnKey: 'containers',
                        component: () => (
                          <div style={{ lineHeight: 1 }}>
                            <Status status={NOTIFICATION_TYPE.INFO} title={`${instrumentedCount}/${containerCount} instrumented`} withBorder />
                          </div>
                        ),
                      },
                      {
                        columnKey: 'conditions',
                        component: () => (
                          <div style={{ lineHeight: 1 }}>
                            {!!errors.length ? (
                              <FlexRow>
                                {errors.map(({ type, reason, message, lastTransitionTime }) => (
                                  <Tooltip
                                    key={`${source.namespace}-${source.name}-${source.kind}-${type}-${lastTransitionTime}`}
                                    titleIcon={ErrorTriangleIcon}
                                    title={splitCamelString(type)}
                                    text={message || splitCamelString(reason)}
                                    timestamp={lastTransitionTime}
                                  >
                                    <Status status={NOTIFICATION_TYPE.ERROR} title={splitCamelString(type)} withBorder withIcon />
                                  </Tooltip>
                                ))}
                              </FlexRow>
                            ) : (
                              <Status status={NOTIFICATION_TYPE.SUCCESS} title='success' withBorder withIcon />
                            )}
                          </div>
                        ),
                      },
                    ] as RowCell[],
                  }
                })
          }
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
