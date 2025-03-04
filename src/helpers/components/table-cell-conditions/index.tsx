import React, { useId, type FC } from 'react'
import Theme from '@odigos/ui-theme'
import { FlexRow, Status, Tooltip } from '@odigos/ui-components'
import { type Condition, getStatusIcon, mapConditions, NOTIFICATION_TYPE, OTHER_STATUS } from '@odigos/ui-utils'

interface TableCellConditionsProps {
  conditions: Condition[]
}

const TableCellConditions: FC<TableCellConditionsProps> = ({ conditions }) => {
  const errors = conditions?.filter(({ status }) => status === NOTIFICATION_TYPE.ERROR) || []
  const warnings = conditions?.filter(({ status }) => status === NOTIFICATION_TYPE.WARNING) || []
  const disableds = conditions?.filter(({ status }) => status === OTHER_STATUS.DISABLED) || []
  const isLoading = !conditions?.length || !!conditions?.find(({ status }) => status === OTHER_STATUS.LOADING)

  return (
    <div style={{ lineHeight: 1 }}>
      {!!errors.length ? (
        <ConditionsStatuses conditions={errors} />
      ) : !!warnings.length ? (
        <ConditionsStatuses conditions={warnings} />
      ) : !!disableds.length ? (
        <ConditionsStatuses conditions={disableds} />
      ) : isLoading ? (
        <Status status={OTHER_STATUS.LOADING} title={OTHER_STATUS.LOADING} withBorder withIcon />
      ) : (
        <Status status={NOTIFICATION_TYPE.SUCCESS} title={NOTIFICATION_TYPE.SUCCESS} withBorder withIcon />
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
