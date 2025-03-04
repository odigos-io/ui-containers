import React, { useMemo, type CSSProperties, type FC } from 'react'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { useDrawerStore } from '../../store'
import { buildSpecCell } from './build-spec-cell'
import {
  DISPLAY_TITLES,
  ENTITY_TYPES,
  getEntityIcon,
  getEntityLabel,
  getInstrumentationRuleIcon,
  type InstrumentationRule,
  NOTIFICATION_TYPE,
} from '@odigos/ui-utils'
import {
  CenterThis,
  FlexColumn,
  FlexRow,
  IconTitleBadge,
  IconWrapped,
  InteractiveTable,
  NoDataFound,
  type RowCell,
  Status,
} from '@odigos/ui-components'

interface InstrumentationRuleTableProps {
  instrumentationRules: InstrumentationRule[]
  maxHeight?: CSSProperties['maxHeight']
  maxWidth?: CSSProperties['maxWidth']
}

const TableWrap = styled.div<{ $maxHeight: InstrumentationRuleTableProps['maxHeight'] }>`
  width: 100%;
  max-height: ${({ $maxHeight }) => $maxHeight || 'unset'};
  overflow-y: auto;
`

const columns = [
  { key: 'icon', title: '' },
  { key: 'name', title: DISPLAY_TITLES.NAME, sortable: true },
  { key: 'profile', title: DISPLAY_TITLES.MANAGED_BY_PROFILE, sortable: true },
  { key: 'active-status', title: DISPLAY_TITLES.STATUS },
  { key: 'source-count', title: 'Applicable Source' },
  { key: 'type', title: DISPLAY_TITLES.TYPE, sortable: true },
  { key: 'spec', title: 'Spec', sortable: true },
  { key: 'notes', title: DISPLAY_TITLES.NOTES, sortable: true },
]

const InstrumentationRuleTable: FC<InstrumentationRuleTableProps> = ({ instrumentationRules, maxHeight, maxWidth }) => {
  const theme = Theme.useTheme()
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  const rows = useMemo(
    () =>
      // note: rules do not have filters yet
      instrumentationRules.map((rule) => {
        return {
          cells: [
            {
              columnKey: 'icon',
              component: () => <IconWrapped icon={getInstrumentationRuleIcon(rule.type)} />,
            },
            {
              columnKey: 'name',
              value: getEntityLabel(rule, ENTITY_TYPES.INSTRUMENTATION_RULE, { prioritizeDisplayName: true }),
            },
            {
              columnKey: 'type',
              value: rule.type,
              textColor: theme.text.info,
            },
            {
              columnKey: 'profile',
              value: rule.profileName,
              textColor: theme.text.info,
            },
            {
              columnKey: 'notes',
              value: rule.notes,
              textColor: theme.text.info,
              withTooltip: true,
            },
            {
              columnKey: 'spec',
              value: buildSpecCell(rule),
              textColor: theme.text.info,
              withTooltip: true,
            },
            {
              columnKey: 'active-status',
              component: () => (
                <div style={{ lineHeight: 1 }}>
                  <Status
                    status={rule.disabled ? NOTIFICATION_TYPE.ERROR : NOTIFICATION_TYPE.SUCCESS}
                    title={rule.disabled ? 'Inactive' : 'Active'}
                    withIcon
                    withBorder
                  />
                </div>
              ),
            },
            {
              columnKey: 'source-count',
              component: () => (
                <div style={{ lineHeight: 1 }}>
                  <Status status={NOTIFICATION_TYPE.INFO} title='all sources' withBorder />
                </div>
              ),
            },
          ] as RowCell[],
        }
      }),
    [instrumentationRules]
  )

  return (
    <FlexColumn style={{ maxWidth: maxWidth || 'unset', width: '100%' }}>
      <FlexRow $gap={16} style={{ padding: '16px' }}>
        <IconTitleBadge icon={getEntityIcon(ENTITY_TYPES.ACTION)} title='Instrumentation Rules' badge={instrumentationRules.length} />
      </FlexRow>

      <TableWrap $maxHeight={maxHeight}>
        <InteractiveTable
          columns={columns}
          rows={rows}
          onRowClick={(idx) => {
            setDrawerType(ENTITY_TYPES.INSTRUMENTATION_RULE)
            setDrawerEntityId(instrumentationRules[idx].ruleId)
          }}
        />
      </TableWrap>

      {!instrumentationRules.length && (
        <CenterThis style={{ marginTop: '2rem' }}>
          <NoDataFound />
        </CenterThis>
      )}
    </FlexColumn>
  )
}

export { InstrumentationRuleTable, type InstrumentationRuleTableProps }
