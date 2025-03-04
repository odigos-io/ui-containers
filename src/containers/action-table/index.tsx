import React, { type CSSProperties, useMemo, type FC } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { buildSpecCell } from './build-spec-cell'
import { filterActions, TableCellConditions } from '../../helpers'
import { useDrawerStore, useEntityStore, useFilterStore } from '../../store'
import {
  DISPLAY_TITLES,
  ENTITY_TYPES,
  getActionIcon,
  getConditionsBooleans,
  getEntityIcon,
  getEntityLabel,
  NOTIFICATION_TYPE,
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

interface ActionTableProps {
  maxHeight?: CSSProperties['maxHeight']
  maxWidth?: CSSProperties['maxWidth']
}

const TableWrap = styled.div<{ $maxHeight: ActionTableProps['maxHeight'] }>`
  width: 100%;
  max-height: ${({ $maxHeight }) => $maxHeight || 'unset'};
  overflow-y: auto;
`

const columns = [
  { key: 'icon', title: '' },
  { key: 'name', title: DISPLAY_TITLES.NAME, sortable: true },
  { key: 'signals', title: DISPLAY_TITLES.MONITORS },
  { key: 'active-status', title: DISPLAY_TITLES.STATUS },
  { key: 'conditions', title: 'Conditions' },
  { key: 'type', title: DISPLAY_TITLES.TYPE, sortable: true },
  { key: 'spec', title: 'Spec', sortable: true },
  { key: 'notes', title: DISPLAY_TITLES.NOTES, sortable: true },
]

const ActionTable: FC<ActionTableProps> = ({ maxHeight, maxWidth }) => {
  const theme = Theme.useTheme()
  const filters = useFilterStore()
  const { actions } = useEntityStore()
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  const filtered = useMemo(() => filterActions(actions, filters), [actions, filters])

  const rows = useMemo(
    () =>
      filtered.map((act) => {
        const { hasErrors, hasWarnings, hasDisableds } = getConditionsBooleans(act.conditions || [])

        return {
          status: hasErrors ? NOTIFICATION_TYPE.ERROR : hasWarnings ? NOTIFICATION_TYPE.WARNING : undefined,
          faded: hasDisableds,
          cells: [
            {
              columnKey: 'icon',
              component: () => <IconWrapped icon={getActionIcon(act.type)} />,
            },
            {
              columnKey: 'name',
              value: getEntityLabel(act, ENTITY_TYPES.ACTION, { prioritizeDisplayName: true }),
            },
            {
              columnKey: 'type',
              value: act.type,
              textColor: theme.text.info,
            },
            {
              columnKey: 'notes',
              value: act.spec.notes,
              textColor: theme.text.info,
              withTooltip: true,
            },
            {
              columnKey: 'spec',
              value: buildSpecCell(act),
              textColor: theme.text.info,
              withTooltip: true,
            },
            {
              columnKey: 'signals',
              component: () => <MonitorsIcons withLabels monitors={act.spec.signals} />,
            },
            {
              columnKey: 'conditions',
              component: () => <TableCellConditions conditions={act.conditions || []} />,
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
          ] as RowCell[],
        }
      }),
    [filtered]
  )

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
          columns={columns}
          rows={rows}
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
