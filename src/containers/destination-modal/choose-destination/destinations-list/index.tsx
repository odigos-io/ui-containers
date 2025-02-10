import React, { type FC } from 'react'
import { styled } from '@odigos/ui-theme'
import { DataTab, SectionTitle } from '@odigos/ui-components'
import { capitalizeFirstLetter, type DestinationCategories, type DestinationOption, SIGNAL_TYPE } from '@odigos/ui-utils'

interface DestinationsListProps {
  items: DestinationCategories
  setSelectedItem: (item: DestinationOption) => void
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
