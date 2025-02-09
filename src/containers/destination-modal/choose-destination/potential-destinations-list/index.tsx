import React, { type FC } from 'react'
import styled from 'styled-components'
import { OdigosLogo } from '@odigos/ui-icons'
import { SIGNAL_TYPE } from '@odigos/ui-utils'
import { DataTab, SectionTitle } from '@odigos/ui-components'
import type { DestinationCategories } from '../../../../@types'

interface PotentialDestinationsListProps {
  items: DestinationCategories[0]['items']
  setSelectedItem: (item: DestinationCategories[0]['items'][0]) => void
}

const ListsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const PotentialDestinationsList: FC<PotentialDestinationsListProps> = ({ items, setSelectedItem }) => {
  if (!items.length) return null

  return (
    <ListsWrapper>
      <SectionTitle
        size='small'
        icon={OdigosLogo}
        title='Detected by Odigos'
        description='Odigos detects destinations for which automatic connection is available. All data will be filled out automatically.'
      />
      {items.map((item, idx) => (
        <DataTab
          key={`select-potential-destination-${item.type}-${idx}`}
          data-id={`select-potential-destination-${item.type}`}
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
}

export { PotentialDestinationsList, type PotentialDestinationsListProps }
