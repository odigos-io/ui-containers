import React, { type CSSProperties, useMemo, type FC } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { filterActions } from '../../helpers'
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
  type Action,
  CONDITION_STATUS,
  DISPLAY_TITLES,
  ENTITY_TYPES,
  getActionIcon,
  getEntityIcon,
  getEntityLabel,
  NOTIFICATION_TYPE,
  splitCamelString,
} from '@odigos/ui-utils'
import { buildSpecCell } from './build-spec-cell'

interface ActionTableProps {
  actions: Action[]
  maxHeight?: CSSProperties['maxHeight']
  maxWidth?: CSSProperties['maxWidth']
}

const TableWrap = styled.div<{ $maxHeight: ActionTableProps['maxHeight'] }>`
  width: 100%;
  max-height: ${({ $maxHeight }) => $maxHeight || 'unset'};
  overflow-y: auto;
`

const ActionTable: FC<ActionTableProps> = ({ actions, maxHeight, maxWidth }) => {
  const theme = Theme.useTheme()
  const filters = useFilterStore()
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  const filtered = useMemo(() => filterActions(actions, filters), [actions, filters])

  return (
    <FlexColumn style={{ maxWidth: maxWidth || 'unset', width: '100%' }}>
      <FlexRow $gap={16} style={{ padding: '16px' }}>
        <IconTitleBadge
          icon={getEntityIcon(ENTITY_TYPES.ACTION)}
          title='Actions'
          badge={filtered.length !== actions.length ? `${filtered.length}/${actions.length}` : actions.length}
        />
      </FlexRow>

      <TableWrap $maxHeight={maxHeight}>
        <InteractiveTable
          columns={[
            { key: 'icon', title: '' },
            { key: 'name', title: DISPLAY_TITLES.NAME },
            { key: 'signals', title: DISPLAY_TITLES.MONITORS },
            { key: 'active-status', title: DISPLAY_TITLES.STATUS },
            { key: 'conditions', title: 'Conditions' },
            { key: 'type', title: DISPLAY_TITLES.TYPE },
            { key: 'spec', title: 'Spec' },
            { key: 'notes', title: DISPLAY_TITLES.NOTES },
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
                { columnKey: 'type', value: act.type, textColor: theme.text.info },
                { columnKey: 'notes', value: act.spec.notes, textColor: theme.text.info, withTooltip: true },
                { columnKey: 'spec', value: buildSpecCell(act), textColor: theme.text.info, withTooltip: true },
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
              ] as RowCell[],
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
