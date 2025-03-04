import React from 'react'
import { Search } from './search'
import { Filters } from './filters'
import Theme from '@odigos/ui-theme'
import styled from 'styled-components'
import { PlusIcon } from '@odigos/ui-icons'
import { ENTITY_TYPES } from '@odigos/ui-utils'
import { Button, Text } from '@odigos/ui-components'
import { useEntityStore, useModalStore } from '../../store'

interface DataFlowActionsMenuProps {
  namespaces: { name: string }[]
  addEntity?: ENTITY_TYPES
}

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  padding: 0 16px;
  gap: 8px;
`

// Aligns the "Add" button to the far-right
const PushToEnd = styled.div`
  margin-left: auto;
`

const AddButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 160px;
  padding-right: 24px;
`

const DataFlowActionsMenu: React.FC<DataFlowActionsMenuProps> = ({ namespaces, addEntity }) => {
  const theme = Theme.useTheme()
  const { setCurrentModal } = useModalStore()
  const { sources, destinations, actions, instrumentationRules } = useEntityStore()

  return (
    <Container>
      <Search />
      <Filters namespaces={namespaces} sources={sources} />

      {addEntity && (
        <PushToEnd>
          <AddButton data-id={`add-${addEntity}`} onClick={() => setCurrentModal(addEntity)}>
            <PlusIcon fill={theme.colors.primary} />
            <Text size={14} family='secondary' color={theme.text.primary} weight={600}>
              ADD {addEntity}
            </Text>
          </AddButton>
        </PushToEnd>
      )}
    </Container>
  )
}

export { DataFlowActionsMenu, type DataFlowActionsMenuProps }
