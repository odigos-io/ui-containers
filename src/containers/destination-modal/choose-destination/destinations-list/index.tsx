import React, { type FC } from 'react'
import styled from 'styled-components'
import { DataTab, SectionTitle } from '@odigos/ui-components'
import type { DestinationCategories } from '../../../../@types'
import { capitalizeFirstLetter, SIGNAL_TYPE } from '@odigos/ui-utils'

interface DestinationsListProps {
  items: DestinationCategories
  setSelectedItem: (item: DestinationCategories[0]['items'][0]) => void
}

const ListsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const DestinationsList: FC<DestinationsListProps> = ({ items, setSelectedItem }) => {
  return items.map((category) => {
    return (
      <ListsWrapper key={`category-${category.name}`}>
        <SectionTitle size='small' title={capitalizeFirstLetter(category.name)} description={category.description} />
        {category.items.map((item, idx) => (
          <DataTab
            key={`select-destination-${item.type}-${idx}`}
            data-id={`select-destination-${item.type}`}
            title={item.displayName}
            iconSrc={item.imageUrl}
            hoverText='Select'
            monitors={Object.keys(item.supportedSignals).filter((signal) => item.supportedSignals[signal as SIGNAL_TYPE].supported) as SIGNAL_TYPE[]}
            monitorsWithLabels
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </ListsWrapper>
    )
  })
}

export { DestinationsList, type DestinationsListProps }
