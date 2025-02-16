import React from 'react'
import { Search } from './search'
import { Filters } from './filters'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
// import { AddEntity } from './add-entity'
import { type AllEntities } from '../../@types'
import { OverviewIcon } from '@odigos/ui-icons'
import { Divider, Text, Tooltip } from '@odigos/ui-components'

interface DataFlowActionsMenuProps extends AllEntities {
  namespaces: { name: string }[]
}

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  padding: 0 16px;
  gap: 8px;
`

const TabContainer = styled.div<{ $selected: boolean; $disabled: boolean; $noClick: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 32px;
  cursor: ${({ $noClick, $disabled }) => ($noClick ? 'unset' : $disabled ? 'not-allowed' : 'pointer')};
  background-color: ${({ $noClick, $selected, theme }) =>
    $noClick ? 'transparent' : $selected ? theme.colors.majestic_blue + Theme.opacity.hex['024'] : theme.colors.secondary + Theme.opacity.hex['004']};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${({ $noClick, $disabled, theme }) => ($noClick || $disabled ? 'none' : theme.colors.majestic_blue + Theme.opacity.hex['024'])};
  }

  svg {
    margin-right: 8px;
  }
`

const TabListContainer = styled.div`
  display: flex;
  gap: 8px;
`

// Aligns the "AddEntity" button to the right.
const PushToEnd = styled.div`
  margin-left: auto;
`

const DataFlowActionsMenu: React.FC<DataFlowActionsMenuProps> = ({ namespaces, sources, destinations, actions, instrumentationRules }) => {
  const theme = Theme.useTheme()

  return (
    <Container>
      <TabListContainer>
        {[
          {
            title: 'Overview',
            icon: OverviewIcon,
            selected: true,
            disabled: false,
            onClick: () => {},
            tooltip: '',
          },
          // {
          //   title: 'Service Map',
          //   icon: ServiceMapIcon,
          //   selected: false,
          //   onClick: () => {},
          //   disabled: true,
          //   tooltip: 'Coming soon',
          // },
          // {
          //   title: 'Trace View',
          //   icon: TraceViewIcon,
          //   selected: false,
          //   onClick: () => {},
          //   disabled: true,
          //   tooltip: 'Coming soon',
          // },
        ].map(({ title, tooltip, icon: Icon, selected, disabled, onClick }) => (
          <Tooltip key={`tab-${title}`} text={tooltip}>
            <TabContainer $selected={selected} $disabled={disabled} $noClick={!onClick} onClick={onClick}>
              <Icon size={14} />
              <Text size={14}>{title}</Text>
            </TabContainer>
          </Tooltip>
        ))}
      </TabListContainer>

      <Divider orientation='vertical' length='20px' margin='0' />
      <Search sources={sources} destinations={destinations} actions={actions} instrumentationRules={instrumentationRules} />
      <Filters namespaces={namespaces} sources={sources} />
      {/* <MonitorsIcons withLabels color={theme.text.dark_grey} /> */}

      {/* <PushToEnd>
        <AddEntity />
      </PushToEnd> */}
    </Container>
  )
}

export { DataFlowActionsMenu, type DataFlowActionsMenuProps }
