import React, { type CSSProperties, useMemo, type FC } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { filterDestinations, TableCellConditions } from '../../helpers'
import { useDrawerStore, useEntityStore, useFilterStore } from '../../store'
import {
  DISPLAY_TITLES,
  ENTITY_TYPES,
  formatBytes,
  getConditionsBooleans,
  getEntityIcon,
  getEntityLabel,
  getMetricForEntity,
  type Metrics,
  NOTIFICATION_TYPE,
  SIGNAL_TYPE,
} from '@odigos/ui-utils'
import {
  CenterThis,
  FlexColumn,
  FlexRow,
  IconTitleBadge,
  IconWrapped,
  InteractiveTable,
  MonitorsIcons,
  NoDataFound,
  type RowCell,
} from '@odigos/ui-components'

interface DestinationTableProps {
  metrics: Metrics
  maxHeight?: CSSProperties['maxHeight']
  maxWidth?: CSSProperties['maxWidth']
}

const TableWrap = styled.div<{ $maxHeight: DestinationTableProps['maxHeight'] }>`
  width: 100%;
  max-height: ${({ $maxHeight }) => $maxHeight || 'unset'};
  overflow-y: auto;
`

const columns = [
  { key: 'icon', title: '' },
  { key: 'name', title: DISPLAY_TITLES.NAME, sortable: true },
  { key: 'type', title: DISPLAY_TITLES.TYPE, sortable: true },
  { key: 'signals', title: DISPLAY_TITLES.MONITORS },
  { key: 'conditions', title: 'Conditions' },
  { key: 'throughput', title: 'Throughput', sortable: true },
]

const DestinationTable: FC<DestinationTableProps> = ({ metrics, maxHeight, maxWidth }) => {
  const theme = Theme.useTheme()
  const filters = useFilterStore()
  const { destinations } = useEntityStore()
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  const filtered = useMemo(() => filterDestinations(destinations, filters), [destinations, filters])

  const rows = useMemo(
    () =>
      filtered.map((dest) => {
        const { hasErrors, hasWarnings, hasDisableds } = getConditionsBooleans(dest.conditions || [])

        return {
          status: hasErrors ? NOTIFICATION_TYPE.ERROR : hasWarnings ? NOTIFICATION_TYPE.WARNING : undefined,
          faded: hasDisableds,
          cells: [
            {
              columnKey: 'icon',
              component: () => <IconWrapped src={dest.destinationType.imageUrl} />,
            },
            {
              columnKey: 'name',
              value: getEntityLabel(dest, ENTITY_TYPES.DESTINATION, { prioritizeDisplayName: true }),
            },
            {
              columnKey: 'type',
              value: dest.destinationType.type,
              textColor: theme.text.info,
            },
            {
              columnKey: 'throughput',
              value: formatBytes(getMetricForEntity(metrics, ENTITY_TYPES.DESTINATION, dest.id).throughput),
              textColor: theme.text.info,
            },
            {
              columnKey: 'conditions',
              component: () => <TableCellConditions conditions={dest.conditions || []} />,
            },
            {
              columnKey: 'signals',
              component: () => (
                <MonitorsIcons
                  withLabels
                  monitors={
                    Object.keys(dest.exportedSignals).filter((signal) => dest.exportedSignals[signal as SIGNAL_TYPE] === true) as SIGNAL_TYPE[]
                  }
                />
              ),
            },
          ] as RowCell[],
        }
      }),
    [filtered, metrics]
  )

  return (
    <FlexColumn style={{ maxWidth: maxWidth || 'unset', width: '100%' }}>
      <FlexRow $gap={16} style={{ padding: '16px' }}>
        <IconTitleBadge
          icon={getEntityIcon(ENTITY_TYPES.DESTINATION)}
          title='Destinations'
          badge={filtered.length !== destinations.length ? `${filtered.length}/${destinations.length}` : destinations.length}
        />
      </FlexRow>

      <TableWrap $maxHeight={maxHeight}>
        <InteractiveTable
          columns={columns}
          rows={rows}
          onRowClick={(idx) => {
            setDrawerType(ENTITY_TYPES.DESTINATION)
            setDrawerEntityId(filtered[idx].id)
          }}
        />
      </TableWrap>

      {!filtered.length && (
        <CenterThis style={{ marginTop: '2rem' }}>
          <NoDataFound />
        </CenterThis>
      )}
    </FlexColumn>
  )
}

export { DestinationTable, type DestinationTableProps }
