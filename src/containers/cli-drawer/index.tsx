import React from 'react'
import styled from 'styled-components'
import { Drawer } from '@odigos/ui-components'
import { TerminalIcon } from '@odigos/ui-icons'
import { Tokens, type TokensProps } from './tokens'
import { Describe, type DescribeProps } from './describe'
import { DRAWER_OTHER_TYPES, useDrawerStore } from '../../store'

interface CliDrawerProps extends TokensProps, DescribeProps {}

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const DRAWER_WIDTH = '750px'

const CliDrawer: React.FC<CliDrawerProps> = ({ tokens, saveToken, describe }) => {
  const { drawerType, setDrawerType } = useDrawerStore()

  return (
    <Drawer
      isOpen={drawerType === DRAWER_OTHER_TYPES.ODIGOS_CLI}
      onClose={() => setDrawerType(null)}
      width={DRAWER_WIDTH}
      header={{
        icon: TerminalIcon,
        title: 'Odigos CLI',
      }}
      footer={{
        isOpen: false,
      }}
    >
      <DataContainer>
        <Tokens tokens={tokens} saveToken={saveToken} />
        <Describe describe={describe} />
      </DataContainer>
    </Drawer>
  )
}

export { CliDrawer, type CliDrawerProps }
