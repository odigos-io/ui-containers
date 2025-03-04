import React, { type CSSProperties, useMemo, type FC } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import type { Metrics } from '../../@types'
import { useDrawerStore, useFilterStore } from '../../store'
import { filterDestinations, TableCellConditions } from '../../helpers'
import {
  type Destination,
  DISPLAY_TITLES,
  ENTITY_TYPES,
  formatBytes,
  getEntityIcon,
  getEntityLabel,
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
  Status,
} from '@odigos/ui-components'

interface DestinationTableProps {
  destinations: Destination[]
  metrics: Metrics
  maxHeight?: CSSProperties['maxHeight']
  maxWidth?: CSSProperties['maxWidth']
}

const TableWrap = styled.div<{ $maxHeight: DestinationTableProps['maxHeight'] }>`
  width: 100%;
  max-height: ${({ $maxHeight }) => $maxHeight || 'unset'};
  overflow-y: auto;
`

const DestinationTable: FC<DestinationTableProps> = ({ destinations, metrics, maxHeight, maxWidth }) => {
  const theme = Theme.useTheme()
  const filters = useFilterStore()
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  const filtered = useMemo(() => filterDestinations(destinations, filters), [destinations, filters])

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
          columns={[
            { key: 'icon', title: '' },
            { key: 'name', title: DISPLAY_TITLES.NAME },
            { key: 'type', title: DISPLAY_TITLES.TYPE },
            { key: 'signals', title: DISPLAY_TITLES.MONITORS },
            { key: 'conditions', title: 'Conditions' },
            { key: 'throughput', title: 'Throughput' },
          ]}
          rows={filtered.map((dest) => {
            const errors = dest.conditions?.filter(({ status }) => status === NOTIFICATION_TYPE.ERROR) || []
            const warnings = dest.conditions?.filter(({ status }) => status === NOTIFICATION_TYPE.WARNING) || []
            const isLoading =
              !errors.length && !warnings.length && (!dest.conditions?.length || !!dest.conditions?.find(({ status }) => status === 'loading'))

            const metric = metrics?.destinations.find((m) => m.id === dest.id)

            return {
              status: !!errors.length ? NOTIFICATION_TYPE.ERROR : !!warnings.length ? NOTIFICATION_TYPE.WARNING : undefined,
              cells: [
                {
                  columnKey: 'icon',
                  component: () => <IconWrapped src={dest.destinationType.imageUrl} />,
                },
                { columnKey: 'name', value: getEntityLabel(dest, ENTITY_TYPES.DESTINATION, { prioritizeDisplayName: true }) },
                { columnKey: 'type', value: dest.destinationType.type, textColor: theme.text.info },
                { columnKey: 'throughput', value: formatBytes(metric?.throughput), textColor: theme.text.info },
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
                {
                  columnKey: 'conditions',
                  component: () => (
                    <div style={{ lineHeight: 1 }}>
                      {!!errors.length ? (
                        <TableCellConditions conditions={errors} />
                      ) : !!warnings.length ? (
                        <TableCellConditions conditions={warnings} />
                      ) : isLoading ? (
                        <Status status='loading' title='loading' withBorder withIcon />
                      ) : (
                        <Status status={NOTIFICATION_TYPE.SUCCESS} title='success' withBorder withIcon />
                      )}
                    </div>
                  ),
                },
              ] as RowCell[],
            }
          })}
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
