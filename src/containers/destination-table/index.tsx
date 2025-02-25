import React, { useMemo, type FC } from 'react'
import { ErrorTriangleIcon } from '@odigos/ui-icons'
import { useDrawerStore, useFilterStore } from '../../store'
import {
  CenterThis,
  FlexRow,
  IconTitleBadge,
  IconWrapped,
  InteractiveTable,
  InteractiveTableProps,
  MonitorsIcons,
  NoDataFound,
  Status,
  Tooltip,
} from '@odigos/ui-components'
import {
  CONDITION_STATUS,
  type Destination,
  type DestinationOption,
  ENTITY_TYPES,
  getEntityIcon,
  getEntityLabel,
  NOTIFICATION_TYPE,
  SIGNAL_TYPE,
  splitCamelString,
} from '@odigos/ui-utils'

interface DestinationTableProps {
  destinations: Destination[]
}

const DestinationTable: FC<DestinationTableProps> = ({ destinations }) => {
  const filters = useFilterStore()
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  const filtered = useMemo(() => {
    let arr = [...destinations]

    if (!!filters.monitors?.length)
      arr = arr.filter((dest) => !!filters.monitors?.find((metr) => dest.exportedSignals[metr.id as keyof DestinationOption['supportedSignals']]))

    return arr
  }, [destinations, filters.monitors])

  return (
    <>
      <FlexRow $gap={16} style={{ padding: '16px' }}>
        <IconTitleBadge
          icon={getEntityIcon(ENTITY_TYPES.DESTINATION)}
          title='Destinations'
          badge={filtered.length !== destinations.length ? `${filtered.length}/${destinations.length}` : destinations.length}
        />
      </FlexRow>

      <InteractiveTable
        columns={[
          { key: 'icon', title: '' },
          { key: 'name', title: 'Name' },
          { key: 'type', title: 'Type' },
          { key: 'signals', title: 'Monitoring' },
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
              { columnKey: 'type', value: dest.destinationType.type },
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
            ] as InteractiveTableProps['rows'][0]['cells'],
          }
        })}
        onRowClick={(idx) => {
          setDrawerType(ENTITY_TYPES.DESTINATION)
          setDrawerEntityId(filtered[idx].id)
        }}
      />

      {!filtered.length && (
        <CenterThis style={{ marginTop: '2rem' }}>
          <NoDataFound />
        </CenterThis>
      )}
    </>
  )
}

export { DestinationTable, type DestinationTableProps }
