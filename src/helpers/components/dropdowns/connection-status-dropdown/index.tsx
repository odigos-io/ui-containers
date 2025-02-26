import React, { type FC, useMemo } from 'react'
import type { Platform } from '../../../../@types'
import { Dropdown, type DropdownProps } from '@odigos/ui-components'

interface ConnectionStatusDropdownProps {
  computePlatforms: Platform[]

  title?: string
  value?: DropdownProps['options']
  onSelect: (val: DropdownProps['options'][0]) => void
  onDeselect: (val: DropdownProps['options'][0]) => void
  isMulti?: boolean
  required?: boolean
  showSearch?: boolean
}

const ConnectionStatusDropdown: FC<ConnectionStatusDropdownProps> = ({ computePlatforms, title = '', value, onSelect, onDeselect, ...props }) => {
  const options = useMemo(() => {
    const payload: DropdownProps['options'] = []

    computePlatforms?.forEach(({ connectionStatus }) => {
      if (!payload.find((opt) => opt.id === connectionStatus)) {
        payload.push({ id: connectionStatus, value: connectionStatus })
      }
    })

    return payload
  }, [computePlatforms])

  return <Dropdown title={title} placeholder='All Statuses' options={options} value={value} onSelect={onSelect} onDeselect={onDeselect} {...props} />
}

export { ConnectionStatusDropdown, type ConnectionStatusDropdownProps }
