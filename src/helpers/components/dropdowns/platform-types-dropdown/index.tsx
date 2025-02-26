import React, { type FC, useMemo } from 'react'
import type { Platform } from '../../../../@types'
import { Dropdown, type DropdownProps } from '@odigos/ui-components'

interface PlatformTypesDropdownProps {
  computePlatforms: Platform[]

  title?: string
  value?: DropdownProps['options']
  onSelect: (val: DropdownProps['options'][0]) => void
  onDeselect: (val: DropdownProps['options'][0]) => void
  isMulti?: boolean
  required?: boolean
  showSearch?: boolean
}

const PlatformTypesDropdown: FC<PlatformTypesDropdownProps> = ({ computePlatforms, title = '', value, onSelect, onDeselect, ...props }) => {
  const options = useMemo(() => {
    const payload: DropdownProps['options'] = []

    computePlatforms?.forEach(({ type }) => {
      if (!payload.find((opt) => opt.id === type)) {
        payload.push({ id: type, value: type })
      }
    })

    return payload
  }, [computePlatforms])

  return <Dropdown title={title} placeholder='All Types' options={options} value={value} onSelect={onSelect} onDeselect={onDeselect} {...props} />
}

export { PlatformTypesDropdown, type PlatformTypesDropdownProps }
