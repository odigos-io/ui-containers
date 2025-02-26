import React, { type CSSProperties, useMemo, type FC } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { filterDestinations } from '../../helpers'
import { ErrorTriangleIcon } from '@odigos/ui-icons'
import { useDrawerStore, useFilterStore } from '../../store'
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
  Tooltip,
} from '@odigos/ui-components'
import {
  CONDITION_STATUS,
  type Destination,
  DISPLAY_TITLES,
  ENTITY_TYPES,
  getEntityIcon,
  getEntityLabel,
  NOTIFICATION_TYPE,
  SIGNAL_TYPE,
  splitCamelString,
} from '@odigos/ui-utils'

interface DestinationTableProps {
  destinations: Destination[]
  maxHeight?: CSSProperties['maxHeight']
  maxWidth?: CSSProperties['maxWidth']
}

const TableWrap = styled.div<{ $maxHeight: DestinationTableProps['maxHeight'] }>`
  width: 100%;
  max-height: ${({ $maxHeight }) => $maxHeight || 'unset'};
  overflow-y: auto;
`

const DestinationTable: FC<DestinationTableProps> = ({ destinations, maxHeight, maxWidth }) => {
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
          ]}
          rows={filtered.map((dest) => {
            const errors = dest.conditions?.filter(({ status }) => status === CONDITION_STATUS.FALSE || status === NOTIFICATION_TYPE.ERROR) || []

            return {
              status: errors.length ? NOTIFICATION_TYPE.ERROR : undefined,
              cells: [
                {
                  columnKey: 'icon',
                  component: () => <IconWrapped src={dest.destinationType.imageUrl} />,
                },
                { columnKey: 'name', value: getEntityLabel(dest, ENTITY_TYPES.DESTINATION, { prioritizeDisplayName: true }) },
                { columnKey: 'type', value: dest.destinationType.type, textColor: theme.text.info },
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
                        <FlexRow>
                          {errors.map(({ type, reason, message, lastTransitionTime }) => (
                            <Tooltip
                              key={`${dest.id}-${type}-${lastTransitionTime}`}
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
