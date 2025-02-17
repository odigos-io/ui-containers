import React, { type FC } from 'react'
import type { Platform } from '../../@types'
import { useFilterStore } from '../../store'
import { OdigosLogo } from '@odigos/ui-icons'
import { getPlatformIcon, getPlatformLabel, NOTIFICATION_TYPE } from '@odigos/ui-utils'
import { InteractiveTable, InteractiveTableProps, Status } from '@odigos/ui-components'

interface ComputePlatformsProps {
  computePlatforms: Platform[]
  onSelect: (payload: Platform) => void
}

const ComputePlatforms: FC<ComputePlatformsProps> = ({ computePlatforms, onSelect }) => {
  const { searchText, platformTypes } = useFilterStore()

  const filtered = computePlatforms.filter(
    ({ id, type }) =>
      (!searchText || id.toLowerCase().includes(searchText)) && (!platformTypes?.length || platformTypes.find((opt) => opt.id === type))
  )

  return (
    <InteractiveTable
      columns={[
        { key: 'icon', title: '' },
        { key: 'name', title: 'Name' },
        { key: 'type', title: 'Type' },
        { key: 'status', title: 'Status' },
        { key: 'id', title: 'Unique ID' },
      ]}
      rows={
        filtered.map(({ id, name, type, connectionStatus }) => [
          { columnKey: 'id', value: id },
          { columnKey: 'type', value: type },
          { columnKey: 'name', value: !!name ? name : getPlatformLabel(type) },
          { columnKey: 'icon', icon: getPlatformIcon(type) },
          {
            columnKey: 'status',
            component: () => (
              <div style={{ lineHeight: 1 }}>
                <Status
                  title={connectionStatus === NOTIFICATION_TYPE.SUCCESS ? 'connection alive' : 'connection lost'}
                  status={connectionStatus}
                  withIcon
                  withBorder
                />
              </div>
            ),
          },
        ]) as InteractiveTableProps['rows']
      }
      onRowClick={(idx) => onSelect(filtered[idx])}
    />
  )
}

export { ComputePlatforms, type ComputePlatformsProps }
