import React, { type FC } from 'react'
import type { Platform } from '../../@types'
import { K8sLogo, OdigosLogo } from '@odigos/ui-icons'
import { NOTIFICATION_TYPE, PLATFORM_TYPE } from '@odigos/ui-utils'
import { InteractiveTable, InteractiveTableProps, Status } from '@odigos/ui-components'

interface ComputePlatformsProps {
  computePlatforms: Platform[]
  onSelect: (payload: Platform) => void
}

const ComputePlatforms: FC<ComputePlatformsProps> = ({ computePlatforms, onSelect }) => {
  return (
    <InteractiveTable
      columns={[
        { key: 'icon', title: '' },
        { key: 'name', title: 'Name' },
        { key: 'type', title: 'Type' },
        { key: 'status', title: 'Status' },
      ]}
      rows={
        computePlatforms.map(({ id, type, connectionStatus }) => [
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
      onRowClick={(idx) => onSelect(computePlatforms[idx])}
    />
  )
}

export { ComputePlatforms, type ComputePlatformsProps }
