import React, { type CSSProperties, type FC } from 'react'
import styled from 'styled-components'
import { useDrawerStore } from '../../store'
import {
  CenterThis,
  FlexColumn,
  FlexRow,
  IconTitleBadge,
  IconWrapped,
  InteractiveTable,
  InteractiveTableProps,
  NoDataFound,
  Status,
} from '@odigos/ui-components'
import {
  ENTITY_TYPES,
  getEntityIcon,
  getEntityLabel,
  getInstrumentationRuleIcon,
  type InstrumentationRule,
  NOTIFICATION_TYPE,
} from '@odigos/ui-utils'

interface InstrumentationRuleTableProps {
  instrumentationRules: InstrumentationRule[]
  tableMaxHeight?: CSSProperties['maxHeight']
}

const TableWrap = styled.div<{ $maxHeight: InstrumentationRuleTableProps['tableMaxHeight'] }>`
  width: 100%;
  max-height: ${({ $maxHeight }) => $maxHeight || 'unset'};
  overflow-y: auto;
`

const InstrumentationRuleTable: FC<InstrumentationRuleTableProps> = ({ instrumentationRules, tableMaxHeight }) => {
  const { setDrawerType, setDrawerEntityId } = useDrawerStore()

  const filtered = instrumentationRules

  return (
    <FlexColumn style={{ width: '100%' }}>
      <FlexRow $gap={16} style={{ padding: '16px' }}>
        <IconTitleBadge
          icon={getEntityIcon(ENTITY_TYPES.ACTION)}
          title='Instrumentation Rules'
          badge={filtered.length !== instrumentationRules.length ? `${filtered.length}/${instrumentationRules.length}` : instrumentationRules.length}
        />
      </FlexRow>

      <TableWrap $maxHeight={tableMaxHeight}>
        <InteractiveTable
          columns={[
            { key: 'icon', title: '' },
            { key: 'name', title: 'Name' },
            { key: 'type', title: 'Type' },
            { key: 'active-status', title: 'Status' },
            { key: 'source-count', title: 'Applicable Source' },
            { key: 'notes', title: 'Notes' },
          ]}
          rows={filtered.map((rule) => {
            return {
              cells: [
                {
                  columnKey: 'icon',
                  component: () => <IconWrapped icon={getInstrumentationRuleIcon(rule.type)} />,
                },
                { columnKey: 'name', value: getEntityLabel(rule, ENTITY_TYPES.INSTRUMENTATION_RULE, { prioritizeDisplayName: true }) },
                { columnKey: 'type', value: rule.type },
                { columnKey: 'notes', value: rule.notes },
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
              ] as InteractiveTableProps['rows'][0]['cells'],
            }
          })}
          onRowClick={(idx) => {
            setDrawerType(ENTITY_TYPES.INSTRUMENTATION_RULE)
            setDrawerEntityId(filtered[idx].ruleId)
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

export { InstrumentationRuleTable, type InstrumentationRuleTableProps }
