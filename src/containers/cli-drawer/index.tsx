import React, { useState } from 'react'
import styled from 'styled-components'
import { TerminalIcon } from '@odigos/ui-icons'
import { Tokens, type TokensProps } from './tokens'
import { Describe, type DescribeProps } from './describe'
import { Drawer, IconButton } from '@odigos/ui-components'

interface CliDrawerProps extends TokensProps, DescribeProps {}

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const DRAWER_WIDTH = '750px'

const CliDrawer: React.FC<CliDrawerProps> = ({ tokens, saveToken, fetchDescribeOdigos }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen((prev) => !prev)

  return (
    <>
      <IconButton key='cli' onClick={toggleOpen} tooltip='Odigos CLI'>
        <TerminalIcon size={18} />
      </IconButton>

      <Drawer
        width={DRAWER_WIDTH}
        isOpen={isOpen}
        onClose={toggleOpen}
        header={{
          icon: TerminalIcon,
          title: 'Odigos CLI',
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

export { CliDrawer, type CliDrawerProps }
