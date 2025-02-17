import React, { type FC } from 'react'
import type { Platform } from '../../@types'
import { useFilterStore } from '../../store'
import { K8sLogo, OdigosLogo } from '@odigos/ui-icons'
import { NOTIFICATION_TYPE, PLATFORM_TYPE } from '@odigos/ui-utils'
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
      ]}
      rows={
        filtered.map(({ id, type, connectionStatus }) => [
          { columnKey: 'icon', icon: type === PLATFORM_TYPE.K8S ? K8sLogo : OdigosLogo },
          { columnKey: 'name', value: id },
          { columnKey: 'type', value: type },
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
