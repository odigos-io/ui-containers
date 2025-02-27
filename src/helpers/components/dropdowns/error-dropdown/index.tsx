import React, { useMemo } from 'react'
import { Dropdown, type DropdownProps } from '@odigos/ui-components'
import { mapConditions, NOTIFICATION_TYPE, type Source } from '@odigos/ui-utils'

interface ErrorDropdownProps {
  sources: Source[]

  title?: string
  value?: DropdownProps['options']
  onSelect: (val: DropdownProps['options'][0]) => void
  onDeselect: (val: DropdownProps['options'][0]) => void
  disabled?: boolean
  isMulti?: boolean
  required?: boolean
  showSearch?: boolean
}

const ErrorDropdown: React.FC<ErrorDropdownProps> = ({ sources, title = 'Error Message', value, onSelect, onDeselect, disabled, ...props }) => {
  const options = useMemo(() => {
    const payload: DropdownProps['options'] = []

    sources.forEach(({ conditions }) => {
      mapConditions(conditions || []).forEach(({ status, message, reason }) => {
        if (status === NOTIFICATION_TYPE.ERROR && !payload.find((opt) => opt.id === message)) {
          if (!!message) {
            if (!payload.find((opt) => opt.id === message)) payload.push({ id: message, value: message })
          } else if (!!reason) {
            if (!payload.find((opt) => opt.id === reason)) payload.push({ id: reason, value: reason })
          }
        }
      })
    })

    return payload
  }, [sources])

  return (
    <Dropdown
      disabled={disabled || !options?.length}
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

export { ErrorDropdown, type ErrorDropdownProps }
