import React, { type FC } from 'react'
import Theme from '@odigos/ui-theme'
import { Text } from '@odigos/ui-components'
import { isOverTime, useTimeAgo } from '@odigos/ui-utils'

interface ExpiresAtProps {
  expiresAt: number
}

const SEVEN_DAYS_IN_MS = 604800000

const ExpiresAt: FC<ExpiresAtProps> = ({ expiresAt }) => {
  const theme = Theme.useTheme()
  const timeAgo = useTimeAgo()

  const countdown = timeAgo.format(expiresAt)
  const dateDisplay = new Date(expiresAt).toDateString().split(' ').slice(1).join(' ')

  const color = isOverTime(expiresAt, 0) ? theme.text.error : isOverTime(expiresAt, SEVEN_DAYS_IN_MS) ? theme.text.warning : theme.text.success

  return (
    <Text size={14} color={color}>
      {countdown} ({dateDisplay})
    </Text>
  )
}

export { ExpiresAt, type ExpiresAtProps }
