import React, { type FC } from 'react'
import { SlackLogo } from '@odigos/ui-icons'
import { IconButton } from '@odigos/ui-components'

interface SlackInviteProps {}

const SLACK_LINK = 'https://join.slack.com/t/odigos/shared_invite/zt-2wc6gm4j9-EhcVFYrLwHqvcIErO9sVzw'

const SlackInvite: FC<SlackInviteProps> = ({}) => {
  return (
    <IconButton onClick={() => window.open(SLACK_LINK, '_blank', 'noopener noreferrer')} tooltip='Join our Slack community'>
      <SlackLogo />
    </IconButton>
  )
}

export { SlackInvite, type SlackInviteProps }
