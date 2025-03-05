import React, { type FC, useState } from 'react'
import styled from 'styled-components'
import { TerminalIcon } from '@odigos/ui-icons'
import { Tokens, type TokensProps } from './tokens'
import { Describe, type DescribeProps } from './describe'
import { Drawer, IconButton } from '@odigos/ui-components'

interface SystemOverviewProps extends TokensProps, DescribeProps {}

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const DRAWER_WIDTH = '750px'
const TITLE_TEXT = 'System Overview'

const SystemOverview: FC<SystemOverviewProps> = ({ tokens, saveToken, fetchDescribeOdigos }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen((prev) => !prev)

  return (
    <>
      <IconButton key='cli' onClick={toggleOpen} tooltip={TITLE_TEXT}>
        <TerminalIcon size={18} />
      </IconButton>

      <Drawer
        width={DRAWER_WIDTH}
        isOpen={isOpen}
        onClose={toggleOpen}
        header={{
          icon: TerminalIcon,
          title: TITLE_TEXT,
        }}
        footer={{
          isOpen: false,
        }}
      >
        <DataContainer>
          {!!tokens?.length && <Tokens tokens={tokens} saveToken={saveToken} />}
          <Describe fetchDescribeOdigos={fetchDescribeOdigos} />
        </DataContainer>
      </Drawer>
    </>
  )
}

export { SystemOverview, type SystemOverviewProps }
