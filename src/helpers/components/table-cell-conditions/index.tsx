import React, { useId, useMemo, type FC } from 'react'
import Theme from '@odigos/ui-theme'
import { FlexRow, Status, Tooltip } from '@odigos/ui-components'
import { type Condition, getStatusIcon, mapConditions, NOTIFICATION_TYPE, OTHER_STATUS } from '@odigos/ui-utils'

interface TableCellConditionsProps {
  conditions: Condition[]
}

const TableCellConditions: FC<TableCellConditionsProps> = ({ conditions }) => {
  const errors = useMemo(() => conditions?.filter(({ status }) => status === NOTIFICATION_TYPE.ERROR) || [], [conditions])
  const warnings = useMemo(() => conditions?.filter(({ status }) => status === NOTIFICATION_TYPE.WARNING) || [], [conditions])
  const disableds = useMemo(() => conditions?.filter(({ status }) => status === OTHER_STATUS.DISABLED) || [], [conditions])
  const isLoading = useMemo(() => !conditions?.length || !!conditions?.find(({ status }) => status === OTHER_STATUS.LOADING), [conditions])

  return (
    <div style={{ lineHeight: 1 }}>
      {errors.length > 0 ? (
        <ConditionsStatuses conditions={errors} />
      ) : warnings.length > 0 ? (
        <ConditionsStatuses conditions={warnings} />
      ) : disableds.length > 0 ? (
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
