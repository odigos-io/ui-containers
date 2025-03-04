import React, { useId, type FC } from 'react'
import Theme from '@odigos/ui-theme'
import { FlexRow, Status, Tooltip } from '@odigos/ui-components'
import { type Condition, getStatusIcon, mapConditions, NOTIFICATION_TYPE } from '@odigos/ui-utils'

interface TableCellConditionsProps {
  conditions: Condition[]
}

const TableCellConditions: FC<TableCellConditionsProps> = ({ conditions }) => {
  const errors = conditions?.filter(({ status }) => status === NOTIFICATION_TYPE.ERROR) || []
  const warnings = conditions?.filter(({ status }) => status === NOTIFICATION_TYPE.WARNING) || []
  const disableds = conditions?.filter(({ status }) => status === 'disabled') || []
  const isLoading = !conditions?.length || !!conditions?.find(({ status }) => status === 'loading')

  return (
    <div style={{ lineHeight: 1 }}>
      {!!errors.length ? (
        <ConditionsStatuses conditions={errors} />
      ) : !!warnings.length ? (
        <ConditionsStatuses conditions={warnings} />
      ) : !!disableds.length ? (
        <ConditionsStatuses conditions={disableds} />
      ) : isLoading ? (
        <Status status='loading' title='loading' withBorder withIcon />
      ) : (
        <Status status={NOTIFICATION_TYPE.SUCCESS} title='success' withBorder withIcon />
      )}
    </div>
  )
}

const ConditionsStatuses: FC<TableCellConditionsProps> = ({ conditions }) => {
  const theme = Theme.useTheme()

  return (
    <FlexRow>
      {mapConditions(conditions).map(({ status, type, reason, message, lastTransitionTime }) => {
        if (status === 'loading' || status === 'disabled') status = NOTIFICATION_TYPE.INFO
        const icon = getStatusIcon(status, theme)

        return (
          <Tooltip key={useId()} titleIcon={icon} title={type} text={message || reason || ''} timestamp={lastTransitionTime}>
            <Status status={status} title={type} withBorder withIcon />
          </Tooltip>
        )
      })}
    </FlexRow>
  )
}

export { TableCellConditions, type TableCellConditionsProps }
