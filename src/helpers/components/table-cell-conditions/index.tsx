import React, { useId, type FC } from 'react'
import Theme from '@odigos/ui-theme'
import { FlexRow, Status, Tooltip } from '@odigos/ui-components'
import { type Condition, getStatusIcon, mapConditions, NOTIFICATION_TYPE } from '@odigos/ui-utils'

interface TableCellConditionsProps {
  conditions: Condition[]
}

const TableCellConditions: FC<TableCellConditionsProps> = ({ conditions }) => {
  const theme = Theme.useTheme()

  return (
    <FlexRow>
      {mapConditions(conditions).map(({ status, type, reason, message, lastTransitionTime }) => {
        if (status === 'loading') status = NOTIFICATION_TYPE.INFO
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
