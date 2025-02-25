import React, { type CSSProperties, useMemo, type FC } from 'react'
import styled from 'styled-components'
import { ErrorTriangleIcon } from '@odigos/ui-icons'
import { useDrawerStore, useFilterStore } from '../../store'
import {
  CenterThis,
  FlexColumn,
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
  type Action,
  CONDITION_STATUS,
  ENTITY_TYPES,
  getActionIcon,
  getEntityIcon,
  getEntityLabel,
  NOTIFICATION_TYPE,
  splitCamelString,
} from '@odigos/ui-utils'

interface ActionTableProps {
  actions: Action[]
  tableMaxHeight?: CSSProperties['maxHeight']
}

const TableWrap = styled.div<{ $maxHeight: ActionTableProps['tableMaxHeight'] }>`
  width: 100%;
  max-height: ${({ $maxHeight }) => $maxHeight || 'unset'};
  overflow-y: auto;
`

const ActionTable: FC<ActionTableProps> = ({ actions, tableMaxHeight }) => {
  const filters = useFilterStore()
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  const filtered = useMemo(() => {
    let arr = [...actions]

    if (!!filters.monitors?.length)
      arr = arr.filter((action) => !!filters.monitors?.find((metric) => action.spec.signals.find((str) => str.toLowerCase() === metric.id)))

    return arr
  }, [actions, filters.monitors])

  return (
    <FlexColumn>
      <FlexRow $gap={16} style={{ padding: '16px' }}>
        <IconTitleBadge
          icon={getEntityIcon(ENTITY_TYPES.ACTION)}
          title='Actions'
          badge={filtered.length !== actions.length ? `${filtered.length}/${actions.length}` : actions.length}
        />
      </FlexRow>

      <TableWrap $maxHeight={tableMaxHeight}>
        <InteractiveTable
          columns={[
            { key: 'icon', title: '' },
            { key: 'name', title: 'Name' },
            { key: 'type', title: 'Type' },
            { key: 'signals', title: 'Monitoring' },
            { key: 'active-status', title: 'Status' },
            { key: 'conditions', title: 'Conditions' },
            { key: 'notes', title: 'Notes' },
          ]}
          rows={filtered.map((act) => {
            const errors = act.conditions?.filter(({ status }) => status === CONDITION_STATUS.FALSE || status === NOTIFICATION_TYPE.ERROR) || []

            return {
              status: errors.length ? NOTIFICATION_TYPE.ERROR : undefined,
              cells: [
                {
                  columnKey: 'icon',
                  component: () => <IconWrapped icon={getActionIcon(act.type)} />,
                },
                { columnKey: 'name', value: getEntityLabel(act, ENTITY_TYPES.ACTION, { prioritizeDisplayName: true }) },
                { columnKey: 'type', value: act.type },
                { columnKey: 'notes', value: act.spec.notes },
                {
                  columnKey: 'signals',
                  component: () => <MonitorsIcons withLabels monitors={act.spec.signals} />,
                },
                {
                  columnKey: 'active-status',
                  component: () => (
                    <div style={{ lineHeight: 1 }}>
                      <Status
                        status={act.spec.disabled ? NOTIFICATION_TYPE.ERROR : NOTIFICATION_TYPE.SUCCESS}
                        title={act.spec.disabled ? 'Inactive' : 'Active'}
                        withIcon
                        withBorder
                      />
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
                              key={`${act.id}-${type}-${lastTransitionTime}`}
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
            setDrawerType(ENTITY_TYPES.ACTION)
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

export { ActionTable, type ActionTableProps }
