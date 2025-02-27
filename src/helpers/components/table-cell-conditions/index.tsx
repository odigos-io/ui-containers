import React, { useId, type FC } from 'react'
import { ErrorTriangleIcon } from '@odigos/ui-icons'
import { FlexRow, Status, Tooltip } from '@odigos/ui-components'
import { Condition, FetchedCondition, mapConditions, NOTIFICATION_TYPE } from '@odigos/ui-utils'

interface TableCellConditionsProps {
  conditions: (FetchedCondition | Condition)[]
}

const TableCellConditions: FC<TableCellConditionsProps> = ({ conditions }) => {
  return (
    <FlexRow>
      {mapConditions(conditions).map(({ type, reason, message, lastTransitionTime }) => (
        <Tooltip key={useId()} titleIcon={ErrorTriangleIcon} title={type} text={message || reason || ''} timestamp={lastTransitionTime}>
          <Status status={NOTIFICATION_TYPE.ERROR} title={type} withBorder withIcon />
        </Tooltip>
      ))}
    </FlexRow>
  )
}

export { TableCellConditions, type TableCellConditionsProps }
