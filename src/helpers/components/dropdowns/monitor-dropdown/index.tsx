import React, { type FC, useMemo } from 'react'
import { MONITORS_OPTIONS } from '@odigos/ui-utils'
import { Dropdown, type DropdownProps } from '@odigos/ui-components'

interface MonitorDropdownProps {
  title?: string
  value?: DropdownProps['options']
  onSelect: (val: DropdownProps['options'][0]) => void
  onDeselect: (val: DropdownProps['options'][0]) => void
  isMulti?: boolean
  required?: boolean
  showSearch?: boolean
}

const MonitorDropdown: FC<MonitorDropdownProps> = ({ title = 'Monitors', value, onSelect, onDeselect, ...props }) => {
  const options = useMemo(() => {
    const payload: DropdownProps['options'] = []

    MONITORS_OPTIONS.forEach(({ id, value }) => {
      if (!payload.find((opt) => opt.id === id)) payload.push({ id, value })
    })

    return payload
  }, [])

  return (
    <Dropdown
      disabled={!options?.length}
      title={title}
      placeholder='All'
      options={options}
      value={value}
      onSelect={onSelect}
      onDeselect={onDeselect}
      {...props}
    />
  )
}

export { MonitorDropdown, type MonitorDropdownProps }
