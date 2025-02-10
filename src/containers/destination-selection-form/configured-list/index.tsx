import React, { type FC, useState } from 'react'
import styled from 'styled-components'
import { TrashIcon } from '@odigos/ui-icons'
import { ENTITY_TYPES, SIGNAL_TYPE } from '@odigos/ui-utils'
import { useSetupStore, type ISetupState } from '../../../store'
import { DataCardFields, DataTab, DeleteWarning, IconButton } from '@odigos/ui-components'

interface ConfiguredListProps {}

interface ListItemProps {
  item: ISetupState['configuredDestinations'][0]['stored']
  isLastItem: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-top: 24px;
  max-height: calc(100vh - 400px);
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
`

const ConfiguredList: FC<ConfiguredListProps> = () => {
  const { configuredDestinations } = useSetupStore()

  return (
    <Container>
      {configuredDestinations.map(({ stored }, idx) => (
        <ListItem
          key={`selected-destination-${stored.type}-${idx}`}
          data-id={`selected-destination-${stored.type}`}
          item={stored}
          isLastItem={configuredDestinations.length === 1}
        />
      ))}
    </Container>
  )
}

const ListItem: FC<ListItemProps> = ({ item, isLastItem, ...props }) => {
  const { removeConfiguredDestination } = useSetupStore()
  const [deleteWarning, setDeleteWarning] = useState(false)

  return (
    <>
      <DataTab
        title={item.displayName}
        iconSrc={item.imageUrl}
        monitors={Object.keys(item.exportedSignals).filter((signal) => item.exportedSignals[signal as SIGNAL_TYPE] === true) as SIGNAL_TYPE[]}
        monitorsWithLabels
        withExtend
        renderExtended={() => <DataCardFields data={item.destinationTypeDetails} />}
        renderActions={() => (
          <IconButton onClick={() => setDeleteWarning(true)}>
            <TrashIcon />
          </IconButton>
        )}
        {...props}
      />

      <DeleteWarning
        isOpen={deleteWarning}
        name={item.displayName || item.type}
        type={ENTITY_TYPES.DESTINATION}
        isLastItem={isLastItem}
        onApprove={() => removeConfiguredDestination(item)}
        onDeny={() => setDeleteWarning(false)}
      />
    </>
  )
}

export { ConfiguredList, type ConfiguredListProps }
